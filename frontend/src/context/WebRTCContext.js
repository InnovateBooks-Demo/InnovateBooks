import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { Phone, Video as VideoIcon, PhoneOff } from 'lucide-react';
import axios from 'axios';

const WebRTCContext = createContext();

export const useWebRTCContext = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTCContext must be used within WebRTCProvider');
  }
  return context;
};

export const WebRTCProvider = ({ children, userId }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [callInfo, setCallInfo] = useState(null);
  const [callerDetails, setCallerDetails] = useState(null);
  const [isRinging, setIsRinging] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const ringtoneRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
  const token = localStorage.getItem('access_token');

  // WebRTC hook
  const {
    isConnected: webrtcConnected,
    callState,
    localStream,
    remoteStream,
    currentCallId,
    startCall: initiateCall,
    answerCall: acceptCall,
    rejectCall: declineCall,
    endCall: terminateCall
  } = useWebRTC(
    userId,
    async (call) => {
      console.log('Incoming call:', call);
      setIncomingCall(call);
      setCallInfo({
        callId: call.callId,
        partnerId: call.from,
        type: call.callType,
        direction: 'incoming'
      });
      
      // Play ringtone
      setIsRinging(true);
      if (ringtoneRef.current) {
        ringtoneRef.current.play().catch(e => console.error('Ringtone error:', e));
      }
      
      // Fetch caller details
      try {
        const response = await axios.get(`${BACKEND_URL}/api/users/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const caller = response.data.find(u => u.id === call.from);
        if (caller) {
          setCallerDetails(caller);
        }
      } catch (error) {
        console.error('Error fetching caller details:', error);
      }
    },
    (reason) => {
      console.log('Call ended:', reason);
      stopRingtone();
      setIncomingCall(null);
      setCallInfo(null);
      setCallerDetails(null);
    }
  );

  const stopRingtone = () => {
    setIsRinging(false);
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  // Update video/audio elements when streams change
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream) {
      console.log('Setting remote stream, tracks:', remoteStream.getTracks());
      
      // Set video
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      
      // Set audio
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch(e => console.error('Audio play error:', e));
      }
    }
  }, [remoteStream]);

  const startCall = async (targetUserId, callType) => {
    setCallInfo({
      partnerId: targetUserId,
      type: callType,
      direction: 'outgoing'
    });
    await initiateCall(targetUserId, callType);
  };

  const answerCall = async () => {
    stopRingtone();
    await acceptCall();
    setIncomingCall(null);
  };

  const rejectCall = () => {
    stopRingtone();
    declineCall();
    setIncomingCall(null);
    setCallInfo(null);
  };

  const endCall = () => {
    stopRingtone();
    terminateCall();
    setCallInfo(null);
  };

  return (
    <WebRTCContext.Provider value={{
      callState,
      callInfo,
      callerDetails,
      startCall,
      answerCall,
      rejectCall,
      endCall,
      webrtcConnected
    }}>
      {children}
      
      {/* Hidden audio/video elements */}
      <audio ref={remoteAudioRef} autoPlay playsInline />
      <video ref={localVideoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <video ref={remoteVideoRef} autoPlay playsInline style={{ display: 'none' }} />
      
      {/* Ringtone */}
      <audio ref={ringtoneRef} loop>
        <source src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" type="audio/mpeg" />
      </audio>

      {/* Global Incoming Call Notification */}
      {incomingCall && callState === 'ringing' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              {callerDetails?.profile_photo ? (
                <img 
                  src={`${BACKEND_URL}${callerDetails.profile_photo}`}
                  alt={callerDetails.full_name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-2xl border-4 border-[#3A4E63]/20 animate-pulse"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-[#3A4E63] to-[#0147CC] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                  {incomingCall.callType === 'video' ? (
                    <VideoIcon className="h-12 w-12 text-white" strokeWidth={2.5} />
                  ) : (
                    <Phone className="h-12 w-12 text-white" strokeWidth={2.5} />
                  )}
                </div>
              )}
              <h3 className="text-2xl font-black text-[#3A4E63] mb-2">
                Incoming {incomingCall.callType === 'video' ? 'Video' : 'Audio'} Call
              </h3>
              <p className="text-lg text-[#3A4E63] font-bold mb-2">
                {callerDetails?.full_name || 'Unknown User'}
              </p>
              <p className="text-sm text-[#3A4E63]/60 font-semibold mb-8">
                {callerDetails?.email || ''}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={rejectCall}
                  className="flex-1 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <PhoneOff className="h-5 w-5" strokeWidth={2.5} />
                  Decline
                </button>
                <button
                  onClick={answerCall}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" strokeWidth={2.5} />
                  Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Active Call UI */}
      {(callState === 'calling' || callState === 'active') && callInfo && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#3A4E63] to-[#0147CC] flex flex-col z-[9999]">
          <div className="p-6 text-center">
            <h3 className="text-2xl font-black text-white mb-2">
              {callState === 'calling' ? 'Calling...' : 'Connected'}
            </h3>
            <p className="text-xl text-white/90 font-bold">
              {callerDetails?.full_name || 'User'}
            </p>
            {callState === 'active' && (
              <p className="text-sm text-white/70 font-semibold mt-1">
                {callInfo.type === 'video' ? 'Video Call' : 'Audio Call'} • Active
              </p>
            )}
          </div>

          <div className="flex-1 relative">
            {callInfo.type === 'video' ? (
              <>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute top-4 right-4 w-48 h-36 object-cover rounded-2xl shadow-2xl border-4 border-white/30"
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border-4 border-white/30 shadow-2xl animate-pulse">
                  <Phone className="h-20 w-20 text-white" strokeWidth={2} />
                </div>
              </div>
            )}
          </div>

          <div className="p-8 flex justify-center gap-6">
            <button
              onClick={endCall}
              className="p-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl transition-all"
              title="End Call"
            >
              <PhoneOff className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </WebRTCContext.Provider>
  );
};

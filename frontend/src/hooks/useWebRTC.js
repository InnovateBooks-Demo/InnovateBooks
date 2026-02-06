import { useState, useEffect, useRef } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const WS_URL = BACKEND_URL.replace('http', 'ws').replace('https', 'wss');

export const useWebRTC = (userId, onIncomingCall, onCallEnded) => {
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callState, setCallState] = useState('idle'); // idle, calling, ringing, active
  const [currentCallId, setCurrentCallId] = useState(null);
  
  const wsRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const currentCallRef = useRef(null);

  // ICE servers configuration (using free STUN servers)
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  // Connect to WebRTC signaling server
  useEffect(() => {
    if (!userId) return;

    const connectWebSocket = () => {
      const ws = new WebSocket(`${WS_URL}/api/webrtc/ws/${userId}`);
      
      ws.onopen = () => {
        console.log('WebRTC signaling connected');
        setIsConnected(true);
      };

      ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        await handleSignalingMessage(message);
      };

      ws.onclose = () => {
        console.log('WebRTC signaling disconnected');
        setIsConnected(false);
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebRTC signaling error:', error);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      cleanup();
    };
  }, [userId]);

  // Handle signaling messages
  const handleSignalingMessage = async (message) => {
    console.log('Received signaling message:', message.type);

    switch (message.type) {
      case 'incoming-call':
        // Someone is calling us
        setCallState('ringing');
        setCurrentCallId(message.callId);
        currentCallRef.current = {
          callId: message.callId,
          from: message.from,
          callType: message.callType,
          offer: message.offer
        };
        if (onIncomingCall) {
          onIncomingCall({
            callId: message.callId,
            from: message.from,
            callType: message.callType
          });
        }
        break;

      case 'call-answered':
        // Our call was answered
        setCallState('active');
        await handleCallAnswered(message.answer);
        break;

      case 'call-rejected':
        // Call was rejected
        setCallState('rejected');
        cleanup();
        if (onCallEnded) {
          onCallEnded('rejected');
        }
        break;

      case 'call-ended':
        // Call ended by other party
        setCallState('ended');
        cleanup();
        if (onCallEnded) {
          onCallEnded('ended');
        }
        break;

      case 'ice-candidate':
        // Received ICE candidate
        if (peerConnectionRef.current && message.candidate) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(message.candidate)
          );
        }
        break;

      case 'call-failed':
        setCallState('failed');
        cleanup();
        if (onCallEnded) {
          onCallEnded(message.reason || 'failed');
        }
        break;
    }
  };

  // Start a call
  const startCall = async (targetUserId, callType = 'audio') => {
    try {
      console.log(`Starting ${callType} call to ${targetUserId}`);
      setCallState('calling');

      // Get media stream with proper constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: callType === 'video' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false
      };

      console.log('Requesting media with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got local stream:', stream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
      
      setLocalStream(stream);

      // Create peer connection
      const pc = new RTCPeerConnection(iceServers);
      peerConnectionRef.current = pc;

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to peer connection`);
        pc.addTrack(track, stream);
      });

      // Handle incoming stream
      pc.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        console.log('Remote stream:', event.streams[0]);
        const remoteStream = event.streams[0];
        console.log('Remote stream tracks:', remoteStream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
        setRemoteStream(remoteStream);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && wsRef.current) {
          console.log('Sending ICE candidate');
          wsRef.current.send(JSON.stringify({
            type: 'ice-candidate',
            to: targetUserId,
            candidate: event.candidate
          }));
        }
      };

      // Handle connection state
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState);
      };

      // Create and send offer with proper options
      const offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: callType === 'video'
      };
      
      const offer = await pc.createOffer(offerOptions);
      await pc.setLocalDescription(offer);
      console.log('Created and set local offer');

      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'call-offer',
          to: targetUserId,
          callType: callType,
          offer: offer
        }));
        console.log('Sent call offer');
      }

      currentCallRef.current = { targetUserId, callType };
      
    } catch (error) {
      console.error('Error starting call:', error);
      alert(`Failed to start call: ${error.message}. Please check camera/microphone permissions.`);
      cleanup();
      throw error;
    }
  };

  // Answer an incoming call
  const answerCall = async () => {
    try {
      if (!currentCallRef.current) return;
      
      const { callId, from, callType, offer } = currentCallRef.current;
      console.log('Answering call:', callId, 'Type:', callType);

      // Get media stream with proper constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: callType === 'video' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false
      };

      console.log('Requesting media for answer:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got local stream for answer:', stream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
      
      setLocalStream(stream);

      // Create peer connection
      const pc = new RTCPeerConnection(iceServers);
      peerConnectionRef.current = pc;

      // Add tracks
      stream.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to answer peer connection`);
        pc.addTrack(track, stream);
      });

      // Handle incoming stream
      pc.ontrack = (event) => {
        console.log('Received remote track in answer:', event.track.kind);
        console.log('Remote stream in answer:', event.streams[0]);
        const remoteStream = event.streams[0];
        console.log('Remote stream tracks:', remoteStream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
        setRemoteStream(remoteStream);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && wsRef.current) {
          console.log('Sending ICE candidate in answer');
          wsRef.current.send(JSON.stringify({
            type: 'ice-candidate',
            to: from,
            candidate: event.candidate
          }));
        }
      };

      // Handle connection state
      pc.onconnectionstatechange = () => {
        console.log('Connection state (answer):', pc.connectionState);
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state (answer):', pc.iceConnectionState);
      };

      // Set remote description and create answer
      console.log('Setting remote description');
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      console.log('Creating answer');
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log('Set local answer');

      // Send answer
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'call-answer',
          callId: callId,
          to: from,
          answer: answer
        }));
        console.log('Sent answer');
      }

      setCallState('active');
      
    } catch (error) {
      console.error('Error answering call:', error);
      alert(`Failed to answer call: ${error.message}`);
      rejectCall();
    }
  };

  // Reject an incoming call
  const rejectCall = () => {
    if (currentCallRef.current && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'call-reject',
        callId: currentCallRef.current.callId,
        to: currentCallRef.current.from
      }));
    }
    cleanup();
    setCallState('idle');
  };

  // End the current call
  const endCall = () => {
    if (currentCallRef.current && wsRef.current) {
      const targetId = currentCallRef.current.targetUserId || currentCallRef.current.from;
      wsRef.current.send(JSON.stringify({
        type: 'call-end',
        callId: currentCallId,
        to: targetId
      }));
    }
    cleanup();
    setCallState('idle');
    if (onCallEnded) {
      onCallEnded('ended');
    }
  };

  // Handle call answered
  const handleCallAnswered = async (answer) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    } catch (error) {
      console.error('Error handling call answer:', error);
    }
  };

  // Cleanup resources
  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    currentCallRef.current = null;
    setCurrentCallId(null);
  };

  return {
    isConnected,
    callState,
    localStream,
    remoteStream,
    currentCallId,
    startCall,
    answerCall,
    rejectCall,
    endCall
  };
};

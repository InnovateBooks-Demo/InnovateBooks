import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, Lock, Users, Plus, Search, Smile, Paperclip, MoreVertical, X, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const IBChat = () => {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [user, setUser] = useState(null);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('access_token');

  // Initialize user and load channels
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    loadChannels();
  }, []);

  // Load channels
  const loadChannels = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/chat/channels`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(response.data);
      if (response.data.length > 0 && !activeChannel) {
        setActiveChannel(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    }
  };

  // Load messages for active channel
  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel.id);
      connectWebSocket();
    }
  }, [activeChannel]);

  // Load messages
  const loadMessages = async (channelId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/chat/channels/${channelId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // WebSocket connection
  const connectWebSocket = () => {
    if (!user?.id) return;

    const wsUrl = `ws://localhost:8001/api/chat/ws/${user.id}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      if (activeChannel) {
        websocket.send(JSON.stringify({
          type: 'join_channel',
          channel_id: activeChannel.id
        }));
      }
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    setWs(websocket);

    return () => {
      if (websocket) websocket.close();
    };
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'new_message':
        if (data.data.channel_id === activeChannel?.id) {
          setMessages(prev => [...prev, data.data]);
          scrollToBottom();
        }
        break;
      case 'message_updated':
        setMessages(prev => prev.map(msg => 
          msg.id === data.data.message_id 
            ? { ...msg, content: data.data.content, edited: true }
            : msg
        ));
        break;
      case 'message_deleted':
        setMessages(prev => prev.filter(msg => msg.id !== data.data.message_id));
        break;
      case 'reaction_added':
        // Handle reaction added
        break;
      case 'user_typing':
        // Handle typing indicator
        break;
      default:
        break;
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel) return;

    try {
      await axios.post(`${BACKEND_URL}/api/chat/messages`, {
        channel_id: activeChannel.id,
        content: newMessage,
        type: 'text'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Create new channel
  const createChannel = async (name, description, type) => {
    try {
      await axios.post(`${BACKEND_URL}/api/chat/channels`, {
        name,
        description,
        type,
        members: []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadChannels();
      setShowNewChannelModal(false);
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex bg-white" style={{ fontFamily: 'Poppins' }}>
      {/* Sidebar - Channels List */}
      <div className="w-64 bg-[#06B6D4]/5 border-r-2 border-[#06B6D4]/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b-2 border-[#06B6D4]/20">
          <h2 className="text-xl font-black bg-gradient-to-r from-[#06B6D4] to-[#0891B2] bg-clip-text text-transparent">
            IB Chat
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">{channels.length} channels</p>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border-2 border-slate-200 rounded-xl focus:border-[#06B6D4] focus:outline-none"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-bold text-slate-600 uppercase">Channels</span>
              <button 
                onClick={() => setShowNewChannelModal(true)}
                className="p-1 hover:bg-[#06B6D4]/10 rounded"
              >
                <Plus className="h-4 w-4 text-[#06B6D4]" />
              </button>
            </div>

            {channels.filter(ch => ch.type === 'public' || ch.type === 'private').map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                  activeChannel?.id === channel.id
                    ? 'bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white shadow-lg'
                    : 'hover:bg-[#06B6D4]/10 text-slate-700'
                }`}
              >
                {channel.type === 'private' ? (
                  <Lock className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Hash className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="text-sm font-bold truncate">{channel.name}</span>
              </button>
            ))}

            <div className="flex items-center px-3 py-2 mt-4">
              <span className="text-xs font-bold text-slate-600 uppercase">Direct Messages</span>
            </div>

            {channels.filter(ch => ch.type === 'direct').map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                  activeChannel?.id === channel.id
                    ? 'bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white shadow-lg'
                    : 'hover:bg-[#06B6D4]/10 text-slate-700'
                }`}
              >
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-bold truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChannel ? (
          <>
            {/* Channel Header */}
            <div className="h-16 border-b-2 border-[#06B6D4]/20 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeChannel.type === 'private' ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl flex items-center justify-center">
                    <Hash className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-black text-slate-900">{activeChannel.name}</h3>
                  {activeChannel.description && (
                    <p className="text-xs text-slate-600">{activeChannel.description}</p>
                  )}
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <MoreVertical className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {message.user_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900">{message.user_name}</span>
                      <span className="text-xs text-slate-500">{formatTime(message.created_at)}</span>
                      {message.edited && (
                        <span className="text-xs text-slate-400 italic">(edited)</span>
                      )}
                    </div>
                    <p className="text-slate-700 mt-1">{message.content}</p>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {message.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            className="px-2 py-1 bg-slate-100 rounded-lg text-sm hover:bg-slate-200"
                          >
                            {reaction.emoji} {reaction.count}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t-2 border-[#06B6D4]/20 p-4">
              <div className="flex gap-3">
                <button className="p-3 hover:bg-[#06B6D4]/10 rounded-xl transition-colors">
                  <Paperclip className="h-5 w-5 text-[#06B6D4]" />
                </button>
                <input
                  type="text"
                  placeholder={`Message #${activeChannel.name}`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#06B6D4] focus:outline-none font-medium"
                />
                <button className="p-3 hover:bg-[#06B6D4]/10 rounded-xl transition-colors">
                  <Smile className="h-5 w-5 text-[#06B6D4]" />
                </button>
                <button
                  onClick={sendMessage}
                  className="px-6 py-3 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Hash className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Select a channel</h3>
              <p className="text-slate-600">Choose a channel from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* New Channel Modal */}
      {showNewChannelModal && (
        <NewChannelModal
          onClose={() => setShowNewChannelModal(false)}
          onCreate={createChannel}
        />
      )}
    </div>
  );
};

// New Channel Modal Component
const NewChannelModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('public');

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate(name, description, type);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black bg-gradient-to-r from-[#06B6D4] to-[#0891B2] bg-clip-text text-transparent">
            Create Channel
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Channel Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., general, random, team-updates"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#06B6D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#06B6D4] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Privacy</label>
            <div className="space-y-2">
              <button
                onClick={() => setType('public')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  type === 'public'
                    ? 'border-[#06B6D4] bg-[#06B6D4]/5'
                    : 'border-slate-200 hover:border-[#06B6D4]/50'
                }`}
              >
                <Hash className="h-5 w-5 text-[#06B6D4]" />
                <div className="text-left">
                  <p className="font-bold text-slate-900">Public</p>
                  <p className="text-xs text-slate-600">Anyone can join</p>
                </div>
              </button>
              <button
                onClick={() => setType('private')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  type === 'private'
                    ? 'border-[#06B6D4] bg-[#06B6D4]/5'
                    : 'border-slate-200 hover:border-[#06B6D4]/50'
                }`}
              >
                <Lock className="h-5 w-5 text-[#06B6D4]" />
                <div className="text-left">
                  <p className="font-bold text-slate-900">Private</p>
                  <p className="text-xs text-slate-600">Invite only</p>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Create Channel
          </button>
        </div>
      </div>
    </div>
  );
};

export default IBChat;

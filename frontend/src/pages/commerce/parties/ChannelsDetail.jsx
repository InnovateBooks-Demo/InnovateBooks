import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ArrowLeft, Edit, Trash2, Building2, Mail, Phone, MapPin, Calendar, Globe, Users, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ChannelsDetail = () => {
  const { channel_id } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchChannel();
  }, [channel_id]);

  const fetchChannel = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/commerce/parties/channels/${channel_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setChannel(response.data.channel);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load channel details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/api/commerce/parties/channels/${channel_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Channel deleted successfully');
      navigate('/commerce/parties/channels');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete channel');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status?.toLowerCase()] || colors.active;
  };

  const getChannelTypeColor = (type) => {
    const colors = {
      'Direct': 'bg-blue-100 text-blue-800',
      'Online': 'bg-purple-100 text-purple-800',
      'Retail': 'bg-green-100 text-green-800',
      'Wholesale': 'bg-orange-100 text-orange-800',
      'Marketplace': 'bg-pink-100 text-pink-800',
      'Distributor': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="text-center">
          <Share2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Channel not found</h3>
          <button
            onClick={() => navigate('/commerce/parties/channels')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Channels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50" style={{ fontFamily: 'Poppins' }}>
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/commerce/parties/channels')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Channels
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Share2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{channel.channel_name}</h1>
                <p className="text-sm text-gray-600 font-medium">{channel.channel_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/commerce/parties/channels/${channel_id}/edit`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 transition-all font-semibold"
                data-testid="edit-channel-btn"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold"
                data-testid="delete-channel-btn"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-indigo-600" />
                Channel Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Channel Name</label>
                  <p className="text-gray-900 font-semibold">{channel.channel_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Channel Code</label>
                  <p className="text-gray-900 font-semibold">{channel.channel_code || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Channel Type</label>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getChannelTypeColor(channel.channel_type)}`}>
                    {channel.channel_type || '-'}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(channel.status)}`}>
                    {channel.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Region</label>
                  <p className="text-gray-900 font-semibold">{channel.region || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Currency</label>
                  <p className="text-gray-900 font-semibold">{channel.currency || 'INR'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700">{channel.description || 'No description provided'}</p>
            </div>

            {/* Channel Manager */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Channel Manager
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Manager Name</label>
                  <p className="text-gray-900 font-semibold">{channel.manager_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Manager Email</label>
                  <p className="text-gray-900 font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {channel.manager_email || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Manager Phone</label>
                  <p className="text-gray-900 font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {channel.manager_phone || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Channel Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Status</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(channel.status)}`}>
                    {channel.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Type</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getChannelTypeColor(channel.channel_type)}`}>
                    {channel.channel_type || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Targets & Performance
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Revenue Target</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {channel.revenue_target ? `₹${channel.revenue_target.toLocaleString()}` : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Commission Rate</span>
                  <span className="text-sm font-semibold text-gray-900">{channel.commission_rate || 0}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Active Partners</span>
                  <span className="text-sm font-semibold text-gray-900">{channel.active_partners || 0}</span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Metadata
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Created At</label>
                  <p className="text-gray-900 font-semibold">
                    {channel.created_at ? new Date(channel.created_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Last Modified</label>
                  <p className="text-gray-900 font-semibold">
                    {channel.last_modified_at ? new Date(channel.last_modified_at).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Channel</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{channel.channel_name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                data-testid="confirm-delete-btn"
              >
                Delete Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelsDetail;

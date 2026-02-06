import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ChannelsEdit = () => {
  const { channel_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    channel_name: '',
    channel_code: '',
    channel_type: 'Direct',
    status: 'active',
    description: '',
    region: '',
    currency: 'INR',
    manager_name: '',
    manager_email: '',
    manager_phone: '',
    revenue_target: 0,
    commission_rate: 0,
    active_partners: 0
  });

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
        const channel = response.data.channel;
        setFormData({
          channel_name: channel.channel_name || '',
          channel_code: channel.channel_code || '',
          channel_type: channel.channel_type || 'Direct',
          status: channel.status || 'active',
          description: channel.description || '',
          region: channel.region || '',
          currency: channel.currency || 'INR',
          manager_name: channel.manager_name || '',
          manager_email: channel.manager_email || '',
          manager_phone: channel.manager_phone || '',
          revenue_target: channel.revenue_target || 0,
          commission_rate: channel.commission_rate || 0,
          active_partners: channel.active_partners || 0
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load channel details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${API_URL}/api/commerce/parties/channels/${channel_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Channel updated successfully');
      navigate(`/commerce/parties/channels/${channel_id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update channel');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50" style={{ fontFamily: 'Poppins' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/commerce/parties/channels/${channel_id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Channel
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Channel</h1>
              <p className="text-sm text-gray-600 font-medium">{channel_id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Channel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channel Name *</label>
                <input
                  type="text"
                  name="channel_name"
                  value={formData.channel_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                  data-testid="channel-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channel Code</label>
                <input
                  type="text"
                  name="channel_code"
                  value={formData.channel_code}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channel Type *</label>
                <select
                  name="channel_type"
                  value={formData.channel_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                >
                  <option value="Direct">Direct</option>
                  <option value="Online">Online</option>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="e.g., North India, Global"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                >
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                  placeholder="Channel description..."
                />
              </div>
            </div>
          </div>

          {/* Channel Manager */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Channel Manager</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager Name</label>
                <input
                  type="text"
                  name="manager_name"
                  value={formData.manager_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager Email</label>
                <input
                  type="email"
                  name="manager_email"
                  value={formData.manager_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager Phone</label>
                <input
                  type="tel"
                  name="manager_phone"
                  value={formData.manager_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Targets & Performance */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Targets & Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Target (₹)</label>
                <input
                  type="number"
                  name="revenue_target"
                  value={formData.revenue_target}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                <input
                  type="number"
                  name="commission_rate"
                  value={formData.commission_rate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Active Partners</label>
                <input
                  type="number"
                  name="active_partners"
                  value={formData.active_partners}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/commerce/parties/channels/${channel_id}`)}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg font-semibold disabled:opacity-50"
              data-testid="save-channel-btn"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChannelsEdit;

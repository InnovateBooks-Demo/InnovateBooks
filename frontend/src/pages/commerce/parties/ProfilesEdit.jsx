import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileUser, ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ProfilesEdit = () => {
  const { profile_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    profile_name: '',
    profile_code: '',
    profile_type: 'Customer',
    status: 'active',
    description: '',
    payment_terms: 'Net 30',
    credit_limit: 0,
    default_discount: 0,
    max_discount: 0,
    min_order_value: 0,
    approval_required: false,
    auto_apply_discount: false,
    allow_partial_payment: true,
    priority_level: 'Normal'
  });

  useEffect(() => {
    fetchProfile();
  }, [profile_id]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/commerce/parties/profiles/${profile_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const profile = response.data.profile;
        setFormData({
          profile_name: profile.profile_name || '',
          profile_code: profile.profile_code || '',
          profile_type: profile.profile_type || 'Customer',
          status: profile.status || 'active',
          description: profile.description || '',
          payment_terms: profile.payment_terms || 'Net 30',
          credit_limit: profile.credit_limit || 0,
          default_discount: profile.default_discount || 0,
          max_discount: profile.max_discount || 0,
          min_order_value: profile.min_order_value || 0,
          approval_required: profile.approval_required || false,
          auto_apply_discount: profile.auto_apply_discount || false,
          allow_partial_payment: profile.allow_partial_payment !== false,
          priority_level: profile.priority_level || 'Normal'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${API_URL}/api/commerce/parties/profiles/${profile_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated successfully');
      navigate(`/commerce/parties/profiles/${profile_id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50" style={{ fontFamily: 'Poppins' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/commerce/parties/profiles/${profile_id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Profile
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FileUser className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-sm text-gray-600 font-medium">{profile_id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Name *</label>
                <input
                  type="text"
                  name="profile_name"
                  value={formData.profile_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                  data-testid="profile-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Code</label>
                <input
                  type="text"
                  name="profile_code"
                  value={formData.profile_code}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Type *</label>
                <select
                  name="profile_type"
                  value={formData.profile_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                >
                  <option value="Customer">Customer</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Partner">Partner</option>
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                  placeholder="Profile description..."
                />
              </div>
            </div>
          </div>

          {/* Commercial Terms */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Commercial Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <select
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Net 7">Net 7</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Net 90">Net 90</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credit Limit (₹)</label>
                <input
                  type="number"
                  name="credit_limit"
                  value={formData.credit_limit}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Value (₹)</label>
                <input
                  type="number"
                  name="min_order_value"
                  value={formData.min_order_value}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Discount (%)</label>
                <input
                  type="number"
                  name="default_discount"
                  value={formData.default_discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount (%)</label>
                <input
                  type="number"
                  name="max_discount"
                  value={formData.max_discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                <select
                  name="priority_level"
                  value={formData.priority_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none font-medium"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  name="approval_required"
                  checked={formData.approval_required}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900">Approval Required</span>
                  <p className="text-xs text-gray-500">Orders need approval</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  name="auto_apply_discount"
                  checked={formData.auto_apply_discount}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900">Auto-Apply Discount</span>
                  <p className="text-xs text-gray-500">Apply default discount automatically</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  name="allow_partial_payment"
                  checked={formData.allow_partial_payment}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-600 border-2 border-gray-300 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900">Allow Partial Payment</span>
                  <p className="text-xs text-gray-500">Accept partial payments</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/commerce/parties/profiles/${profile_id}`)}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg font-semibold disabled:opacity-50"
              data-testid="save-profile-btn"
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

export default ProfilesEdit;

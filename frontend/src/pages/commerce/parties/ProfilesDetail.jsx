import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileUser, ArrowLeft, Edit, Trash2, Calendar, DollarSign, Percent, Clock, Shield, Settings } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ProfilesDetail = () => {
  const { profile_id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/api/commerce/parties/profiles/${profile_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile deleted successfully');
      navigate('/commerce/parties/profiles');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete profile');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[status?.toLowerCase()] || colors.active;
  };

  const getProfileTypeColor = (type) => {
    const colors = {
      'Customer': 'bg-blue-100 text-blue-800',
      'Vendor': 'bg-purple-100 text-purple-800',
      'Partner': 'bg-green-100 text-green-800',
      'Premium': 'bg-amber-100 text-amber-800',
      'Standard': 'bg-gray-100 text-gray-800',
      'Enterprise': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="text-center">
          <FileUser className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Profile not found</h3>
          <button
            onClick={() => navigate('/commerce/parties/profiles')}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Back to Profiles
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
            onClick={() => navigate('/commerce/parties/profiles')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Profiles
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg">
                <FileUser className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.profile_name}</h1>
                <p className="text-sm text-gray-600 font-medium">{profile.profile_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/commerce/parties/profiles/${profile_id}/edit`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-all font-semibold"
                data-testid="edit-profile-btn"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold"
                data-testid="delete-profile-btn"
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
                <FileUser className="h-5 w-5 text-amber-600" />
                Profile Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Profile Name</label>
                  <p className="text-gray-900 font-semibold">{profile.profile_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Profile Code</label>
                  <p className="text-gray-900 font-semibold">{profile.profile_code || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Profile Type</label>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getProfileTypeColor(profile.profile_type)}`}>
                    {profile.profile_type || '-'}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(profile.status)}`}>
                    {profile.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700">{profile.description || 'No description provided'}</p>
            </div>

            {/* Commercial Terms */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-amber-600" />
                Commercial Terms
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <label className="text-sm text-gray-500 font-medium">Payment Terms</label>
                  </div>
                  <p className="text-gray-900 font-semibold">{profile.payment_terms || 'Net 30'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <label className="text-sm text-gray-500 font-medium">Credit Limit</label>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {profile.credit_limit ? `₹${profile.credit_limit.toLocaleString()}` : 'Not Set'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-4 w-4 text-gray-500" />
                    <label className="text-sm text-gray-500 font-medium">Default Discount</label>
                  </div>
                  <p className="text-gray-900 font-semibold">{profile.default_discount || 0}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-4 w-4 text-gray-500" />
                    <label className="text-sm text-gray-500 font-medium">Max Discount</label>
                  </div>
                  <p className="text-gray-900 font-semibold">{profile.max_discount || 0}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <label className="text-sm text-gray-500 font-medium">Min Order Value</label>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {profile.min_order_value ? `₹${profile.min_order_value.toLocaleString()}` : 'Not Set'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <label className="text-sm text-gray-500 font-medium">Approval Required</label>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {profile.approval_required ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Status</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(profile.status)}`}>
                    {profile.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Type</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getProfileTypeColor(profile.profile_type)}`}>
                    {profile.profile_type || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-amber-600" />
                Settings
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Auto-Apply Discount</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {profile.auto_apply_discount ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Allow Partial Payment</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {profile.allow_partial_payment ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Priority Level</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {profile.priority_level || 'Normal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                Metadata
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Created At</label>
                  <p className="text-gray-900 font-semibold">
                    {profile.created_at ? new Date(profile.created_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Last Modified</label>
                  <p className="text-gray-900 font-semibold">
                    {profile.last_modified_at ? new Date(profile.last_modified_at).toLocaleString() : '-'}
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Profile</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{profile.profile_name}&quot;? This action cannot be undone.
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
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilesDetail;

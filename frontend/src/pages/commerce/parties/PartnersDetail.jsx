import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Handshake, ArrowLeft, Edit, Trash2, Building2, Mail, Phone, MapPin, Calendar, Globe, FileText, DollarSign } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PartnersDetail = () => {
  const { partner_id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPartner();
  }, [partner_id]);

  const fetchPartner = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/commerce/parties/partners/${partner_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPartner(response.data.partner);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load partner details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/api/commerce/parties/partners/${partner_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Partner deleted successfully');
      navigate('/commerce/parties/partners');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete partner');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      on_hold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      dormant: 'bg-gray-100 text-gray-800 border-gray-200',
      blocked: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status?.toLowerCase()] || colors.active;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="text-center">
          <Handshake className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Partner not found</h3>
          <button
            onClick={() => navigate('/commerce/parties/partners')}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Back to Partners
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
            onClick={() => navigate('/commerce/parties/partners')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Partners
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Handshake className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{partner.display_name}</h1>
                <p className="text-sm text-gray-600 font-medium">{partner.partner_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/commerce/parties/partners/${partner_id}/edit`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all font-semibold"
                data-testid="edit-partner-btn"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold"
                data-testid="delete-partner-btn"
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
                <Building2 className="h-5 w-5 text-emerald-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Display Name</label>
                  <p className="text-gray-900 font-semibold">{partner.display_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Legal Name</label>
                  <p className="text-gray-900 font-semibold">{partner.legal_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Partner Type</label>
                  <p className="text-gray-900 font-semibold">{partner.partner_type || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(partner.status)}`}>
                    {partner.status?.replace('_', ' ').toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Country</label>
                  <p className="text-gray-900 font-semibold">{partner.country_of_registration || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Currency</label>
                  <p className="text-gray-900 font-semibold">{partner.currency || 'INR'}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                Contact Information
              </h2>
              {partner.contacts && partner.contacts.length > 0 ? (
                <div className="space-y-4">
                  {partner.contacts.map((contact, index) => (
                    <div key={`item-${index}`} className="p-4 bg-gray-50 rounded-xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500 font-medium">Contact Person</label>
                          <p className="text-gray-900 font-semibold">{contact.name || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500 font-medium">Designation</label>
                          <p className="text-gray-900 font-semibold">{contact.designation || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500 font-medium">Email</label>
                          <p className="text-gray-900 font-semibold flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {contact.email || '-'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500 font-medium">Phone</label>
                          <p className="text-gray-900 font-semibold flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {contact.phone || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No contacts added yet</p>
              )}
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Address Information
              </h2>
              {partner.addresses && partner.addresses.length > 0 ? (
                <div className="space-y-4">
                  {partner.addresses.map((address, index) => (
                    <div key={`item-${index}`} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">
                          {address.address_type || 'Primary'}
                        </span>
                      </div>
                      <p className="text-gray-900">
                        {[address.line1, address.line2, address.city, address.state, address.postal_code, address.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No addresses added yet</p>
              )}
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Partner Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Status</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(partner.status)}`}>
                    {partner.status?.replace('_', ' ').toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Partner Type</span>
                  <span className="text-sm font-semibold text-gray-900">{partner.partner_type || '-'}</span>
                </div>
              </div>
            </div>

            {/* Commercial Terms */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Commercial Terms
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Commission Rate</span>
                  <span className="text-sm font-semibold text-gray-900">{partner.commission_rate || 0}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Payment Terms</span>
                  <span className="text-sm font-semibold text-gray-900">{partner.payment_terms || 'Net 30'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Contract Valid Until</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {partner.contract_end_date ? new Date(partner.contract_end_date).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Metadata
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 font-medium">Created At</label>
                  <p className="text-gray-900 font-semibold">
                    {partner.created_at ? new Date(partner.created_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 font-medium">Last Modified</label>
                  <p className="text-gray-900 font-semibold">
                    {partner.last_modified_at ? new Date(partner.last_modified_at).toLocaleString() : '-'}
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Partner</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{partner.display_name}&quot;? This action cannot be undone.
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
                Delete Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersDetail;

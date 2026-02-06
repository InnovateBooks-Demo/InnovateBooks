import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, Mail, Phone, MapPin, Shield, Tag, FileText, Activity, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const VendorsDetail = () => {
  const { vendor_id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchVendorDetails();
  }, [vendor_id]);

  const fetchVendorDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/commerce/parties/vendors/${vendor_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setVendor(response.data.vendor);
      }
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`${API_URL}/api/commerce/parties/vendors/${vendor_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/commerce/parties/vendors');
      } catch (error) {
        console.error('Error deleting vendor:', error);
        alert('Failed to delete vendor');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-300',
      on_hold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      dormant: 'bg-gray-100 text-gray-800 border-gray-300',
      blocked: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || colors.active;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-purple-600 font-semibold text-lg">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
          <button onClick={() => navigate('/commerce/parties/vendors')} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: FileText },
    { key: 'contacts', label: 'Contacts', icon: Mail },
    { key: 'locations', label: 'Locations', icon: MapPin },
    { key: 'activity', label: 'Activity', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50" style={{ fontFamily: 'Poppins' }}>
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <button onClick={() => navigate('/commerce/parties/vendors')} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6 transition-all">
          <ArrowLeft className="h-5 w-5" />
          Back to Vendors
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{vendor.display_name || vendor.name}</h1>
                  <p className="text-sm text-gray-600 font-medium">{vendor.vendor_id}</p>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </span>
                {vendor.vendor_type && (
                  <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-100 text-purple-800">
                    {vendor.vendor_type}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 mt-6">
                {vendor.legal_name && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Legal Name</p>
                    <p className="text-base font-bold">{vendor.legal_name}</p>
                  </div>
                )}
                {vendor.country_of_registration && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Country</p>
                    <p className="text-base font-bold">{vendor.country_of_registration}</p>
                  </div>
                )}
                {vendor.risk_level && (
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Risk Level</p>
                    <p className="text-base font-bold capitalize">{vendor.risk_level}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => navigate(`/commerce/parties/vendors/${vendor_id}/edit`)} className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all">
                <Edit className="h-5 w-5" />
                Edit
              </button>
              <button onClick={handleDelete} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
                <Trash2 className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden">
          <div className="flex overflow-x-auto border-b-2 border-purple-200 bg-purple-50">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-purple-600 text-white border-b-4 border-purple-800'
                      : 'text-gray-600 hover:bg-purple-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
                    {vendor.primary_role && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Primary Role</label>
                        <p className="text-base text-gray-900">{vendor.primary_role}</p>
                      </div>
                    )}
                    {vendor.vendor_status && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Vendor Status</label>
                        <p className="text-base text-gray-900">{vendor.vendor_status}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Commercial Details</h3>
                    {vendor.commercial_owner && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Commercial Owner</label>
                        <p className="text-base text-gray-900">{vendor.commercial_owner}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Persons</h3>
                {vendor.contacts && vendor.contacts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendor.contacts.map((contact, index) => (
                      <div key={`item-${index}`} className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <Mail className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{contact.name}</h4>
                            {contact.role && <p className="text-sm text-gray-600">{contact.role}</p>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {contact.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Mail className="h-4 w-4" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="h-4 w-4" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No contacts added</p>
                )}
              </div>
            )}

            {activeTab === 'locations' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Locations</h3>
                {vendor.locations && vendor.locations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendor.locations.map((location, index) => (
                      <div key={`item-${index}`} className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-5 w-5 text-purple-600" />
                          <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold">
                            {location.address_type}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p className="font-semibold">{location.address_line1}</p>
                          {location.address_line2 && <p>{location.address_line2}</p>}
                          <p>{location.city}, {location.state}</p>
                          <p>{location.country} - {location.postal_code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No locations added</p>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Log</h3>
                <div className="space-y-3">
                  {vendor.created_at && (
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                      <Activity className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Vendor Created</p>
                        <p className="text-sm text-gray-600">
                          {new Date(vendor.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsDetail;
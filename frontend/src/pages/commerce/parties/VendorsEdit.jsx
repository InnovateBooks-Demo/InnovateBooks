import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Save, Plus, Trash2, Upload, FileText, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const VendorsEdit = () => {
  const { vendor_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    display_name: '',
    legal_name: '',
    vendor_type: 'Material',
    status: 'active',
    vendor_status: 'approved',
    country_of_registration: 'India',
    operating_countries: [],
    currency: 'INR',
    
    // Vendor specific
    capability_categories: [],
    rate_type: '',
    capacity_indicator: '',
    typical_lead_time: '',
    geo_availability: [],
    single_source_flag: false,
    critical_vendor_flag: false,
    substitution_difficulty: '',
    compliance_dependency_notes: '',
    
    // Commercial Terms
    payment_terms: 'Net 30',
    credit_limit: 0,
    
    // Contacts & Addresses
    contacts: [{ name: '', designation: '', email: '', phone: '', is_primary: true }],
    addresses: [{ address_type: 'Registered', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'India' }],
    
    // Notes
    notes: []
  });

  useEffect(() => {
    fetchVendor();
  }, [vendor_id]);

  const fetchVendor = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/commerce/parties/vendors/${vendor_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const vendor = response.data.vendor;
        setFormData({
          display_name: vendor.display_name || '',
          legal_name: vendor.legal_name || '',
          vendor_type: vendor.vendor_type || 'Material',
          status: vendor.status || 'active',
          vendor_status: vendor.vendor_status || 'approved',
          country_of_registration: vendor.country_of_registration || 'India',
          operating_countries: vendor.operating_countries || [],
          currency: vendor.currency || 'INR',
          capability_categories: vendor.capability_categories || [],
          rate_type: vendor.rate_type || '',
          capacity_indicator: vendor.capacity_indicator || '',
          typical_lead_time: vendor.typical_lead_time || '',
          geo_availability: vendor.geo_availability || [],
          single_source_flag: vendor.single_source_flag || false,
          critical_vendor_flag: vendor.critical_vendor_flag || false,
          substitution_difficulty: vendor.substitution_difficulty || '',
          compliance_dependency_notes: vendor.compliance_dependency_notes || '',
          payment_terms: vendor.payment_terms || 'Net 30',
          credit_limit: vendor.credit_limit || 0,
          contacts: vendor.contacts?.length > 0 ? vendor.contacts : [{ name: '', designation: '', email: '', phone: '', is_primary: true }],
          addresses: vendor.addresses?.length > 0 ? vendor.addresses : vendor.locations?.length > 0 ? vendor.locations : [{ address_type: 'Registered', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'India' }],
          notes: vendor.notes || []
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${API_URL}/api/commerce/parties/vendors/${vendor_id}`, {
        ...formData,
        locations: formData.addresses,
        party_category: 'vendor',
        primary_role: 'Supplier'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Vendor updated successfully');
      navigate(`/commerce/parties/vendors/${vendor_id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update vendor');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.contacts];
    newContacts[index][field] = value;
    setFormData(prev => ({ ...prev, contacts: newContacts }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', designation: '', email: '', phone: '', is_primary: false }]
    }));
  };

  const removeContact = (index) => {
    if (formData.contacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        contacts: prev.contacts.filter((_, i) => i !== index)
      }));
    }
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index][field] = value;
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { address_type: 'Business', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'India' }]
    }));
  };

  const removeAddress = (index) => {
    if (formData.addresses.length > 1) {
      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index)
      }));
    }
  };

  const addNote = () => {
    const note = prompt('Enter note:');
    if (note) {
      setFormData(prev => ({
        ...prev,
        notes: [...prev.notes, { text: note, created_at: new Date().toISOString(), created_by: 'user' }]
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'vendor', label: 'Vendor Details' },
    { id: 'commercial', label: 'Commercial Terms' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'notes', label: 'Notes & Documents' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50" style={{ fontFamily: 'Poppins' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/commerce/parties/vendors/${vendor_id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Vendor
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Vendor</h1>
              <p className="text-sm text-gray-600 font-medium">{vendor_id}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name *</label>
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    data-testid="display-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Legal Name</label>
                  <input
                    type="text"
                    name="legal_name"
                    value={formData.legal_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Type *</label>
                  <select
                    name="vendor_type"
                    value={formData.vendor_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="Material">Material Supplier</option>
                    <option value="Service">Service Provider</option>
                    <option value="Creator">Creator/Freelancer</option>
                    <option value="SaaS">SaaS Vendor</option>
                    <option value="Logistics">Logistics Provider</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="dormant">Dormant</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Status</label>
                  <select
                    name="vendor_status"
                    value={formData.vendor_status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="preferred">Preferred</option>
                    <option value="approved">Approved</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country_of_registration"
                    value={formData.country_of_registration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Details Tab */}
          {activeTab === 'vendor' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Vendor-Specific Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate Type</label>
                  <select
                    name="rate_type"
                    value={formData.rate_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="">Select Rate Type</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Fixed">Fixed Price</option>
                    <option value="Milestone">Milestone-based</option>
                    <option value="Unit">Per Unit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity Indicator</label>
                  <select
                    name="capacity_indicator"
                    value={formData.capacity_indicator}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="">Select Capacity</option>
                    <option value="High">High Capacity</option>
                    <option value="Medium">Medium Capacity</option>
                    <option value="Low">Low Capacity</option>
                    <option value="Limited">Limited Availability</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Typical Lead Time</label>
                  <select
                    name="typical_lead_time"
                    value={formData.typical_lead_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="">Select Lead Time</option>
                    <option value="Immediate">Immediate</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value="1 week">1 week</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1-3 months">1-3 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Substitution Difficulty</label>
                  <select
                    name="substitution_difficulty"
                    value={formData.substitution_difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy to substitute</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Difficult">Difficult</option>
                    <option value="Impossible">Impossible</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compliance/Dependency Notes</label>
                  <textarea
                    name="compliance_dependency_notes"
                    value={formData.compliance_dependency_notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    placeholder="Any compliance requirements or dependencies..."
                  />
                </div>
              </div>
              
              {/* Flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="single_source_flag"
                    checked={formData.single_source_flag}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Single Source</span>
                    <p className="text-xs text-gray-500">This is the only vendor for this service/product</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 bg-red-50 rounded-xl cursor-pointer hover:bg-red-100 transition-colors">
                  <input
                    type="checkbox"
                    name="critical_vendor_flag"
                    checked={formData.critical_vendor_flag}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Critical Vendor</span>
                    <p className="text-xs text-gray-500">Business-critical vendor requiring special attention</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Commercial Terms Tab */}
          {activeTab === 'commercial' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Commercial Terms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                  <select
                    name="payment_terms"
                    value={formData.payment_terms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="Net 7">Net 7</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Contacts</h2>
                <button
                  type="button"
                  onClick={addContact}
                  className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  Add Contact
                </button>
              </div>
              {formData.contacts.map((contact, index) => (
                <div key={contact.id || `contact-${index}`} className="p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">Contact {index + 1}</span>
                      {contact.is_primary && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-semibold">Primary</span>
                      )}
                    </div>
                    {formData.contacts.length > 1 && (
                      <button type="button" onClick={() => removeContact(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Designation"
                      value={contact.designation || contact.role || ''}
                      onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Addresses</h2>
                <button
                  type="button"
                  onClick={addAddress}
                  className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  Add Address
                </button>
              </div>
              {formData.addresses.map((address, index) => (
                <div key={address.id || `address-${index}`} className="p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <select
                      value={address.address_type}
                      onChange={(e) => handleAddressChange(index, 'address_type', e.target.value)}
                      className="px-3 py-1 border-2 border-gray-200 rounded-lg text-sm font-medium"
                    >
                      <option value="Registered">Registered</option>
                      <option value="Business">Business</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Billing">Billing</option>
                    </select>
                    {formData.addresses.length > 1 && (
                      <button type="button" onClick={() => removeAddress(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={address.line1 || address.address_line1 || ''}
                      onChange={(e) => handleAddressChange(index, 'line1', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium md:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      value={address.line2 || address.address_line2 || ''}
                      onChange={(e) => handleAddressChange(index, 'line2', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium md:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={address.postal_code}
                      onChange={(e) => handleAddressChange(index, 'postal_code', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={address.country}
                      onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Notes & Documents</h2>
                <button
                  type="button"
                  onClick={addNote}
                  className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold"
                >
                  <MessageSquare className="h-4 w-4" />
                  Add Note
                </button>
              </div>
              
              {formData.notes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No notes yet. Add a note to track important information.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.notes.map((note, index) => (
                    <div key={note.id || note.created_at || `note-${index}`} className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-900">{note.text}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(note.created_at).toLocaleString()} by {note.created_by}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(`/commerce/parties/vendors/${vendor_id}`)}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg font-semibold disabled:opacity-50"
              data-testid="save-vendor-btn"
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

export default VendorsEdit;

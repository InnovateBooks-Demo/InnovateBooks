import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Handshake, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PartnersEdit = () => {
  const { partner_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    legal_name: '',
    partner_type: 'Reseller',
    status: 'active',
    country_of_registration: 'India',
    currency: 'INR',
    commission_rate: 0,
    payment_terms: 'Net 30',
    contract_end_date: '',
    contacts: [{ name: '', designation: '', email: '', phone: '' }],
    addresses: [{ address_type: 'Registered', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'India' }]
  });

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
        const partner = response.data.partner;
        setFormData({
          display_name: partner.display_name || '',
          legal_name: partner.legal_name || '',
          partner_type: partner.partner_type || 'Reseller',
          status: partner.status || 'active',
          country_of_registration: partner.country_of_registration || 'India',
          currency: partner.currency || 'INR',
          commission_rate: partner.commission_rate || 0,
          payment_terms: partner.payment_terms || 'Net 30',
          contract_end_date: partner.contract_end_date || '',
          contacts: partner.contacts?.length > 0 ? partner.contacts : [{ name: '', designation: '', email: '', phone: '' }],
          addresses: partner.addresses?.length > 0 ? partner.addresses : [{ address_type: 'Registered', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'India' }]
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load partner details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${API_URL}/api/commerce/parties/partners/${partner_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Partner updated successfully');
      navigate(`/commerce/parties/partners/${partner_id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update partner');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.contacts];
    newContacts[index][field] = value;
    setFormData(prev => ({ ...prev, contacts: newContacts }));
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index][field] = value;
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', designation: '', email: '', phone: '' }]
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C4D9F4] via-white to-[#C4D9F4]/50" style={{ fontFamily: 'Poppins' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/commerce/parties/partners/${partner_id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Partner
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Handshake className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Partner</h1>
              <p className="text-sm text-gray-600 font-medium">{partner_id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name *</label>
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partner Type *</label>
                <select
                  name="partner_type"
                  value={formData.partner_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                >
                  <option value="Reseller">Reseller</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Agent">Agent</option>
                  <option value="Franchise">Franchise</option>
                  <option value="Strategic">Strategic Partner</option>
                  <option value="Technology">Technology Partner</option>
                  <option value="Referral">Referral Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                >
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="dormant">Dormant</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="country_of_registration"
                  value={formData.country_of_registration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                >
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
          </div>

          {/* Commercial Terms */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Commercial Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <select
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Immediate">Immediate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract End Date</label>
                <input
                  type="date"
                  name="contract_end_date"
                  value={formData.contract_end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Contacts</h2>
              <button
                type="button"
                onClick={addContact}
                className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add Contact
              </button>
            </div>
            {formData.contacts.map((contact, index) => (
              <div key={contact.id || `contact-${index}`} className="p-4 bg-gray-50 rounded-xl mb-4">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-semibold text-gray-700">Contact {index + 1}</span>
                  {formData.contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="text-red-500 hover:text-red-700"
                    >
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Designation"
                    value={contact.designation}
                    onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={contact.email}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Addresses</h2>
              <button
                type="button"
                onClick={addAddress}
                className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold"
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
                  </select>
                  {formData.addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={address.line1}
                    onChange={(e) => handleAddressChange(index, 'line1', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium md:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2"
                    value={address.line2}
                    onChange={(e) => handleAddressChange(index, 'line2', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium md:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={address.postal_code}
                    onChange={(e) => handleAddressChange(index, 'postal_code', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/commerce/parties/partners/${partner_id}`)}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg font-semibold disabled:opacity-50"
              data-testid="save-partner-btn"
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

export default PartnersEdit;

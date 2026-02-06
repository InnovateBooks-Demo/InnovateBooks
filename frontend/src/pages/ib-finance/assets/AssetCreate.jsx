import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Server, FileCode, Building } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AssetCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    asset_name: '',
    asset_type: 'tangible',
    asset_category: '',
    acquisition_date: new Date().toISOString().split('T')[0],
    capitalization_value: '',
    useful_life_months: 36,
    depreciation_method: 'straight_line',
    residual_value: 0,
    location: '',
    serial_number: '',
    source_type: '',
    source_reference_id: ''
  });

  const assetTypes = [
    { value: 'tangible', label: 'Tangible Asset', icon: Server, description: 'Machinery, Equipment, Hardware' },
    { value: 'intangible', label: 'Intangible Asset', icon: FileCode, description: 'Software, Licenses, IP' },
    { value: 'rou', label: 'Right-of-Use Asset', icon: Building, description: 'Lease Assets' }
  ];

  const categories = {
    tangible: ['IT Equipment', 'Machinery', 'Furniture', 'Vehicles', 'Office Equipment'],
    intangible: ['Software', 'Licenses', 'Patents', 'Trademarks', 'Development Costs'],
    rou: ['Office Lease', 'Equipment Lease', 'Vehicle Lease']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.asset_name || !formData.capitalization_value) {
      toast.error('Please fill required fields');
      return;
    }

    setLoading(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/assets`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          capitalization_value: parseFloat(formData.capitalization_value),
          residual_value: parseFloat(formData.residual_value) || 0,
          useful_life_months: parseInt(formData.useful_life_months)
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Asset capitalized successfully');
        navigate(`/ib-finance/assets/${data.data.asset_id}`);
      } else {
        toast.error('Failed to create asset');
      }
    } catch (error) {
      toast.error('Failed to create asset');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const calculateMonthlyDep = () => {
    const cap = parseFloat(formData.capitalization_value) || 0;
    const res = parseFloat(formData.residual_value) || 0;
    const life = parseInt(formData.useful_life_months) || 36;
    return (cap - res) / life;
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="asset-create">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/ib-finance/assets')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-500">IB Finance → Assets → Capitalize</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center">
              <Building2 className="h-7 w-7 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Capitalize Asset</h1>
              <p className="text-sm text-gray-500 mt-1">Create a new fixed asset record</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Type Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Asset Type</h3>
              <div className="grid grid-cols-3 gap-4">
                {assetTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, asset_type: type.value, asset_category: '' }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.asset_type === type.value 
                          ? 'border-cyan-500 bg-cyan-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mb-2 ${formData.asset_type === type.value ? 'text-cyan-600' : 'text-gray-400'}`} />
                      <p className={`font-medium ${formData.asset_type === type.value ? 'text-cyan-900' : 'text-gray-900'}`}>{type.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Asset Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Asset Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
                  <input
                    type="text"
                    name="asset_name"
                    value={formData.asset_name}
                    onChange={handleChange}
                    placeholder="e.g., Dell PowerEdge Server"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="asset_category"
                    value={formData.asset_category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select Category</option>
                    {categories[formData.asset_type]?.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Date *</label>
                  <input
                    type="date"
                    name="acquisition_date"
                    value={formData.acquisition_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Data Center - Mumbai"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    placeholder="e.g., SN-2024-001"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Depreciation Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Depreciation Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capitalization Value *</label>
                  <input
                    type="number"
                    name="capitalization_value"
                    value={formData.capitalization_value}
                    onChange={handleChange}
                    placeholder="500000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residual Value</label>
                  <input
                    type="number"
                    name="residual_value"
                    value={formData.residual_value}
                    onChange={handleChange}
                    placeholder="50000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Useful Life (months)</label>
                  <input
                    type="number"
                    name="useful_life_months"
                    value={formData.useful_life_months}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Depreciation Method</label>
                  <select
                    name="depreciation_method"
                    value={formData.depreciation_method}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="straight_line">Straight Line</option>
                    <option value="wdv">Written Down Value (WDV)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Source Reference */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Source Reference</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
                  <select
                    name="source_type"
                    value={formData.source_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select Source</option>
                    <option value="payable">Payable (Vendor Invoice)</option>
                    <option value="internal_cost">Internal Cost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Reference ID</label>
                  <input
                    type="text"
                    name="source_reference_id"
                    value={formData.source_reference_id}
                    onChange={handleChange}
                    placeholder="e.g., PAY-001"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Depreciation Preview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capitalization</span>
                  <span className="font-medium">{formatCurrency(formData.capitalization_value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Residual</span>
                  <span className="font-medium">{formatCurrency(formData.residual_value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Depreciable</span>
                  <span className="font-medium">{formatCurrency((formData.capitalization_value || 0) - (formData.residual_value || 0))}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-gray-600">Monthly Depreciation</span>
                  <span className="font-bold text-cyan-600">{formatCurrency(calculateMonthlyDep())}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Capitalizing...' : 'Capitalize Asset'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/ib-finance/assets')}
                className="w-full mt-3 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AssetCreate;

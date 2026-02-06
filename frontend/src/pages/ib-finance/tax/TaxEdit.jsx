import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calculator, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const TaxEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    tax_type: 'GST',
    taxable_amount: 0,
    tax_rate: 18,
    tax_amount: 0,
    jurisdiction: 'IN',
    status: 'pending',
    filing_period: '',
    notes: ''
  });

  const taxTypes = [
    { value: 'GST', label: 'GST - Goods & Services Tax' },
    { value: 'VAT', label: 'VAT - Value Added Tax' },
    { value: 'WHT', label: 'WHT - Withholding Tax' },
    { value: 'SALES_TAX', label: 'Sales Tax' },
    { value: 'SERVICE_TAX', label: 'Service Tax' }
  ];

  const jurisdictions = [
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'EU', label: 'European Union' },
    { value: 'SG', label: 'Singapore' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'filed', label: 'Filed' },
    { value: 'paid', label: 'Paid' },
    { value: 'refunded', label: 'Refunded' }
  ];

  useEffect(() => {
    fetchTaxTransaction();
  }, [id]);

  const fetchTaxTransaction = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/tax/transactions/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const record = data.data;
        setFormData({
          tax_type: record.tax_type || 'GST',
          taxable_amount: record.taxable_amount || 0,
          tax_rate: record.tax_rate || 18,
          tax_amount: record.tax_amount || 0,
          jurisdiction: record.jurisdiction || 'IN',
          status: record.status || 'pending',
          filing_period: record.filing_period || '',
          notes: record.notes || ''
        });
      } else {
        toast.error('Failed to fetch tax transaction');
        navigate('/ib-finance/tax');
      }
    } catch (error) {
      toast.error('Failed to fetch tax transaction');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate tax amount when taxable amount or rate changes
      if (name === 'taxable_amount' || name === 'tax_rate') {
        const taxable = name === 'taxable_amount' ? parseFloat(value) || 0 : prev.taxable_amount;
        const rate = name === 'tax_rate' ? parseFloat(value) || 0 : prev.tax_rate;
        updated.tax_amount = taxable * (rate / 100);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.taxable_amount <= 0) {
      toast.error('Taxable amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/tax/transactions/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          taxable_amount: parseFloat(formData.taxable_amount),
          tax_rate: parseFloat(formData.tax_rate),
          tax_amount: parseFloat(formData.tax_amount)
        })
      });

      if (response.ok) {
        toast.success('Tax transaction updated');
        navigate('/ib-finance/tax');
      } else {
        const err = await response.json();
        toast.error(err.detail || 'Failed to update tax transaction');
      }
    } catch (error) {
      toast.error('Failed to update tax transaction');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="tax-edit">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/ib-finance/tax')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-500">IB Finance → Tax → Edit</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
              <Calculator className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Tax Transaction</h1>
              <p className="text-sm text-gray-500 mt-1">Update tax transaction details</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Tax Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tax Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type *</label>
                  <select
                    name="tax_type"
                    value={formData.tax_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {taxTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
                  <select
                    name="jurisdiction"
                    value={formData.jurisdiction}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {jurisdictions.map(j => (
                      <option key={j.value} value={j.value}>{j.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filing Period</label>
                  <input
                    type="month"
                    name="filing_period"
                    value={formData.filing_period}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Amount Calculation */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Amount Calculation</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taxable Amount *</label>
                  <input
                    type="number"
                    name="taxable_amount"
                    value={formData.taxable_amount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    name="tax_rate"
                    value={formData.tax_rate}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Amount</label>
                  <input
                    type="number"
                    name="tax_amount"
                    value={formData.tax_amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="font-semibold text-amber-800 mb-4">Tax Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-amber-700">Taxable Amount</span>
                  <span className="font-medium">{formatCurrency(formData.taxable_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Tax Rate</span>
                  <span className="font-medium">{formData.tax_rate}%</span>
                </div>
                <div className="border-t border-amber-200 pt-3 flex justify-between">
                  <span className="font-semibold text-amber-800">Tax Amount</span>
                  <span className="font-bold text-xl text-amber-700">{formatCurrency(formData.tax_amount)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/ib-finance/tax')}
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

export default TaxEdit;

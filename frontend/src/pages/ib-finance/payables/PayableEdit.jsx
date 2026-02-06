import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Wallet, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PayableEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    vendor_name: '',
    bill_number: '',
    due_date: '',
    payment_terms: 'net_30',
    line_items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: ''
  });

  const paymentTerms = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'net_15', label: 'Net 15' },
    { value: 'net_30', label: 'Net 30' },
    { value: 'net_45', label: 'Net 45' },
    { value: 'net_60', label: 'Net 60' }
  ];

  useEffect(() => {
    fetchPayable();
  }, [id]);

  const fetchPayable = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/payables/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const record = data.data;
        setFormData({
          vendor_name: record.vendor_name || '',
          bill_number: record.bill_number || '',
          due_date: record.due_date?.split('T')[0] || '',
          payment_terms: record.payment_terms || 'net_30',
          line_items: record.line_items?.length ? record.line_items : [{ description: '', quantity: 1, rate: 0, amount: 0 }],
          notes: record.notes || ''
        });
      } else {
        toast.error('Failed to fetch payable');
        navigate('/ib-finance/payables');
      }
    } catch (error) {
      toast.error('Failed to fetch payable');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLineItemChange = (index, field, value) => {
    const items = [...formData.line_items];
    items[index][field] = value;
    if (field === 'quantity' || field === 'rate') {
      items[index].amount = items[index].quantity * items[index].rate;
    }
    setFormData(prev => ({ ...prev, line_items: items }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.line_items.length === 1) return;
    const items = formData.line_items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, line_items: items }));
  };

  const calculateTotal = () => {
    return formData.line_items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vendor_name) {
      toast.error('Please enter vendor name');
      return;
    }

    setLoading(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/payables/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Payable updated successfully');
        navigate('/ib-finance/payables');
      } else {
        const err = await response.json();
        toast.error(err.detail || 'Failed to update payable');
      }
    } catch (error) {
      toast.error('Failed to update payable');
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="payable-edit">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/ib-finance/payables')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-500">IB Finance → Payables → Edit</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Wallet className="h-7 w-7 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Payable</h1>
              <p className="text-sm text-gray-500 mt-1">Update vendor bill information</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Vendor Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
                  <input
                    type="text"
                    name="vendor_name"
                    value={formData.vendor_name}
                    onChange={handleChange}
                    placeholder="Vendor name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
                  <input
                    type="text"
                    name="bill_number"
                    value={formData.bill_number}
                    onChange={handleChange}
                    placeholder="BILL-XXX"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                  <select
                    name="payment_terms"
                    value={formData.payment_terms}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {paymentTerms.map(term => (
                      <option key={term.value} value={term.value}>{term.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Line Items</h3>
                <button type="button" onClick={addLineItem} className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-20">Qty</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-32">Rate</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-32">Amount</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.line_items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                          placeholder="Item description"
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleLineItemChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeLineItem(idx)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="flex justify-between py-3 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="font-bold text-xl text-orange-600">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/ib-finance/payables')}
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

export default PayableEdit;

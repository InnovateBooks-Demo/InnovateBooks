import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ReceivableEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    customer_name: '',
    due_date: '',
    aging_bucket: '0-30',
    contact_email: '',
    contact_phone: '',
    notes: ''
  });

  const agingBuckets = [
    { value: '0-30', label: '0-30 Days (Current)' },
    { value: '31-60', label: '31-60 Days' },
    { value: '61-90', label: '61-90 Days' },
    { value: '90+', label: '90+ Days (Overdue)' }
  ];

  useEffect(() => {
    fetchReceivable();
  }, [id]);

  const fetchReceivable = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/receivables/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const record = data.data;
        setFormData({
          customer_name: record.customer_name || '',
          due_date: record.due_date?.split('T')[0] || '',
          aging_bucket: record.aging_bucket || '0-30',
          contact_email: record.contact_email || '',
          contact_phone: record.contact_phone || '',
          notes: record.notes || ''
        });
      } else {
        toast.error('Failed to fetch receivable');
        navigate('/ib-finance/receivables');
      }
    } catch (error) {
      toast.error('Failed to fetch receivable');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name) {
      toast.error('Please enter customer name');
      return;
    }

    setLoading(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/receivables/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Receivable updated successfully');
        navigate('/ib-finance/receivables');
      } else {
        const err = await response.json();
        toast.error(err.detail || 'Failed to update receivable');
      }
    } catch (error) {
      toast.error('Failed to update receivable');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="receivable-edit">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/ib-finance/receivables')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-500">IB Finance → Receivables → Edit</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Receivable</h1>
              <p className="text-sm text-gray-500 mt-1">Update receivable information</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Customer name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aging Bucket</label>
              <select
                name="aging_bucket"
                value={formData.aging_bucket}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {agingBuckets.map(bucket => (
                  <option key={bucket.value} value={bucket.value}>{bucket.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="customer@example.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/ib-finance/receivables')}
              className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReceivableEdit;

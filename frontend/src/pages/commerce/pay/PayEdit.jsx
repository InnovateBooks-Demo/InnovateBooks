import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PayEdit = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    vendor_id: '',
    invoice_id: '',
    po_id: '',
    invoice_number: '',
    invoice_amount: 0,
    due_date: ''
  });

  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/commerce/pay/${paymentId}`);
      const pay = response.data;
      
      setFormData({
        vendor_id: pay.vendor_id || '',
        invoice_id: pay.invoice_id || '',
        po_id: pay.po_id || '',
        invoice_number: pay.invoice_number || '',
        invoice_amount: pay.invoice_amount || 0,
        due_date: pay.due_date || ''
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      toast.error('Failed to load payment details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await axios.put(`${BACKEND_URL}/api/commerce/pay/${paymentId}`, formData);
      toast.success('Payment updated successfully');
      navigate(`/commerce/pay/${paymentId}`);
    } catch (error) {
      console.error('Failed to update payment:', error);
      toast.error(error.response?.data?.detail || 'Failed to update payment');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-purple-600">
          <Loader className="h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">Loading payment details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/commerce/pay/${paymentId}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>
              Edit Payment {paymentId}
            </h2>
            <p className="text-slate-600 mt-1">Update payment information</p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={saving}
          className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Editable Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vendor ID
              </label>
              <Input
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
                placeholder="Vendor ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Invoice Number
              </label>
              <Input
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                placeholder="Invoice number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Invoice Amount (₹)
              </label>
              <Input
                type="number"
                name="invoice_amount"
                value={formData.invoice_amount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Due Date
              </label>
              <Input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Payment status and approval workflow are managed through the payment detail page.
            </p>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default PayEdit;
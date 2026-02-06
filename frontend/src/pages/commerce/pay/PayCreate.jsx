import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PayCreate = () => {
  const navigate = useNavigate();
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vendor_id: '',
    invoice_id: '',
    po_id: '',
    invoice_number: '',
    invoice_amount: 0,
    due_date: ''
  });

  useEffect(() => {
    fetchProcurements();
  }, []);

  const fetchProcurements = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/commerce/procure`);
      setProcurements(response.data || []);
    } catch (error) {
      console.error('Failed to fetch procurements:', error);
      toast.error('Failed to load procurements');
    }
  };

  const handleProcurementSelect = (e) => {
    const procId = e.target.value;
    const selectedProc = procurements.find(p => p.requisition_id === procId);
    
    if (selectedProc) {
      setFormData({
        vendor_id: selectedProc.vendor_id || '',
        invoice_id: `VINV-${selectedProc.requisition_id}`,
        po_id: selectedProc.po_id || selectedProc.requisition_id,
        invoice_number: `VINV-${selectedProc.requisition_id}`,
        invoice_amount: selectedProc.estimated_value || 0,
        due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      });
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
    
    if (!formData.vendor_id || !formData.invoice_number) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/commerce/pay`, formData);
      toast.success('Payment created successfully');
      navigate('/commerce/pay');
    } catch (error) {
      console.error('Failed to create payment:', error);
      toast.error(error.response?.data?.detail || 'Failed to create payment');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/commerce/pay">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>
              Create Payment
            </h2>
            <p className="text-slate-600 mt-1">Process new vendor payment</p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Creating...' : 'Create Payment'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Procurement/PO
              </label>
              <select
                onChange={handleProcurementSelect}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a procurement...</option>
                {procurements.map(proc => (
                  <option key={proc.requisition_id} value={proc.requisition_id}>
                    {proc.requisition_id} - {proc.vendor_name} - ₹{(proc.estimated_value / 100000).toFixed(1)}L
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vendor ID <span className="text-red-500">*</span>
              </label>
              <Input
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
                placeholder="Vendor ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <Input
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                placeholder="Invoice number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                PO ID
              </label>
              <Input
                name="po_id"
                value={formData.po_id}
                onChange={handleChange}
                placeholder="Purchase order ID"
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
                Due Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Note:</strong> Payment will be created with 'Draft' status. 
              You can approve and process it from the payment detail page.
            </p>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default PayCreate;
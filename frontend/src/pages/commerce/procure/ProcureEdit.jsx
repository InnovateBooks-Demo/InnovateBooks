import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProcureEdit = () => {
  const { requisitionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    vendor_id: '',
    vendor_name: '',
    department: 'IT',
    priority: 'Medium',
    payment_terms: 'Net 30'
  });

  useEffect(() => {
    fetchProcurementDetails();
  }, [requisitionId]);

  const fetchProcurementDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/commerce/procure/${requisitionId}`);
      const proc = response.data;
      
      setFormData({
        vendor_id: proc.vendor_id || '',
        vendor_name: proc.vendor_name || '',
        department: proc.department || 'IT',
        priority: proc.priority || 'Medium',
        payment_terms: proc.payment_terms || 'Net 30'
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch procurement details:', error);
      toast.error('Failed to load procurement details');
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
      await axios.put(`${BACKEND_URL}/api/commerce/procure/${requisitionId}`, formData);
      toast.success('Procurement updated successfully');
      navigate(`/commerce/procure/${requisitionId}`);
    } catch (error) {
      console.error('Failed to update procurement:', error);
      toast.error(error.response?.data?.detail || 'Failed to update procurement');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-purple-600">
          <Loader className="h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">Loading procurement details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/commerce/procure/${requisitionId}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>
              Edit Procurement {requisitionId}
            </h2>
            <p className="text-slate-600 mt-1">Update procurement information</p>
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
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Editable Procurement Details</h3>
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
                Vendor Name
              </label>
              <Input
                name="vendor_name"
                value={formData.vendor_name}
                onChange={handleChange}
                placeholder="Vendor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="IT">IT</option>
                <option value="Operations">Operations</option>
                <option value="Admin">Admin</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Terms
              </label>
              <select
                name="payment_terms"
                value={formData.payment_terms}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="COD">COD</option>
                <option value="Advance">Advance</option>
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Line items and financial details are managed through the procurement creation process.
            </p>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProcureEdit;
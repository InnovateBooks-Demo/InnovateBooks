import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProcureCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vendor_id: '',
    vendor_name: '',
    department: 'IT',
    priority: 'Medium',
    payment_terms: 'Net 30',
    items: [
      {
        item_code: '',
        item_description: '',
        quantity: 1,
        unit_price: 0,
        total_price: 0,
        hsn_code: ''
      }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : updatedItems[index].quantity;
      const unitPrice = field === 'unit_price' ? parseFloat(value) || 0 : updatedItems[index].unit_price;
      updatedItems[index].total_price = quantity * unitPrice;
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item_code: `ITEM-${prev.items.length + 1}`,
          item_description: '',
          quantity: 1,
          unit_price: 0,
          total_price: 0,
          hsn_code: ''
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.vendor_id || !formData.vendor_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.items.some(item => !item.item_description || item.unit_price <= 0)) {
      toast.error('Please fill in all item details');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/commerce/procure`, formData);
      toast.success('Procurement created successfully');
      navigate('/commerce/procure');
    } catch (error) {
      console.error('Failed to create procurement:', error);
      toast.error(error.response?.data?.detail || 'Failed to create procurement');
      setLoading(false);
    }
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + item.total_price, 0);
  const taxAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + taxAmount;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/commerce/procure">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>
              Create Procurement
            </h2>
            <p className="text-slate-600 mt-1">New purchase requisition</p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Creating...' : 'Create Procurement'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Procurement Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vendor ID <span className="text-red-500">*</span>
              </label>
              <Input
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
                placeholder="e.g., VEND-2025-001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="vendor_name"
                value={formData.vendor_name}
                onChange={handleChange}
                placeholder="Vendor name"
                required
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
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Line Items</h3>
            <Button type="button" onClick={addItem} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={`item-${index}`} className="p-4 border border-slate-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <Input
                      value={item.item_description}
                      onChange={(e) => handleItemChange(index, 'item_description', e.target.value)}
                      placeholder="Item description"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Unit Price (₹)</label>
                    <Input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">HSN Code</label>
                    <Input
                      value={item.hsn_code}
                      onChange={(e) => handleItemChange(index, 'hsn_code', e.target.value)}
                      placeholder="HSN"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                      className="w-full text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-sm font-medium text-slate-700">Total: </span>
                  <span className="text-base font-bold text-slate-900">₹{item.total_price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium text-slate-900">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (18%):</span>
                  <span className="font-medium text-slate-900">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
                  <span className="text-slate-900">Grand Total:</span>
                  <span className="text-purple-600">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProcureCreate;
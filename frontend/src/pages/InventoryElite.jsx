import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Search, Package, AlertCircle, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const InventoryElite = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/operations/inventory`);
      setInventory(response.data.inventory || []);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-indigo-600 font-semibold text-lg">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins' }}>
              Inventory Management
            </h1>
            <p className="text-indigo-600 mt-2 font-medium text-lg">Track stock levels and movements</p>
          </div>
          <button
            onClick={() => navigate('/operations/inventory/create')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg">Add Item</span>
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-indigo-500/50 shadow-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-600" />
              <input
                type="text"
                placeholder="Search by item name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-indigo-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/50 text-indigo-600 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-indigo-500/50 shadow-xl">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-lg inline-block mb-3">
            <Package className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1">Total Items</p>
          <p className="text-3xl font-black text-indigo-600">{filteredInventory.length}</p>
        </div>

        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-emerald-500/50 shadow-xl">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg inline-block mb-3">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-1">In Stock</p>
          <p className="text-3xl font-black text-emerald-900">{filteredInventory.filter(i => i.status === 'In Stock').length}</p>
        </div>

        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-amber-500/50 shadow-xl">
          <div className="p-3 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl shadow-lg inline-block mb-3">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">Low Stock</p>
          <p className="text-3xl font-black text-amber-900">{filteredInventory.filter(i => i.status === 'Low Stock').length}</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border-2 border-indigo-500/50 shadow-2xl">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">Inventory Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Item Code</th>
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Item Name</th>
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Category</th>
                <th className="px-6 py-4 text-right font-bold text-sm uppercase">In Stock</th>
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Location</th>
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-600/20">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-all">
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">{item.item_code}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600 font-medium">{item.item_name}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600">{item.category}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-indigo-600">{item.quantity_in_stock}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600">{item.location}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryElite;
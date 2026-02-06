import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Search, Eye, Edit, ClipboardCheck, TrendingUp, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const WorkOrdersElite = () => {
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const loadWorkOrders = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/operations/work-orders`);
      setWorkOrders(response.data.work_orders || []);
    } catch (error) {
      toast.error('Failed to load work orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.wo_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wo.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-indigo-600 font-semibold text-lg">Loading work orders...</p>
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
              Work Orders
            </h1>
            <p className="text-indigo-600 mt-2 font-medium text-lg">Production order management</p>
          </div>
          <button
            onClick={() => navigate('/operations/work-orders/create')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg">Create Work Order</span>
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-indigo-500/50 shadow-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-600" />
              <input
                type="text"
                placeholder="Search by work order number or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-indigo-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/50 text-indigo-600 font-medium"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white border-2 border-indigo-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/50 text-indigo-600 font-medium"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="released">Released</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-indigo-500/50 shadow-xl">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-lg inline-block mb-3">
            <ClipboardCheck className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1">Total Work Orders</p>
          <p className="text-3xl font-black text-indigo-600">{filteredWorkOrders.length}</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border-2 border-indigo-500/50 shadow-2xl">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">Work Order List</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">WO Number</th>
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Product</th>
                <th className="px-6 py-4 text-right font-bold text-sm uppercase">Quantity</th>
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Status</th>
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Priority</th>
                <th className="px-6 py-4 text-center font-bold text-sm uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-600/20">
              {filteredWorkOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-indigo-50/30 transition-all">
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">{wo.wo_number}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600 font-medium">{wo.product_name}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-indigo-600">{wo.quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      wo.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      wo.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      wo.status === 'Released' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {wo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      wo.priority === 'High' ? 'bg-red-100 text-red-700' :
                      wo.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {wo.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/operations/work-orders/${wo.id}`)}
                        className="p-2 hover:bg-indigo-600/10 rounded-lg transition-all"
                      >
                        <Eye className="h-4 w-4 text-indigo-600" />
                      </button>
                    </div>
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

export default WorkOrdersElite;
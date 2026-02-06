import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ArrowLeft, Search, Eye, AlertTriangle, Clock, CheckCircle, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ServicesList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchServices();
  }, [statusFilter]);

  const fetchServices = async () => {
    try {
      const token = authService.getToken();
      const url = statusFilter === 'all'
        ? `${API_URL}/api/operations/services`
        : `${API_URL}/api/operations/services?status=${statusFilter}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (serviceId, newStatus) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/operations/services/${serviceId}/status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        toast.success(`Service ${newStatus}`);
        fetchServices();
      }
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      created: 'bg-gray-100 text-gray-700',
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      terminated: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getSlaStatusBadge = (slaStatus) => {
    const styles = {
      on_track: 'bg-green-100 text-green-700',
      at_risk: 'bg-yellow-100 text-yellow-700',
      breached: 'bg-red-100 text-red-700'
    };
    return styles[slaStatus] || 'bg-gray-100 text-gray-700';
  };

  const filteredServices = services.filter(s =>
    s.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.party_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50" data-testid="services-list">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/operations')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-500">Operations → Services</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
              <Truck className="h-7 w-7 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
              <p className="text-sm text-gray-500 mt-1">Non-project execution, SLA & usage control</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Usage</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">SLA Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredServices.map(service => (
                <tr key={service.service_instance_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{service.service_name}</p>
                    <p className="text-xs text-gray-500">{service.service_instance_id}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{service.party_name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded capitalize">
                      {service.service_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (service.usage_current / service.usage_limit) > 0.9 ? 'bg-red-500' :
                            (service.usage_current / service.usage_limit) > 0.7 ? 'bg-yellow-500' : 'bg-teal-500'
                          }`}
                          style={{ width: `${(service.usage_current / service.usage_limit) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{service.usage_current}/{service.usage_limit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getSlaStatusBadge(service.sla_status)}`}>
                      {service.sla_status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(service.status)}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/operations/services/${service.service_instance_id}`)}
                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {service.status === 'active' && (
                        <button
                          onClick={() => updateStatus(service.service_instance_id, 'paused')}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                          title="Pause"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                      {service.status === 'paused' && (
                        <button
                          onClick={() => updateStatus(service.service_instance_id, 'active')}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Resume"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredServices.length === 0 && (
            <div className="py-12 text-center text-gray-500">No services found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesList;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ClipboardList, FolderKanban, CheckSquare, Package, Users, Truck, Shield, ArrowUpRight, ArrowDownRight, AlertTriangle, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OperationsDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/operations/governance/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {
      id: 'intake',
      title: 'Intake',
      description: 'Commercial-to-Execution Translation',
      icon: ClipboardList,
      path: '/operations/intake',
      color: 'from-blue-500 to-blue-600',
      metrics: [
        { label: 'Pending', value: '3' },
        { label: 'Accepted', value: '12' }
      ]
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Structured Execution & Delivery',
      icon: FolderKanban,
      path: '/operations/projects',
      color: 'from-purple-500 to-purple-600',
      metrics: [
        { label: 'Active', value: stats.active_projects || '5' },
        { label: 'At Risk', value: stats.at_risk_projects || '1' }
      ]
    },
    {
      id: 'tasks',
      title: 'Tasks',
      description: 'Atomic Execution & Orchestration',
      icon: CheckSquare,
      path: '/operations/tasks',
      color: 'from-green-500 to-green-600',
      metrics: [
        { label: 'Open', value: '24' },
        { label: 'Completed', value: '156' }
      ]
    },
    {
      id: 'resources',
      title: 'Resources',
      description: 'Consumption & Capacity Control',
      icon: Package,
      path: '/operations/resources',
      color: 'from-orange-500 to-orange-600',
      metrics: [
        { label: 'Items', value: '45' },
        { label: 'Resources', value: '12' }
      ]
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Non-Project Execution & SLA',
      icon: Truck,
      path: '/operations/services',
      color: 'from-teal-500 to-teal-600',
      metrics: [
        { label: 'Active', value: '8' },
        { label: 'On Track', value: '7' }
      ]
    },
    {
      id: 'governance',
      title: 'Governance',
      description: 'Control, Deviation & Enforcement',
      icon: Shield,
      path: '/operations/governance',
      color: 'from-red-500 to-red-600',
      metrics: [
        { label: 'Alerts', value: stats.open_alerts || '2' },
        { label: 'Critical', value: stats.critical_alerts || '0' }
      ]
    }
  ];

  const kpis = [
    { label: 'Active Projects', value: stats.active_projects || '5', change: '+2', up: true, icon: FolderKanban },
    { label: 'Open Alerts', value: stats.open_alerts || '2', change: '-3', up: true, icon: AlertTriangle },
    { label: 'SLA Compliance', value: '94%', change: '+2%', up: true, icon: Target },
    { label: 'On-Time Delivery', value: '87%', change: '-1%', up: false, icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="operations-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">IB Operations</h1>
              <p className="text-sm text-gray-500 mt-1">Execution, Delivery, Fulfillment & Control</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <kpi.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${kpi.up ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Module Cards */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Operations Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => navigate(module.path)}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              data-testid={`module-${module.id}`}
            >
              <div className={`bg-gradient-to-r ${module.color} p-4`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <module.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                    <p className="text-sm text-white/80">{module.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {module.metrics.map((metric, i) => (
                    <div key={i}>
                      <p className="text-sm text-gray-500">{metric.label}</p>
                      <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Execution Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80">Work Orders</p>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-white/60">This Month</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80">Tasks Completed</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-white/60">This Month</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80">Services Active</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-white/60">Running</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80">SLA Breaches</p>
              <p className="text-2xl font-bold">{stats.sla_breaches || 0}</p>
              <p className="text-xs text-white/60">This Month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboard;

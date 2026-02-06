import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, Receipt, CreditCard, BookOpen, Building2, Calculator, Lock,
  ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, Clock, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../utils/auth';
import FinanceNotificationBell from '../../components/FinanceNotificationBell';
import OfflineIndicator from '../../components/OfflineIndicator';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const IBFinanceDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || {});
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {
      id: 'billing',
      title: 'Billing',
      description: 'Invoice & Charge Generation',
      icon: Receipt,
      path: '/ib-finance/billing',
      color: 'from-blue-500 to-blue-600',
      metrics: [
        { label: 'Total', value: stats.billing?.total || 0 },
        { label: 'Pending', value: stats.billing?.pending || 0 }
      ]
    },
    {
      id: 'receivables',
      title: 'Receivables',
      description: 'Customer Dues & Collections',
      icon: Wallet,
      path: '/ib-finance/receivables',
      color: 'from-emerald-500 to-emerald-600',
      metrics: [
        { label: 'Open', value: stats.receivables?.open || 0 },
        { label: 'Overdue', value: stats.receivables?.overdue || 0 }
      ]
    },
    {
      id: 'payables',
      title: 'Payables',
      description: 'Vendor Bills & Settlements',
      icon: CreditCard,
      path: '/ib-finance/payables',
      color: 'from-amber-500 to-amber-600',
      metrics: [
        { label: 'Open', value: stats.payables?.open || 0 },
        { label: 'Overdue', value: stats.payables?.overdue || 0 }
      ]
    },
    {
      id: 'ledger',
      title: 'Ledger',
      description: 'System of Record',
      icon: BookOpen,
      path: '/ib-finance/ledger',
      color: 'from-purple-500 to-purple-600',
      metrics: [
        { label: 'Accounts', value: '15' },
        { label: 'Entries', value: '234' }
      ]
    },
    {
      id: 'assets',
      title: 'Assets',
      description: 'Capitalization & Depreciation',
      icon: Building2,
      path: '/ib-finance/assets',
      color: 'from-cyan-500 to-cyan-600',
      metrics: [
        { label: 'Active', value: stats.assets?.active || 0 },
        { label: 'NBV', value: '₹12.5L' }
      ]
    },
    {
      id: 'tax',
      title: 'Tax',
      description: 'Tax Determination & Compliance',
      icon: Calculator,
      path: '/ib-finance/tax',
      color: 'from-rose-500 to-rose-600',
      metrics: [
        { label: 'Output', value: '₹90K' },
        { label: 'Input', value: '₹23K' }
      ]
    },
    {
      id: 'close',
      title: 'Close',
      description: 'Period Control & Finalization',
      icon: Lock,
      path: '/ib-finance/close',
      color: 'from-indigo-500 to-indigo-600',
      metrics: [
        { label: 'Current', value: stats.current_period?.period || '2025-01' },
        { label: 'Status', value: stats.current_period?.status || 'Open' }
      ]
    }
  ];

  const kpis = [
    { label: 'Total Receivables', value: '₹5.9L', change: '+12%', up: true, icon: Wallet },
    { label: 'Total Payables', value: '₹1.75L', change: '-8%', up: true, icon: CreditCard },
    { label: 'Net Position', value: '₹4.15L', change: '+18%', up: true, icon: TrendingUp },
    { label: 'Overdue Items', value: '2', change: '-1', up: true, icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="ib-finance-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">IB Finance</h1>
                <p className="text-sm text-gray-500 mt-1">Financial Truth & Settlement Engine</p>
              </div>
            </div>
            <FinanceNotificationBell />
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <kpi.icon className="h-5 w-5 text-emerald-600" />
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Finance Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {/* Financial Summary Bar */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80">Billed This Month</p>
              <p className="text-2xl font-bold">₹10.03L</p>
              <p className="text-xs text-white/60">3 Invoices</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80">Collections</p>
              <p className="text-2xl font-bold">₹0</p>
              <p className="text-xs text-white/60">Pending</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80">Payments Due</p>
              <p className="text-2xl font-bold">₹1.75L</p>
              <p className="text-xs text-white/60">2 Bills</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80">Tax Liability</p>
              <p className="text-2xl font-bold">₹67K</p>
              <p className="text-xs text-white/60">Net GST</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default IBFinanceDashboard;

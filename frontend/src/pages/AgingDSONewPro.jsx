import React, { useState, useEffect } from 'react';
import { invoiceAPI } from '../utils/api';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { TrendingUp, Clock, AlertCircle, DollarSign } from 'lucide-react';

const AgingDSONewPro = () => {
  const [agingData, setAgingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgingData();
  }, []);

  const loadAgingData = async () => {
    try {
      const response = await invoiceAPI.getAging();
      setAgingData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load aging data');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || 0}`;

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const buckets = agingData || {};
  const totalOutstanding = Object.values(buckets).reduce((sum, bucket) => sum + (bucket.amount || 0), 0);
  const avgDSO = buckets?.average_dso || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>Aging & DSO Analysis</h1>
        <p className="text-gray-600 mt-1">Accounts Receivable aging report and DSO metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Outstanding</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalOutstanding)}</p>
          <p className="text-sm text-gray-500">Across all buckets</p>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(buckets.Current?.total_amount || 0)}</p>
          <p className="text-sm text-gray-500">{buckets.Current?.count || 0} invoices</p>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Overdue</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency((buckets['0-30 Days']?.total_amount || 0) + (buckets['31-60 Days']?.total_amount || 0) + (buckets['61-90 Days']?.total_amount || 0) + (buckets['90+ Days']?.total_amount || 0))}</p>
          <p className="text-sm text-gray-500">Past due</p>
        </Card>

        <Card className="p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg DSO</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{Math.round(avgDSO)}</p>
          <p className="text-sm text-gray-500">days</p>
        </Card>
      </div>

      {/* Aging Buckets Table */}
      <Card className="p-6 bg-white border-0 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins' }}>Aging Buckets</h2>
        <div className="space-y-4">
          {[
            { key: 'Current', label: 'Current', color: 'blue' },
            { key: '0-30 Days', label: '0-30 Days', color: 'yellow' },
            { key: '31-60 Days', label: '31-60 Days', color: 'orange' },
            { key: '61-90 Days', label: '61-90 Days', color: 'red' },
            { key: '90+ Days', label: '90+ Days', color: 'purple' }
          ].map(bucket => {
            const data = buckets[bucket.key] || { count: 0, amount: 0 };
            const percentage = totalOutstanding > 0 ? (data.amount / totalOutstanding) * 100 : 0;
            
            return (
              <div key={bucket.key} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${bucket.color}-500`}></div>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>{bucket.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>{formatCurrency(data.amount)}</p>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>{data.count} invoices</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${bucket.color}-400 to-${bucket.color}-600 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-right" style={{ fontFamily: 'Inter, sans-serif' }}>{percentage.toFixed(1)}% of total</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AgingDSONewPro;

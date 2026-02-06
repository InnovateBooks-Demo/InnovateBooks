import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Search, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PortfolioElite = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/capital/portfolio`);
      setPortfolio(response.data.portfolio || []);
    } catch (error) {
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolio = portfolio.filter(item =>
    item.security_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = filteredPortfolio.reduce((sum, item) => sum + (item.current_value || 0), 0);
  const totalGainLoss = filteredPortfolio.reduce((sum, item) => sum + (item.gain_loss || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
          <p className="mt-4 text-teal-600 font-semibold text-lg">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50/50 p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-teal-600 to-teal-700 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins' }}>
              Investment Portfolio
            </h1>
            <p className="text-teal-600 mt-2 font-medium text-lg">Track your investment performance</p>
          </div>
          <button
            onClick={() => navigate('/capital/portfolio/create')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg">Add Investment</span>
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-teal-500/50 shadow-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-600" />
              <input
                type="text"
                placeholder="Search by security name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-teal-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-600/50 text-teal-600 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-teal-500/50 shadow-xl">
          <div className="p-3 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl shadow-lg inline-block mb-3">
            <PieChart className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">Total Holdings</p>
          <p className="text-3xl font-black text-teal-600">{filteredPortfolio.length}</p>
        </div>

        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-emerald-500/50 shadow-xl">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg inline-block mb-3">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-1">Portfolio Value</p>
          <p className="text-3xl font-black text-emerald-900">₹{(totalValue / 100000).toFixed(2)}L</p>
        </div>

        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-amber-500/50 shadow-xl">
          <div className="p-3 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl shadow-lg inline-block mb-3">
            {totalGainLoss >= 0 ? <TrendingUp className="h-6 w-6 text-white" /> : <TrendingDown className="h-6 w-6 text-white" />}
          </div>
          <p className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">Total Gain/Loss</p>
          <p className={`text-3xl font-black ${totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalGainLoss >= 0 ? '+' : ''}₹{(totalGainLoss / 1000).toFixed(2)}K
          </p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border-2 border-teal-500/50 shadow-2xl">
        <h2 className="text-2xl font-bold text-teal-600 mb-6">Portfolio Holdings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Security</th>
                <th className="px-6 py-4 text-left font-bold text-sm uppercase">Asset Class</th>
                <th className="px-6 py-4 text-right font-bold text-sm uppercase">Quantity</th>
                <th className="px-6 py-4 text-right font-bold text-sm uppercase">Current Value</th>
                <th className="px-6 py-4 text-right font-bold text-sm uppercase">Gain/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-600/20">
              {filteredPortfolio.map((item) => (
                <tr key={item.id} className="hover:bg-teal-50/30 transition-all">
                  <td className="px-6 py-4 text-sm font-bold text-teal-600">{item.security_name}</td>
                  <td className="px-6 py-4 text-sm text-teal-600 font-medium">{item.asset_class}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-teal-600">{item.quantity}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-teal-600">₹{item.current_value?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold">
                    <span className={item.gain_loss >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                      {item.gain_loss >= 0 ? '+' : ''}₹{item.gain_loss?.toLocaleString()}
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

export default PortfolioElite;
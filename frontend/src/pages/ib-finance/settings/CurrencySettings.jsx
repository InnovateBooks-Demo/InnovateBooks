import React, { useState, useEffect } from 'react';
import { Coins, RefreshCw, ArrowRightLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const CurrencySettings = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRate, setEditingRate] = useState(null);
  const [converter, setConverter] = useState({ amount: 1000, from: 'USD', to: 'INR', result: null });

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/currencies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrencies(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRate = async (code, newRate) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/currencies/rates`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currency_code: code, rate_to_base: parseFloat(newRate) })
      });
      if (response.ok) {
        toast.success(`Exchange rate updated for ${code}`);
        setEditingRate(null);
        fetchCurrencies();
      }
    } catch (error) {
      toast.error('Failed to update rate');
    }
  };

  const handleConvert = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/convert`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: converter.amount,
          from_currency: converter.from,
          to_currency: converter.to
        })
      });
      if (response.ok) {
        const data = await response.json();
        setConverter(prev => ({ ...prev, result: data.data }));
      }
    } catch (error) {
      toast.error('Conversion failed');
    }
  };

  const formatCurrency = (amount, code) => {
    const curr = currencies.find(c => c.code === code);
    return `${curr?.symbol || ''}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="currency-settings">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Coins className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Multi-Currency Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage exchange rates and currency conversion</p>
              </div>
            </div>
            <button 
              onClick={fetchCurrencies}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" /> Refresh Rates
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Currency Converter */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Currency Converter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={converter.amount}
                  onChange={(e) => setConverter(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <select
                    value={converter.from}
                    onChange={(e) => setConverter(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <select
                    value={converter.to}
                    onChange={(e) => setConverter(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleConvert}
                className="w-full py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="h-4 w-4" /> Convert
              </button>
              
              {converter.result && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-700">Result:</p>
                  <p className="text-2xl font-bold text-emerald-800">
                    {formatCurrency(converter.result.converted, converter.to)}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Rate: 1 {converter.from} = {converter.result.effective_rate} {converter.to}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Exchange Rates Table */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Exchange Rates (Base: INR)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Currency</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Symbol</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Rate to INR</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currencies.map(currency => (
                    <tr key={currency.code} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{currency.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{currency.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{currency.symbol}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {editingRate === currency.code ? (
                          <input
                            type="number"
                            defaultValue={currency.rate_to_base}
                            step="0.01"
                            className="w-24 px-2 py-1 border border-gray-200 rounded text-right"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateRate(currency.code, e.target.value);
                              }
                              if (e.key === 'Escape') {
                                setEditingRate(null);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <span className={`font-medium ${currency.custom_rate ? 'text-emerald-600' : 'text-gray-900'}`}>
                            {currency.rate_to_base}
                            {currency.custom_rate && <span className="ml-1 text-xs">✓</span>}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!currency.is_base && (
                          editingRate === currency.code ? (
                            <button
                              onClick={() => setEditingRate(null)}
                              className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingRate(currency.code)}
                              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                            >
                              Edit
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySettings;

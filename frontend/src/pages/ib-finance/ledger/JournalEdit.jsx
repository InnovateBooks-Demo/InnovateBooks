import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../../utils/auth';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const JournalEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    journal_date: '',
    source_module: 'manual',
    description: '',
    period: '',
    lines: []
  });

  useEffect(() => {
    fetchAccounts();
    fetchJournalEntry();
  }, [id]);

  const fetchAccounts = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/ledger/accounts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch accounts');
    }
  };

  const fetchJournalEntry = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/ledger/journals/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const journal = data.data;
        setFormData({
          journal_date: journal.journal_date?.split('T')[0] || '',
          source_module: journal.source_module || 'manual',
          description: journal.description || '',
          period: journal.period || '',
          lines: journal.lines?.length ? journal.lines : [
            { account_id: '', account_code: '', account_name: '', debit_amount: 0, credit_amount: 0, description: '' },
            { account_id: '', account_code: '', account_name: '', debit_amount: 0, credit_amount: 0, description: '' }
          ]
        });
      } else {
        toast.error('Failed to fetch journal entry');
        navigate('/ib-finance/ledger');
      }
    } catch (error) {
      toast.error('Failed to fetch journal entry');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLineChange = (index, field, value) => {
    const lines = [...formData.lines];
    lines[index][field] = value;
    
    if (field === 'account_id') {
      const account = accounts.find(a => a.account_id === value);
      if (account) {
        lines[index].account_code = account.account_code;
        lines[index].account_name = account.account_name;
      }
    }
    
    setFormData(prev => ({ ...prev, lines }));
  };

  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, { account_id: '', account_code: '', account_name: '', debit_amount: 0, credit_amount: 0, description: '' }]
    }));
  };

  const removeLine = (index) => {
    if (formData.lines.length <= 2) {
      toast.error('Journal must have at least 2 lines');
      return;
    }
    const lines = formData.lines.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, lines }));
  };

  const calculateTotals = () => {
    const totalDebit = formData.lines.reduce((sum, l) => sum + (parseFloat(l.debit_amount) || 0), 0);
    const totalCredit = formData.lines.reduce((sum, l) => sum + (parseFloat(l.credit_amount) || 0), 0);
    return { totalDebit, totalCredit, isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { totalDebit, totalCredit, isBalanced } = calculateTotals();
    
    if (!isBalanced) {
      toast.error('Debit must equal Credit');
      return;
    }

    if (totalDebit === 0) {
      toast.error('Journal amount cannot be zero');
      return;
    }

    setLoading(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/api/ib-finance/ledger/journals/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Journal entry updated');
        navigate(`/ib-finance/ledger/journal/${id}`);
      } else {
        const err = await response.json();
        toast.error(err.detail || 'Failed to update journal');
      }
    } catch (error) {
      toast.error('Failed to update journal entry');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const { totalDebit, totalCredit, isBalanced } = calculateTotals();

  // Group accounts by type
  const groupedAccounts = accounts.reduce((acc, account) => {
    const type = account.account_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(account);
    return acc;
  }, {});

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="journal-edit">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(`/ib-finance/ledger/journal/${id}`)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-500">IB Finance → Ledger → Edit Journal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Journal Entry</h1>
              <p className="text-sm text-gray-500 mt-1">Update journal entry details</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Journal Header</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Journal Date *</label>
                  <input
                    type="date"
                    name="journal_date"
                    value={formData.journal_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                  <input
                    type="month"
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Module</label>
                  <select
                    name="source_module"
                    value={formData.source_module}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="manual">Manual Entry</option>
                    <option value="adjustment">Period Adjustment</option>
                    <option value="correction">Error Correction</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter journal description..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Journal Lines */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Journal Lines</h3>
                <button type="button" onClick={addLine} className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                  <Plus className="h-4 w-4" /> Add Line
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Account</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-40">Description</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-32">Debit</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-32">Credit</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.lines.map((line, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">
                        <select
                          value={line.account_id}
                          onChange={(e) => handleLineChange(idx, 'account_id', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                        >
                          <option value="">Select Account</option>
                          {Object.entries(groupedAccounts).map(([type, accts]) => (
                            <optgroup key={type} label={type.charAt(0).toUpperCase() + type.slice(1) + 's'}>
                              {accts.map(acc => (
                                <option key={acc.account_id} value={acc.account_id}>
                                  {acc.account_code} - {acc.account_name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) => handleLineChange(idx, 'description', e.target.value)}
                          placeholder="Line description"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={line.debit_amount || ''}
                          onChange={(e) => handleLineChange(idx, 'debit_amount', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={line.credit_amount || ''}
                          onChange={(e) => handleLineChange(idx, 'credit_amount', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full px-2 py-1.5 border border-gray-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-semibold">
                  <tr>
                    <td className="px-3 py-3" colSpan={2}>Total</td>
                    <td className="px-3 py-3 text-right">{formatCurrency(totalDebit)}</td>
                    <td className="px-3 py-3 text-right">{formatCurrency(totalCredit)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Balance Check */}
            <div className={`rounded-xl border-2 p-6 ${isBalanced ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center gap-3 mb-4">
                {isBalanced ? (
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                )}
                <div>
                  <p className={`font-semibold ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
                    {isBalanced ? 'Journal is Balanced' : 'Journal is NOT Balanced'}
                  </p>
                  <p className={`text-sm ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                    Difference: {formatCurrency(Math.abs(totalDebit - totalCredit))}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={isBalanced ? 'text-green-700' : 'text-red-700'}>Total Debit</span>
                  <span className="font-semibold">{formatCurrency(totalDebit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isBalanced ? 'text-green-700' : 'text-red-700'}>Total Credit</span>
                  <span className="font-semibold">{formatCurrency(totalCredit)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <button
                type="submit"
                disabled={loading || !isBalanced}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/ib-finance/ledger/journal/${id}`)}
                className="w-full mt-3 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JournalEdit;

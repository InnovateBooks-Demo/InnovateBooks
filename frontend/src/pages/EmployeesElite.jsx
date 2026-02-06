import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Search, Users, Mail, Phone, Building2, Edit, Eye } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EmployeesElite = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/workforce/employees`);
      setEmployees(response.data.employees || []);
    } catch (error) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p className="mt-4 text-orange-600 font-semibold text-lg">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-600 to-orange-700 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins' }}>
              Employees
            </h1>
            <p className="text-orange-600 mt-2 font-medium text-lg">Manage your workforce</p>
          </div>
          <button
            onClick={() => navigate('/workforce/employees/create')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg">Add Employee</span>
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-orange-500/50 shadow-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-600" />
              <input
                type="text"
                placeholder="Search employees by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-orange-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-600/50 text-orange-600 font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-8 border-2 border-orange-500/50 shadow-2xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-2">Total Employees</p>
            <p className="text-5xl font-black text-orange-600">{filteredEmployees.length}</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl shadow-2xl">
            <Users className="h-16 w-16 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border-2 border-orange-500/50 shadow-xl hover:shadow-2xl hover:border-orange-600 transition-all cursor-pointer"
            onClick={() => navigate(`/workforce/employees/${employee.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/workforce/employees/${employee.id}/edit`);
                }}
                className="p-2 hover:bg-orange-50 rounded-lg transition-all"
              >
                <Edit className="h-4 w-4 text-orange-500" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-orange-600 mb-1">{employee.name}</h3>
            <p className="text-sm text-orange-600/70 mb-3">{employee.employee_code}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-orange-600/70">
                <Building2 className="h-4 w-4" />
                <span>{employee.department} - {employee.designation}</span>
              </div>
              {employee.email && (
                <div className="flex items-center gap-2 text-sm text-orange-600/70">
                  <Mail className="h-4 w-4" />
                  <span>{employee.email}</span>
                </div>
              )}
              {employee.phone && (
                <div className="flex items-center gap-2 text-sm text-orange-600/70">
                  <Phone className="h-4 w-4" />
                  <span>{employee.phone}</span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-orange-500/20">
              <div className="flex justify-between items-center">
                <span className="text-xs text-orange-600/70">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  employee.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesElite;
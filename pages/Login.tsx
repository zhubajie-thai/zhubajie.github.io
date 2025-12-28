import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Settings } from '../types';

const Login: React.FC = () => {
  const { login, settings } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('sales');
  const [currency, setCurrency] = useState(settings.currency);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert('Please enter your name');
    
    login(name, role, currency);
    navigate('/dashboard');
  };

  const handleQuickLogin = (demoName: string, demoRole: string) => {
    setName(demoName);
    setRole(demoRole);
    login(demoName, demoRole, currency);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 to-brand-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐷</div>
          <h1 className="text-3xl font-bold text-gray-800">Pork Shop</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase mt-2">Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="sales">Sales Staff</option>
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white"
            >
              {settings.currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-4">QUICK DEMO ACCESS</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleQuickLogin('Demo Sales', 'sales')}
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Sales Demo
            </button>
            <button
              onClick={() => handleQuickLogin('Demo Manager', 'manager')}
              className="bg-amber-50 text-amber-700 hover:bg-amber-100 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Manager Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

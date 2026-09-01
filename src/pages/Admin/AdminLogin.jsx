import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ShieldCheck, Lock, User, AlertCircle, Loader } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (api.isAdmin()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
        {/* Header Branding */}
        <div className="bg-dark-navy p-8 text-center text-white space-y-2 relative">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-primary-navy"></div>
          <div className="h-12 w-12 rounded-xl bg-blue-accent/20 border border-blue-accent/30 text-blue-300 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black tracking-wide uppercase">Admin Portal</h2>
          <p className="text-slate-400 text-xs font-medium">Banking Automation Technology</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-lg p-3 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full text-sm pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-medium text-dark-navy"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-dark-navy uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-navy font-medium text-dark-navy"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary-navy hover:bg-blue-accent text-white font-extrabold text-sm py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider flex items-center justify-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <span>Verify & Access</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        {/* Pulsing Loading spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-bold text-slate-500 mt-4 tracking-wider uppercase">Loading security context...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    // Redirect to login page but save the target route they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Authenticated but unauthorized role (e.g., customer trying to access /admin)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl p-8 border border-red-100 max-w-md shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5 border border-red-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Access Restricted</h2>
          <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wide">Error Code: 403 Forbidden</p>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Your account ({user.name}) is registered as a <span className="font-bold text-slate-700 capitalize">{user.role}</span>. You do not have permissions to access this dashboard.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
};

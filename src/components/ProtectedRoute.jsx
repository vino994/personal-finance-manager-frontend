import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ redirectTo = '/login' }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
}

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <Loading />;
  }
  
  if (!user) {
    return <Navigate to="/admin/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
}

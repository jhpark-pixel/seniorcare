import { useState } from 'react';
import { Admin } from '../types';

export function useAuth() {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = (tokenValue: string, adminData: Admin) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setToken(tokenValue);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken(null);
    setAdmin(null);
  };

  const isAuthenticated = !!token && !!admin;

  return { admin, token, isAuthenticated, login, logout };
}

import { useState, useEffect } from 'react';
import { Admin } from '../types';
import { authApi } from '../services/api';

export function useAuth() {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  // 토큰이 없으면 자동 로그인
  useEffect(() => {
    if (!token || !admin) {
      authApi.login('admin', 'admin123').then(res => {
        login(res.data.token, res.data.admin);
      }).catch(() => {});
    }
  }, []);

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

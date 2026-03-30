import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuthContext } from '../App';

export default function Login() {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(username, password);
      login(res.data.token, res.data.admin);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
              🏥
            </div>
            <h1 className="text-2xl font-bold text-gray-900">시니어 케어</h1>
            <p className="text-gray-500 text-sm mt-1">입주자 통합 관리 시스템</p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">아이디</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-field"
                placeholder="아이디를 입력하세요"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 계정 안내 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-medium mb-2">테스트 계정</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>시설장: <span className="font-mono bg-white px-1 rounded">admin / admin123</span></p>
              <p>간호사: <span className="font-mono bg-white px-1 rounded">nurse / nurse123</span></p>
              <p>생활지도사: <span className="font-mono bg-white px-1 rounded">social / social123</span></p>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-4">© 2024 시니어 케어 시스템</p>
      </div>
    </div>
  );
}

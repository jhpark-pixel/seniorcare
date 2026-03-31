import React, { useState, useEffect } from 'react';
import { adminManagementApi } from '../services/api';

interface Admin {
  id: string;
  username: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  DIRECTOR: '시설장',
  NURSE: '간호사',
  SOCIAL_WORKER: '생활지도사',
};

const roleBadgeColors: Record<string, string> = {
  DIRECTOR: 'bg-purple-100 text-purple-800',
  NURSE: 'bg-blue-100 text-blue-800',
  SOCIAL_WORKER: 'bg-green-100 text-green-800',
};

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordTargetId, setPasswordTargetId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; message: string; onConfirm: () => void }>({
    show: false,
    message: '',
    onConfirm: () => {},
  });

  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    role: 'NURSE',
    email: '',
    phone: '',
  });

  const [error, setError] = useState('');

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminManagementApi.list();
      setAdmins(res.data);
    } catch (err) {
      console.error('관리자 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openAddModal = () => {
    setEditingAdmin(null);
    setForm({ username: '', password: '', name: '', role: 'NURSE', email: '', phone: '' });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setForm({
      username: admin.username,
      password: '',
      name: admin.name,
      role: admin.role,
      email: admin.email || '',
      phone: admin.phone || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setError('');

    if (!editingAdmin) {
      if (!form.username.trim()) {
        setError('아이디를 입력해주세요.');
        return;
      }
      if (!form.password.trim()) {
        setError('비밀번호를 입력해주세요.');
        return;
      }
    }
    if (!form.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    try {
      if (editingAdmin) {
        await adminManagementApi.update(editingAdmin.id, {
          name: form.name,
          role: form.role,
          email: form.email || null,
          phone: form.phone || null,
        });
      } else {
        await adminManagementApi.create({
          username: form.username,
          password: form.password,
          name: form.name,
          role: form.role,
          email: form.email || null,
          phone: form.phone || null,
        });
      }
      setShowModal(false);
      fetchAdmins();
    } catch (err: any) {
      setError(err.response?.data?.message || '저장에 실패했습니다.');
    }
  };

  const handleResetPassword = async () => {
    if (!passwordTargetId || !newPassword.trim()) return;
    try {
      await adminManagementApi.resetPassword(passwordTargetId, newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      setPasswordTargetId(null);
    } catch (err: any) {
      alert(err.response?.data?.message || '비밀번호 초기화에 실패했습니다.');
    }
  };

  const handleToggleActive = (admin: Admin) => {
    if (admin.isActive) {
      setConfirmDialog({
        show: true,
        message: `"${admin.name}" 계정을 비활성화하시겠습니까?`,
        onConfirm: async () => {
          try {
            await adminManagementApi.delete(admin.id);
            fetchAdmins();
          } catch (err: any) {
            alert(err.response?.data?.message || '비활성화에 실패했습니다.');
          }
          setConfirmDialog({ show: false, message: '', onConfirm: () => {} });
        },
      });
    } else {
      setConfirmDialog({
        show: true,
        message: `"${admin.name}" 계정을 다시 활성화하시겠습니까?`,
        onConfirm: async () => {
          try {
            await adminManagementApi.update(admin.id, { isActive: true });
            fetchAdmins();
          } catch (err: any) {
            alert(err.response?.data?.message || '활성화에 실패했습니다.');
          }
          setConfirmDialog({ show: false, message: '', onConfirm: () => {} });
        },
      });
    }
  };

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">직원 계정 관리</h1>
          <p className="text-sm text-gray-500 mt-1">직원 계정을 추가, 수정, 비활성화할 수 있습니다.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          새 계정 추가
        </button>
      </div>

      {/* 직원 목록 테이블 */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">불러오는 중...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">이름</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">아이디</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">역할</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">이메일</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">연락처</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{admin.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{admin.username}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadgeColors[admin.role] || 'bg-gray-100 text-gray-800'}`}>
                        {roleLabels[admin.role] || admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{admin.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{admin.phone || '-'}</td>
                    <td className="px-6 py-4">
                      {admin.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">활성</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">비활성</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="text-xs px-2.5 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
                            setPasswordTargetId(admin.id);
                            setNewPassword('');
                            setShowPasswordModal(true);
                          }}
                          className="text-xs px-2.5 py-1.5 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors font-medium"
                        >
                          비밀번호 초기화
                        </button>
                        <button
                          onClick={() => handleToggleActive(admin)}
                          className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                            admin.isActive
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {admin.isActive ? '비활성화' : '활성화'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">등록된 직원이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingAdmin ? '직원 정보 수정' : '새 직원 계정 추가'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  disabled={!!editingAdmin}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="로그인 아이디"
                />
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="비밀번호"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="직원 이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">역할</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DIRECTOR">시설장</option>
                  <option value="NURSE">간호사</option>
                  <option value="SOCIAL_WORKER">생활지도사</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이메일 (선택)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="연락처 (선택)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingAdmin ? '저장' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 초기화 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">비밀번호 초기화</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="새 비밀번호 입력"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                  setPasswordTargetId(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 확인 다이얼로그 */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">확인</h2>
            <p className="text-sm text-gray-600 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog({ show: false, message: '', onConfirm: () => {} })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

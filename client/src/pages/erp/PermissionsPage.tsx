import React, { useMemo } from 'react';
import { useStaff, useCollection } from '../../context/AppStateContext';

const roles = ['시설장', '간호사', '생활지도사'];
const modules = ['입소자관리', '건강관리', '컨시어지', '커뮤니티', '식사관리', '시설관리', '경영통계', '경영관리'];

const initialPermissions: Record<string, Record<string, boolean>> = {
  '시설장': { '입소자관리': true, '건강관리': true, '컨시어지': true, '커뮤니티': true, '식사관리': true, '시설관리': true, '경영통계': true, '경영관리': true },
  '간호사': { '입소자관리': true, '건강관리': true, '컨시어지': true, '커뮤니티': true, '식사관리': false, '시설관리': false, '경영통계': false, '경영관리': false },
  '생활지도사': { '입소자관리': true, '건강관리': false, '컨시어지': true, '커뮤니티': true, '식사관리': true, '시설관리': false, '경영통계': false, '경영관리': false },
};

export default function PermissionsPage() {
  const [staff] = useStaff();

  const staffByRole = useMemo(() => ({
    '시설장': staff.filter(s => s.roleLabel === '시설장'),
    '간호사': staff.filter(s => s.roleLabel === '간호사'),
    '생활지도사': staff.filter(s => s.roleLabel === '생활지도사'),
  }), [staff]);
  const [permStore, setPermStore] = useCollection<Record<string, Record<string, boolean>>>('permissions', [JSON.parse(JSON.stringify(initialPermissions))]);
  const permissions = permStore[0] ?? initialPermissions;

  const toggle = (role: string, module: string) => {
    if (role === '시설장') return;
    setPermStore((prev) => {
      const next = JSON.parse(JSON.stringify(prev[0]));
      next[role][module] = !next[role][module];
      return [next];
    });
  };

  const handleSave = () => {
    // permissions are auto-persisted to central store
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">권한관리</h1>
        <p className="mt-1 text-sm text-gray-500">역할별 메뉴 접근 권한을 관리합니다.</p>
      </div>

      {/* 직원 역할별 현황 */}
      <div className="grid grid-cols-3 gap-4">
        {roles.map(role => (
          <div key={role} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-800 mb-2">{role}</div>
            <div className="space-y-1">
              {(staffByRole[role] ?? []).map(s => (
                <div key={s.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 font-medium">{s.name}</span>
                  <span className="text-gray-400">{s.email}</span>
                </div>
              ))}
              {(staffByRole[role] ?? []).length === 0 && (
                <span className="text-xs text-gray-400">해당 직원 없음</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 권한 매트릭스 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">역할</th>
                {modules.map((m) => (
                  <th key={m} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {role}
                    {role === '시설장' && <span className="ml-2 text-xs text-gray-400">(전체 권한)</span>}
                  </td>
                  {modules.map((mod) => (
                    <td key={mod} className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[role]?.[mod] ?? false}
                        onChange={() => toggle(role, mod)}
                        disabled={role === '시설장'}
                        className={`w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${role === '시설장' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800"><span className="font-semibold">참고:</span> 시설장 권한은 변경할 수 없습니다. 권한 변경 시 해당 역할의 모든 직원에게 즉시 적용됩니다.</p>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
          저장
        </button>
      </div>
    </div>
  );
}

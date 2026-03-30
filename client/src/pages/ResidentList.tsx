import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { residentsApi } from '../services/api';
import { Resident } from '../types';

const statusLabel: Record<string, string> = {
  ACTIVE: '재실', OUT: '외출', HOSPITALIZED: '입원', DISCHARGED: '퇴소',
};
const statusColor: Record<string, string> = {
  ACTIVE: 'badge-green', OUT: 'badge-yellow', HOSPITALIZED: 'badge-red', DISCHARGED: 'badge-gray',
};
const genderLabel: Record<string, string> = { MALE: '남', FEMALE: '여' };
const cognitiveLabel: Record<string, string> = {
  NORMAL: '정상', MILD: '경증', MODERATE: '중등도', SEVERE: '중증',
};

function getAge(birthDate: string) {
  return new Date().getFullYear() - new Date(birthDate).getFullYear();
}

export default function ResidentList() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadResidents();
  }, [search, statusFilter, page]);

  const loadResidents = async () => {
    setLoading(true);
    try {
      const res = await residentsApi.list({ search, status: statusFilter || undefined, page, limit });
      setResidents(res.data.data);
      setTotal(res.data.total);
    } catch {}
    setLoading(false);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="이름, 호실 검색..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field w-60"
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field w-32"
          >
            <option value="">전체 상태</option>
            <option value="ACTIVE">재실</option>
            <option value="OUT">외출</option>
            <option value="HOSPITALIZED">입원</option>
            <option value="DISCHARGED">퇴소</option>
          </select>
        </div>
        <button onClick={() => navigate('/residents/new')} className="btn-primary flex items-center gap-2">
          <span>+</span> 입주자 등록
        </button>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">입주자 목록</h3>
          <span className="text-sm text-gray-500">총 {total}명</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <p>불러오는 중...</p>
          </div>
        ) : residents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-4xl mb-3">👥</p>
            <p>입주자가 없습니다.</p>
            <button onClick={() => navigate('/residents/new')} className="mt-3 text-blue-600 text-sm hover:underline">
              새 입주자 등록 →
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="table-header">호실</th>
                <th className="table-header">이름</th>
                <th className="table-header">나이/성별</th>
                <th className="table-header">상태</th>
                <th className="table-header">이동 능력</th>
                <th className="table-header">인지 수준</th>
                <th className="table-header">건강 점수</th>
                <th className="table-header">질환</th>
                <th className="table-header">낙상 미처리</th>
                <th className="table-header">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {residents.map(r => (
                <tr
                  key={r.id}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/residents/${r.id}`)}
                >
                  <td className="table-cell font-medium">{r.roomNumber}호</td>
                  <td className="table-cell font-semibold text-blue-700">{r.name}</td>
                  <td className="table-cell">{getAge(r.birthDate)}세 / {genderLabel[r.gender]}</td>
                  <td className="table-cell">
                    <span className={`badge ${statusColor[r.status]}`}>{statusLabel[r.status]}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4].map(l => (
                        <div key={l} className={`w-3 h-3 rounded-sm ${l <= r.mobilityLevel ? 'bg-blue-500' : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${
                      r.cognitiveLevel === 'NORMAL' ? 'badge-green' :
                      r.cognitiveLevel === 'MILD' ? 'badge-yellow' :
                      r.cognitiveLevel === 'MODERATE' ? 'bg-orange-100 text-orange-800' :
                      'badge-red'
                    }`}>
                      {cognitiveLabel[r.cognitiveLevel]}
                    </span>
                  </td>
                  <td className="table-cell">
                    {r.healthScore !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16">
                          <div
                            className={`h-1.5 rounded-full ${
                              r.healthScore >= 80 ? 'bg-green-500' :
                              r.healthScore >= 60 ? 'bg-yellow-500' :
                              r.healthScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${r.healthScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{r.healthScore}</span>
                      </div>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-wrap gap-1">
                      {r.diseases?.slice(0, 2).map(d => (
                        <span key={d.id} className="badge badge-blue">{d.disease.name}</span>
                      ))}
                      {(r.diseases?.length || 0) > 2 && (
                        <span className="badge badge-gray">+{(r.diseases?.length || 0) - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    {(r.unhandledFallCount || 0) > 0 ? (
                      <span className="badge badge-red">🚨 {r.unhandledFallCount}건</span>
                    ) : (
                      <span className="text-gray-400 text-xs">없음</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/residents/${r.id}`)}
                        className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        상세
                      </button>
                      <button
                        onClick={() => navigate(`/residents/${r.id}/edit`)}
                        className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50"
                      >
                        수정
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              ← 이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded text-sm ${page === p ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              다음 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

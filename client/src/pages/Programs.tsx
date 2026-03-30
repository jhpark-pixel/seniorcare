import React, { useEffect, useState } from 'react';
import { programsApi, residentsApi } from '../services/api';
import { Program, Resident } from '../types';

const categoryLabel: Record<string, string> = {
  HEALTH_REHAB: '건강재활', EXERCISE: '운동', COGNITIVE: '인지훈련',
  CULTURE: '문화여가', SOCIAL: '사회참여', EXTERNAL: '외부활동',
};
const categoryColor: Record<string, string> = {
  HEALTH_REHAB: 'badge-red', EXERCISE: 'badge-green', COGNITIVE: 'badge-blue',
  CULTURE: 'bg-purple-100 text-purple-800', SOCIAL: 'bg-pink-100 text-pink-800',
  EXTERNAL: 'badge-yellow',
};
const statusLabel: Record<string, string> = {
  RECRUITING: '모집중', ONGOING: '진행중', ENDED: '종료', SUSPENDED: '중단',
};
const dayLabel = ['일', '월', '화', '수', '목', '금', '토'];

function parseSchedule(scheduleStr: string) {
  try {
    const schedules = JSON.parse(scheduleStr);
    return schedules.map((s: any) =>
      `${dayLabel[s.dayOfWeek]}요일 ${s.startTime}-${s.endTime}`
    ).join(', ');
  } catch {
    return scheduleStr;
  }
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [enrollResidentId, setEnrollResidentId] = useState('');
  const [showEnroll, setShowEnroll] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', category: 'HEALTH_REHAB', description: '',
    instructor: '', location: '', capacity: '',
    status: 'RECRUITING', minMobilityLevel: 1, minCognitiveLevel: 'NORMAL',
  });
  const [schedules, setSchedules] = useState([{ dayOfWeek: 1, startTime: '10:00', endTime: '11:00' }]);

  useEffect(() => {
    loadPrograms();
    loadResidents();
  }, [categoryFilter]);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const res = await programsApi.list({ category: categoryFilter || undefined });
      setPrograms(res.data);
    } catch {}
    setLoading(false);
  };

  const loadResidents = async () => {
    try {
      const res = await residentsApi.list({ status: 'ACTIVE', limit: 100 });
      setResidents(res.data.data);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        schedule: JSON.stringify(schedules),
      };
      await programsApi.create(data);
      setShowForm(false);
      loadPrograms();
    } catch (err: any) {
      alert(err.response?.data?.message || '저장에 실패했습니다.');
    }
  };

  const handleEnroll = async () => {
    if (!showEnroll || !enrollResidentId) return;
    try {
      await programsApi.enroll(showEnroll, enrollResidentId);
      alert('등록되었습니다.');
      setShowEnroll(null);
      setEnrollResidentId('');
      loadPrograms();
    } catch (err: any) {
      alert(err.response?.data?.message || '등록에 실패했습니다.');
    }
  };

  const handleCancelEnroll = async (programId: string, enrollmentId: string) => {
    if (!confirm('등록을 취소하시겠습니까?')) return;
    try {
      await programsApi.cancelEnroll(programId, enrollmentId);
      loadPrograms();
    } catch {}
  };

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!categoryFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            전체
          </button>
          {Object.entries(categoryLabel).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${categoryFilter === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + 프로그램 추가
        </button>
      </div>

      {/* 프로그램 그리드 */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">불러오는 중...</div>
      ) : programs.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🎯</p>
          <p>등록된 프로그램이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {programs.map(program => (
            <div key={program.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{program.name}</h3>
                    <span className={`badge ${categoryColor[program.category]}`}>
                      {categoryLabel[program.category]}
                    </span>
                  </div>
                  {program.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{program.description}</p>
                  )}
                </div>
                <span className={`badge ml-2 ${
                  program.status === 'ONGOING' ? 'badge-green' :
                  program.status === 'RECRUITING' ? 'badge-blue' :
                  program.status === 'SUSPENDED' ? 'badge-yellow' : 'badge-gray'
                }`}>
                  {statusLabel[program.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                {program.instructor && (
                  <div className="flex items-center gap-1.5">
                    <span>👨‍🏫</span> {program.instructor}
                  </div>
                )}
                {program.location && (
                  <div className="flex items-center gap-1.5">
                    <span>📍</span> {program.location}
                  </div>
                )}
                <div className="flex items-center gap-1.5 col-span-2">
                  <span>🗓️</span> {parseSchedule(program.schedule)}
                </div>
              </div>

              {/* 정원 */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">참여 인원</span>
                  <span className="font-medium">
                    {program.enrolledCount} / {program.capacity || '무제한'}명
                  </span>
                </div>
                {program.capacity && (
                  <div className="bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (program.enrolledCount / program.capacity) * 100)}%` }}
                    />
                  </div>
                )}
              </div>

              {/* 등록자 목록 */}
              {program.enrollments && program.enrollments.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">등록 인원</p>
                  <div className="flex flex-wrap gap-1">
                    {program.enrollments.filter(e => e.status === 'ACTIVE').slice(0, 5).map(e => (
                      <div key={e.id} className="flex items-center gap-1 bg-blue-50 rounded px-1.5 py-0.5">
                        <span className="text-xs text-blue-700">{e.resident?.name}</span>
                        <button
                          onClick={() => handleCancelEnroll(program.id, e.id)}
                          className="text-xs text-gray-400 hover:text-red-500"
                        >✕</button>
                      </div>
                    ))}
                    {(program.enrollments.filter(e => e.status === 'ACTIVE').length || 0) > 5 && (
                      <span className="text-xs text-gray-400">+{(program.enrollments.filter(e => e.status === 'ACTIVE').length) - 5}명</span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEnroll(program.id)}
                  disabled={!!program.capacity && program.enrolledCount >= program.capacity}
                  className="flex-1 text-sm bg-blue-50 text-blue-700 py-1.5 rounded-lg hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  + 입주자 등록
                </button>
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="text-sm bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  상세
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 프로그램 등록 모달 */}
      {showEnroll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-96 fade-in">
            <h3 className="font-bold text-lg mb-4">입주자 프로그램 등록</h3>
            <div className="space-y-3">
              <div>
                <label className="label">입주자 선택</label>
                <select value={enrollResidentId} onChange={e => setEnrollResidentId(e.target.value)} className="input-field">
                  <option value="">선택하세요</option>
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.roomNumber}호)</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowEnroll(null)} className="btn-secondary flex-1">취소</button>
                <button onClick={handleEnroll} disabled={!enrollResidentId} className="btn-primary flex-1">등록</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 프로그램 추가 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg fade-in my-4">
            <h3 className="font-bold text-lg mb-4">새 프로그램 추가</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label">프로그램명 *</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="label">카테고리</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                    {Object.entries(categoryLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">상태</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input-field">
                    <option value="RECRUITING">모집중</option>
                    <option value="ONGOING">진행중</option>
                    <option value="SUSPENDED">중단</option>
                  </select>
                </div>
                <div>
                  <label className="label">담당자</label>
                  <input type="text" value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="label">장소</label>
                  <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="label">정원</label>
                  <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} className="input-field" placeholder="제한없음" />
                </div>
                <div className="col-span-2">
                  <label className="label">설명</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field h-16 resize-none" />
                </div>
              </div>

              {/* 일정 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">일정</label>
                  <button type="button" onClick={() => setSchedules(s => [...s, { dayOfWeek: 1, startTime: '10:00', endTime: '11:00' }])}
                    className="text-xs text-blue-600 hover:text-blue-800">+ 추가</button>
                </div>
                {schedules.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select value={s.dayOfWeek} onChange={e => {
                      const newS = [...schedules]; newS[i].dayOfWeek = parseInt(e.target.value); setSchedules(newS);
                    }} className="input-field w-24">
                      {dayLabel.map((d, idx) => <option key={idx} value={idx}>{d}요일</option>)}
                    </select>
                    <input type="time" value={s.startTime} onChange={e => { const newS = [...schedules]; newS[i].startTime = e.target.value; setSchedules(newS); }} className="input-field" />
                    <input type="time" value={s.endTime} onChange={e => { const newS = [...schedules]; newS[i].endTime = e.target.value; setSchedules(newS); }} className="input-field" />
                    {schedules.length > 1 && (
                      <button type="button" onClick={() => setSchedules(s => s.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 px-2">✕</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">취소</button>
                <button type="submit" className="btn-primary flex-1">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

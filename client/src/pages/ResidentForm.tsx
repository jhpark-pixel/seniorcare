import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { residentsApi } from '../services/api';

export default function ResidentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', birthDate: '', gender: 'FEMALE', roomNumber: '',
    moveInDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE', height: '', weight: '',
    mobilityLevel: 1, cognitiveLevel: 'NORMAL',
  });

  useEffect(() => {
    if (isEdit) loadResident();
  }, [id]);

  const loadResident = async () => {
    setLoading(true);
    try {
      const res = await residentsApi.get(id!);
      const r = res.data;
      setForm({
        name: r.name, gender: r.gender, roomNumber: r.roomNumber, status: r.status,
        birthDate: r.birthDate.split('T')[0],
        moveInDate: r.moveInDate.split('T')[0],
        height: r.height?.toString() || '', weight: r.weight?.toString() || '',
        mobilityLevel: r.mobilityLevel, cognitiveLevel: r.cognitiveLevel,
      });
    } catch {}
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        height: form.height ? parseFloat(form.height) : undefined,
        weight: form.weight ? parseFloat(form.weight) : undefined,
      };
      if (isEdit) {
        await residentsApi.update(id!, data);
      } else {
        const res = await residentsApi.create(data);
        navigate(`/residents/${res.data.id}`);
        return;
      }
      navigate(`/residents/${id}`);
    } catch (err: any) {
      alert(err.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16 text-gray-400">불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {isEdit ? '입주자 정보 수정' : '신규 입주자 등록'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">이름 *</label>
              <input
                type="text" required
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-field" placeholder="홍길동"
              />
            </div>
            <div>
              <label className="label">성별 *</label>
              <select
                value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className="input-field"
              >
                <option value="FEMALE">여성</option>
                <option value="MALE">남성</option>
              </select>
            </div>
            <div>
              <label className="label">생년월일 *</label>
              <input
                type="date" required
                value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">호실 *</label>
              <input
                type="text" required
                value={form.roomNumber} onChange={e => setForm(f => ({ ...f, roomNumber: e.target.value }))}
                className="input-field" placeholder="101"
              />
            </div>
            <div>
              <label className="label">입소일 *</label>
              <input
                type="date" required
                value={form.moveInDate} onChange={e => setForm(f => ({ ...f, moveInDate: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">상태</label>
              <select
                value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="input-field"
              >
                <option value="ACTIVE">재실</option>
                <option value="OUT">외출</option>
                <option value="HOSPITALIZED">입원</option>
                <option value="DISCHARGED">퇴소</option>
              </select>
            </div>
            <div>
              <label className="label">키 (cm)</label>
              <input
                type="number" step="0.1"
                value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
                className="input-field" placeholder="165"
              />
            </div>
            <div>
              <label className="label">체중 (kg)</label>
              <input
                type="number" step="0.1"
                value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                className="input-field" placeholder="60"
              />
            </div>
          </div>

          <div>
            <label className="label">이동 능력 등급</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(l => (
                <button
                  key={l} type="button"
                  onClick={() => setForm(f => ({ ...f, mobilityLevel: l }))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.mobilityLevel === l
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  Lv.{l}
                  <span className="block text-xs font-normal">
                    {l === 1 ? '완전 자립' : l === 2 ? '보조 필요' : l === 3 ? '부분 의존' : '완전 의존'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">인지 수준</label>
            <div className="flex gap-2">
              {[
                { value: 'NORMAL', label: '정상' },
                { value: 'MILD', label: '경증' },
                { value: 'MODERATE', label: '중등도' },
                { value: 'SEVERE', label: '중증' },
              ].map(opt => (
                <button
                  key={opt.value} type="button"
                  onClick={() => setForm(f => ({ ...f, cognitiveLevel: opt.value }))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.cognitiveLevel === opt.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
              취소
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? '저장 중...' : isEdit ? '수정 완료' : '등록 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

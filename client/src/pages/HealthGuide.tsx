import React, { useEffect, useState } from 'react';
import { residentsApi, guidesApi, programsApi } from '../services/api';
import { Resident, HealthGuide } from '../types';

const guideTypeLabel: Record<string, string> = {
  DIET: '식이 가이드', EXERCISE: '운동 가이드', LIFESTYLE: '생활 가이드',
};
const guideTypeIcon: Record<string, string> = {
  DIET: '🍽️', EXERCISE: '🏃', LIFESTYLE: '🌅',
};
const guideTypeColor: Record<string, string> = {
  DIET: 'bg-green-50 border-green-100', EXERCISE: 'bg-blue-50 border-blue-100', LIFESTYLE: 'bg-purple-50 border-purple-100',
};
const priorityColor: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700', MEDIUM: 'bg-yellow-100 text-yellow-700', LOW: 'bg-green-100 text-green-700',
};

export default function HealthGuidePage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [guides, setGuides] = useState<HealthGuide[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<HealthGuide | null>(null);

  useEffect(() => {
    loadResidents();
  }, []);

  useEffect(() => {
    if (selectedResident) {
      loadGuides();
      loadRecommendations();
    }
  }, [selectedResident]);

  const loadResidents = async () => {
    try {
      const res = await residentsApi.list({ status: 'ACTIVE', limit: 100 });
      setResidents(res.data.data);
      if (res.data.data.length > 0) setSelectedResident(res.data.data[0].id);
    } catch {}
  };

  const loadGuides = async () => {
    setLoading(true);
    try {
      const res = await guidesApi.list(selectedResident);
      setGuides(res.data);
    } catch {}
    setLoading(false);
  };

  const loadRecommendations = async () => {
    try {
      const res = await programsApi.recommend(selectedResident);
      setRecommendations(res.data);
    } catch {}
  };

  const handleGenerate = async (type: string) => {
    setGenerating(true);
    try {
      await guidesApi.generate(selectedResident, type);
      loadGuides();
    } catch (err: any) {
      alert(err.response?.data?.message || '생성에 실패했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await guidesApi.delete(id);
      loadGuides();
      if (selectedGuide?.id === id) setSelectedGuide(null);
    } catch {}
  };

  const selectedResidentData = residents.find(r => r.id === selectedResident);

  return (
    <div className="space-y-5">
      {/* 입주자 선택 */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="label">입주자 선택</label>
              <select value={selectedResident} onChange={e => setSelectedResident(e.target.value)} className="input-field max-w-xs">
                {residents.map(r => <option key={r.id} value={r.id}>{r.name} ({r.roomNumber}호)</option>)}
              </select>
            </div>
            {selectedResidentData && (
              <div className="text-sm text-gray-500">
                <p>이동 능력: Lv.{selectedResidentData.mobilityLevel}</p>
                <p>인지 수준: {selectedResidentData.cognitiveLevel}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleGenerate('DIET')} disabled={generating || !selectedResident}
              className="btn-secondary text-sm flex items-center gap-1">
              🍽️ 식이 가이드 생성
            </button>
            <button onClick={() => handleGenerate('EXERCISE')} disabled={generating || !selectedResident}
              className="btn-secondary text-sm flex items-center gap-1">
              🏃 운동 가이드 생성
            </button>
            <button onClick={() => handleGenerate('LIFESTYLE')} disabled={generating || !selectedResident}
              className="btn-secondary text-sm flex items-center gap-1">
              🌅 생활 가이드 생성
            </button>
            <button onClick={() => handleGenerate('ALL')} disabled={generating || !selectedResident}
              className="btn-primary text-sm">
              {generating ? '생성 중...' : '전체 생성'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* 가이드 목록 */}
        <div className="col-span-1 space-y-3">
          <h3 className="font-semibold text-gray-900">생성된 가이드</h3>
          {loading ? (
            <div className="text-center py-8 text-gray-400">불러오는 중...</div>
          ) : guides.length === 0 ? (
            <div className="card text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm">생성된 가이드가 없습니다.</p>
            </div>
          ) : (
            guides.map(guide => (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className={`card cursor-pointer border transition-all hover:shadow-md ${guideTypeColor[guide.type]} ${selectedGuide?.id === guide.id ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{guideTypeIcon[guide.type]}</span>
                    <div>
                      <p className="font-medium text-sm">{guideTypeLabel[guide.type]}</p>
                      <p className="text-xs text-gray-500">{new Date(guide.generatedAt).toLocaleDateString('ko-KR')}</p>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(guide.id); }}
                    className="text-gray-300 hover:text-red-500 text-xs"
                  >✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 가이드 상세 */}
        <div className="col-span-2">
          {selectedGuide ? (
            <GuideDetail guide={selectedGuide} />
          ) : (
            <div className="card text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">👈</p>
              <p>가이드를 선택하면 상세 내용이 표시됩니다.</p>
            </div>
          )}

          {/* 프로그램 추천 */}
          {recommendations.length > 0 && (
            <div className="card mt-5">
              <h3 className="font-semibold mb-4">🎯 추천 프로그램</h3>
              <div className="space-y-3">
                {recommendations.map((rec: any) => (
                  <div key={rec.programId} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center font-bold text-blue-700">
                      {Math.round(rec.score)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{rec.program?.name}</p>
                      <p className="text-xs text-gray-500">{rec.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{rec.program?.instructor}</p>
                      <p className="text-xs text-blue-600">{rec.program?.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GuideDetail({ guide }: { guide: HealthGuide }) {
  const content = guide.parsedContent;
  if (!content) return <div className="card text-gray-400">가이드 내용을 불러올 수 없습니다.</div>;

  return (
    <div className={`card border ${guideTypeColor[guide.type]}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{guideTypeIcon[guide.type]}</span>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{content.title}</h3>
          <p className="text-sm text-gray-600">{content.summary}</p>
        </div>
      </div>

      {/* 권고사항 */}
      {content.recommendations?.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">권고사항</h4>
          <div className="space-y-2">
            {content.recommendations.map((r: any, i: number) => (
              <div key={i} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <span className={`badge flex-shrink-0 ${priorityColor[r.priority]}`}>
                  {r.priority === 'HIGH' ? '높음' : r.priority === 'MEDIUM' ? '중간' : '낮음'}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.category}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 권장/주의 음식 or 운동 */}
      <div className="grid grid-cols-2 gap-4">
        {content.recommendFoods && (
          <div>
            <h4 className="font-semibold text-sm text-green-700 mb-2">✅ 권장 식품</h4>
            <div className="flex flex-wrap gap-1">
              {content.recommendFoods.map((f: string, i: number) => (
                <span key={i} className="badge badge-green">{f}</span>
              ))}
            </div>
          </div>
        )}
        {content.avoidFoods && (
          <div>
            <h4 className="font-semibold text-sm text-red-700 mb-2">❌ 주의 식품</h4>
            <div className="flex flex-wrap gap-1">
              {content.avoidFoods.map((f: string, i: number) => (
                <span key={i} className="badge badge-red">{f}</span>
              ))}
            </div>
          </div>
        )}
        {content.recommendExercises && (
          <div>
            <h4 className="font-semibold text-sm text-green-700 mb-2">✅ 권장 운동</h4>
            <div className="flex flex-wrap gap-1">
              {content.recommendExercises.map((f: string, i: number) => (
                <span key={i} className="badge badge-green">{f}</span>
              ))}
            </div>
          </div>
        )}
        {content.avoidExercises && (
          <div>
            <h4 className="font-semibold text-sm text-red-700 mb-2">❌ 주의 운동</h4>
            <div className="flex flex-wrap gap-1">
              {content.avoidExercises.map((f: string, i: number) => (
                <span key={i} className="badge badge-red">{f}</span>
              ))}
            </div>
          </div>
        )}
        {content.schedule && (
          <div className="col-span-2">
            <h4 className="font-semibold text-sm text-blue-700 mb-1">운동 일정</h4>
            <p className="text-sm text-gray-700 bg-blue-50 px-3 py-2 rounded-lg">{content.schedule}</p>
          </div>
        )}
      </div>

      {/* 일상 루틴 */}
      {content.dailyRoutine && (
        <div className="mt-4">
          <h4 className="font-semibold text-sm text-purple-700 mb-2">권장 일일 루틴</h4>
          <div className="grid grid-cols-2 gap-1">
            {content.dailyRoutine.map((r: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-white p-2 rounded border border-gray-100">
                <span className="text-purple-400">•</span> {r}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


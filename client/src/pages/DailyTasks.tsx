import React, { useState, useEffect, useCallback } from 'react';
import { dailyTasksApi } from '../services/api';

interface Recommendation {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  roomNumber?: string;
  residentName?: string;
  resolved: boolean;
}

const CATEGORY_CONFIG: Record<string, { icon: string; label: string; bgColor: string; textColor: string; borderColor: string; headerBg: string }> = {
  FALL_RESPONSE: { icon: '🚨', label: '낙상 대응', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', headerBg: 'bg-red-100' },
  HEALTH_ALERT: { icon: '⚠️', label: '건강 이상', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', headerBg: 'bg-orange-100' },
  HEALTH_CHECK: { icon: '💊', label: '건강 체크', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', headerBg: 'bg-blue-100' },
  MEDICATION: { icon: '💉', label: '투약 확인', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200', headerBg: 'bg-purple-100' },
  SAFETY: { icon: '🔧', label: '안전점검', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200', headerBg: 'bg-yellow-100' },
  ACTIVITY: { icon: '🎯', label: '프로그램', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', headerBg: 'bg-green-100' },
};

const PRIORITY_CONFIG: Record<string, { label: string; bgColor: string; textColor: string }> = {
  HIGH: { label: '긴급', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  MEDIUM: { label: '보통', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
  LOW: { label: '낮음', bgColor: 'bg-green-100', textColor: 'text-green-700' },
};

const CATEGORY_ORDER = ['FALL_RESPONSE', 'HEALTH_ALERT', 'HEALTH_CHECK', 'MEDICATION', 'SAFETY', 'ACTIVITY'];

export default function DailyTasks() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<Record<string, boolean>>({});
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await dailyTasksApi.recommendations();
      const data: Recommendation[] = res.data;
      setRecommendations(data);

      // HIGH priority categories expanded by default, others collapsed
      const grouped = data.reduce<Record<string, Recommendation[]>>((acc, rec) => {
        if (!acc[rec.category]) acc[rec.category] = [];
        acc[rec.category].push(rec);
        return acc;
      }, {});

      const initialCollapsed: Record<string, boolean> = {};
      Object.entries(grouped).forEach(([category, items]) => {
        const hasHigh = items.some(item => item.priority === 'HIGH');
        initialCollapsed[category] = !hasHigh;
      });
      setCollapsedCategories(initialCollapsed);
    } catch (err) {
      console.error('추천 업무 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRecommendations();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchRecommendations]);

  const handleComplete = useCallback(async (rec: Recommendation) => {
    if (rec.resolved || completing[rec.id]) return;
    try {
      setCompleting(prev => ({ ...prev, [rec.id]: true }));
      const createRes = await dailyTasksApi.create({
        title: rec.title,
        description: rec.description || '',
        category: rec.category,
        dueDate: new Date().toISOString().slice(0, 10),
      });
      const taskId = createRes.data.id;
      await dailyTasksApi.complete(taskId);
      setRecommendations(prev =>
        prev.map(r => (r.id === rec.id ? { ...r, resolved: true } : r))
      );
    } catch (err) {
      console.error('업무 완료 처리 실패:', err);
    } finally {
      setCompleting(prev => ({ ...prev, [rec.id]: false }));
    }
  }, [completing]);

  const toggleCategory = useCallback((category: string) => {
    setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  }, []);

  // Summary calculations
  const totalCount = recommendations.length;
  const completedCount = recommendations.filter(r => r.resolved).length;
  const pendingCount = totalCount - completedCount;
  const urgentCount = recommendations.filter(r => r.priority === 'HIGH' && !r.resolved).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group by category
  const grouped = recommendations.reduce<Record<string, Recommendation[]>>((acc, rec) => {
    if (!acc[rec.category]) acc[rec.category] = [];
    acc[rec.category].push(rec);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">일일 업무 추천</h1>
        <p className="text-sm text-gray-500 mt-1">시스템이 자동으로 분석한 오늘의 업무입니다</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">총 추천 업무</p>
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4">
          <p className="text-xs font-medium text-green-600 mb-1">완료</p>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">미완료</p>
          <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4">
          <p className="text-xs font-medium text-red-600 mb-1">긴급</p>
          <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">전체 진행률</span>
          <span className="text-sm font-bold text-blue-600">
            {completedCount}/{totalCount} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">불러오는 중...</div>
      ) : totalCount === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-4xl mb-4">🎉</p>
          <p className="text-lg font-semibold text-gray-700">모든 업무가 정상입니다!</p>
          <p className="text-sm text-gray-400 mt-1">현재 추천할 업무가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {CATEGORY_ORDER.filter(cat => grouped[cat] && grouped[cat].length > 0).map(category => {
            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.HEALTH_CHECK;
            const items = grouped[category];
            const isCollapsed = collapsedCategories[category] ?? false;
            const catCompleted = items.filter(r => r.resolved).length;

            return (
              <div key={category} className={`rounded-xl border ${config.borderColor} overflow-hidden`}>
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 ${config.headerBg} hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{config.icon}</span>
                    <span className={`font-semibold ${config.textColor}`}>{config.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
                      {catCompleted}/{items.length}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 ${config.textColor} transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Category Items */}
                {!isCollapsed && (
                  <div className={`${config.bgColor} divide-y ${config.borderColor}`}>
                    {items.map(rec => {
                      const priorityCfg = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.MEDIUM;
                      const isCompleting = completing[rec.id] ?? false;

                      return (
                        <div
                          key={rec.id}
                          className={`px-5 py-4 flex items-start gap-4 ${rec.resolved ? 'opacity-60' : ''}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityCfg.bgColor} ${priorityCfg.textColor}`}>
                                {priorityCfg.label}
                              </span>
                              {rec.roomNumber && (
                                <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                  {rec.roomNumber}호
                                </span>
                              )}
                              {rec.residentName && (
                                <span className="text-xs text-gray-600 font-medium">
                                  {rec.residentName}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm font-medium ${rec.resolved ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {rec.title}
                            </p>
                            {rec.description && (
                              <p className={`text-xs mt-0.5 ${rec.resolved ? 'line-through text-gray-300' : 'text-gray-500'}`}>
                                {rec.description}
                              </p>
                            )}
                          </div>

                          <div className="flex-shrink-0">
                            {rec.resolved ? (
                              <div className="flex items-center gap-1.5 text-green-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs font-medium">완료</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleComplete(rec)}
                                disabled={isCompleting}
                                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {isCompleting ? '처리 중...' : '완료'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

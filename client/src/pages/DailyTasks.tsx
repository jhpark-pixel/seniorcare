import React, { useState, useEffect } from 'react';
import { dailyTasksApi } from '../services/api';
import { DailyTask } from '../types';

const CATEGORIES: Record<string, { label: string; color: string; bg: string }> = {
  GENERAL: { label: '일반', color: 'text-gray-700', bg: 'bg-gray-100' },
  HEALTH_CHECK: { label: '건강체크', color: 'text-blue-700', bg: 'bg-blue-100' },
  MEDICATION: { label: '투약', color: 'text-purple-700', bg: 'bg-purple-100' },
  CLEANING: { label: '청소', color: 'text-green-700', bg: 'bg-green-100' },
  MEAL: { label: '식사', color: 'text-orange-700', bg: 'bg-orange-100' },
  ACTIVITY: { label: '활동', color: 'text-pink-700', bg: 'bg-pink-100' },
  SAFETY: { label: '안전점검', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function DailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'GENERAL', assignedTo: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await dailyTasksApi.list(date);
      setTasks(res.data);
    } catch (err) {
      console.error('업무 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [date]);

  const handleToggle = async (task: DailyTask) => {
    try {
      if (task.status === 'PENDING') {
        await dailyTasksApi.complete(task.id);
      } else {
        await dailyTasksApi.reopen(task.id);
      }
      fetchTasks();
    } catch (err) {
      console.error('업무 상태 변경 실패:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 업무를 삭제하시겠습니까?')) return;
    try {
      await dailyTasksApi.delete(id);
      fetchTasks();
    } catch (err) {
      console.error('업무 삭제 실패:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      setSubmitting(true);
      await dailyTasksApi.create({ ...form, dueDate: date });
      setForm({ title: '', description: '', category: 'GENERAL', assignedTo: '' });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error('업무 추가 실패:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group tasks by category
  const grouped = tasks.reduce<Record<string, DailyTask[]>>((acc, task) => {
    const cat = task.category || 'GENERAL';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">일일 업무</h1>
          <p className="text-sm text-gray-500 mt-1">일일 업무 체크리스트를 관리합니다</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {showForm ? '취소' : '새 업무 추가'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">진행률</span>
          <span className="text-sm font-bold text-blue-600">{completedCount}/{totalCount} ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">새 업무 추가</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="업무 제목을 입력하세요"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="상세 설명 (선택)"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                <input
                  type="text"
                  value={form.assignedTo}
                  onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                  placeholder="담당자 이름 (선택)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? '추가 중...' : '업무 추가'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">불러오는 중...</div>
      ) : totalCount === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-400 text-lg mb-1">등록된 업무가 없습니다</p>
          <p className="text-gray-400 text-sm">새 업무를 추가해 주세요</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, categoryTasks]) => {
            const cat = CATEGORIES[category] || CATEGORIES.GENERAL;
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cat.color} ${cat.bg}`}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {categoryTasks.filter(t => t.status === 'COMPLETED').length}/{categoryTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {categoryTasks.map(task => (
                    <div
                      key={task.id}
                      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-start gap-3 transition-colors ${
                        task.status === 'COMPLETED' ? 'opacity-70' : ''
                      }`}
                    >
                      <button
                        onClick={() => handleToggle(task)}
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          task.status === 'COMPLETED'
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {task.status === 'COMPLETED' && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className={`text-xs mt-0.5 ${task.status === 'COMPLETED' ? 'line-through text-gray-300' : 'text-gray-500'}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${cat.bg} ${cat.color}`}>{cat.label}</span>
                          {task.assignedTo && (
                            <span className="text-xs text-gray-400">담당: {task.assignedTo}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="삭제"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

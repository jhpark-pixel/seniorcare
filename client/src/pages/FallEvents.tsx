import React, { useEffect, useState } from 'react';
import { fallEventsApi } from '../services/api';
import { FallEvent } from '../types';
import { useSocketContext } from '../App';

export default function FallEvents() {
  const { fallNotifications } = useSocketContext();
  const [events, setEvents] = useState<FallEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<FallEvent | null>(null);
  const [responseForm, setResponseForm] = useState({ content: '', outcome: 'NO_INJURY' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [statusFilter, severityFilter, page, fallNotifications.length]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fallEventsApi.list({
        status: statusFilter || undefined,
        severity: severityFilter || undefined,
        page, limit: 15,
      });
      setEvents(res.data.data);
      setTotal(res.data.total);
    } catch {}
    setLoading(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await fallEventsApi.markAllRead();
      loadEvents();
    } catch {}
  };

  const handleResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setSaving(true);
    try {
      await fallEventsApi.addResponse(selectedEvent.id, responseForm);
      setSelectedEvent(null);
      setResponseForm({ content: '', outcome: 'NO_INJURY' });
      loadEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fallEventsApi.updateStatus(id, status);
      loadEvents();
    } catch {}
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-5">
      {/* 필터 */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex gap-3 flex-1">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-32">
              <option value="">전체 상태</option>
              <option value="UNHANDLED">미처리</option>
              <option value="HANDLING">처리중</option>
              <option value="RESOLVED">완료</option>
            </select>
            <select value={severityFilter} onChange={e => { setSeverityFilter(e.target.value); setPage(1); }} className="input-field w-32">
              <option value="">전체 심각도</option>
              <option value="CRITICAL">위급</option>
              <option value="WARNING">주의</option>
            </select>
          </div>
          <button onClick={handleMarkAllRead} className="btn-secondary text-sm">
            전체 읽음 처리
          </button>
          <div className="text-sm text-gray-500">총 {total}건</div>
        </div>
      </div>

      {/* 이벤트 목록 */}
      <div className="space-y-3">
        {loading ? (
          <div className="card text-center py-8 text-gray-400">불러오는 중...</div>
        ) : events.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-gray-500">낙상 이벤트가 없습니다.</p>
          </div>
        ) : (
          events.map(event => (
            <div
              key={event.id}
              className={`card border-l-4 ${
                event.severity === 'CRITICAL' ? 'border-l-red-500' : 'border-l-yellow-500'
              } ${!event.isRead ? 'ring-2 ring-blue-100' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  event.severity === 'CRITICAL' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {event.severity === 'CRITICAL' ? '🚨' : '⚠️'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {event.resident?.name} ({event.resident?.roomNumber}호)
                    </h3>
                    <span className={`badge ${event.severity === 'CRITICAL' ? 'badge-red' : 'badge-yellow'}`}>
                      {event.severity === 'CRITICAL' ? '위급' : '주의'}
                    </span>
                    <span className={`badge ${
                      event.status === 'UNHANDLED' ? 'badge-red' :
                      event.status === 'HANDLING' ? 'badge-yellow' : 'badge-green'
                    }`}>
                      {event.status === 'UNHANDLED' ? '미처리' : event.status === 'HANDLING' ? '처리중' : '완료'}
                    </span>
                    {!event.isRead && <span className="badge badge-blue">NEW</span>}
                  </div>

                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>📍 {event.location || '위치 미상'}</span>
                    <span>🕐 {new Date(event.occurredAt).toLocaleString('ko-KR')}</span>
                    {event.device && <span>📡 {event.device.deviceCode}</span>}
                  </div>

                  {/* 처리 응답 내역 */}
                  {event.responses && event.responses.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {event.responses.map(r => (
                        <div key={r.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                          <p className="text-gray-700">{r.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            처리자: {r.respondedBy} · {new Date(r.respondedAt).toLocaleString('ko-KR')} ·
                            결과: {r.outcome === 'NO_INJURY' ? '외상 없음' : r.outcome === 'MINOR_INJURY' ? '경미한 부상' : '병원 이송'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {event.status === 'UNHANDLED' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(event.id, 'HANDLING')}
                        className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg hover:bg-yellow-200"
                      >
                        처리중
                      </button>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                      >
                        처리 완료
                      </button>
                    </>
                  )}
                  {event.status === 'HANDLING' && (
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                    >
                      처리 완료
                    </button>
                  )}
                  {event.status === 'RESOLVED' && (
                    <span className="text-xs text-green-600 px-2">처리완료 ✓</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-gray-100">← 이전</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-3 py-1 rounded text-sm ${page === p ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-gray-100">다음 →</button>
        </div>
      )}

      {/* 처리 완료 모달 */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md fade-in">
            <h3 className="font-bold text-lg mb-4">낙상 처리 기록</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedEvent.resident?.name}({selectedEvent.resident?.roomNumber}호) ·
              {new Date(selectedEvent.occurredAt).toLocaleString('ko-KR')}
            </p>
            <form onSubmit={handleResponse} className="space-y-4">
              <div>
                <label className="label">처리 내용 *</label>
                <textarea
                  required
                  value={responseForm.content}
                  onChange={e => setResponseForm(f => ({ ...f, content: e.target.value }))}
                  className="input-field h-24 resize-none"
                  placeholder="사고 경위, 처치 내용, 현재 상태 등을 기록해주세요..."
                />
              </div>
              <div>
                <label className="label">처리 결과 *</label>
                <select
                  value={responseForm.outcome}
                  onChange={e => setResponseForm(f => ({ ...f, outcome: e.target.value }))}
                  className="input-field"
                >
                  <option value="NO_INJURY">외상 없음</option>
                  <option value="MINOR_INJURY">경미한 부상</option>
                  <option value="HOSPITAL_TRANSFER">병원 이송</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setSelectedEvent(null)} className="btn-secondary flex-1">취소</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? '저장 중...' : '처리 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

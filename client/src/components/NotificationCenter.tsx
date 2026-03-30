import React, { useState } from 'react';
import { useSocketContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { fallEventsApi } from '../services/api';

export default function NotificationCenter() {
  const { fallNotifications, clearNotification, clearAllNotifications } = useSocketContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = fallNotifications.length;

  const handleMarkAllRead = async () => {
    try {
      await fallEventsApi.markAllRead();
      clearAllNotifications();
    } catch {}
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pulse-ring">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 fade-in">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900">낙상 알림</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  전체 읽음
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {fallNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm">새로운 알림이 없습니다.</p>
              </div>
            ) : (
              fallNotifications.map((notif, index) => (
                <div
                  key={index}
                  className={`p-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 ${
                    notif.event?.severity === 'CRITICAL' ? 'bg-red-50' : 'bg-yellow-50'
                  }`}
                  onClick={() => {
                    navigate('/fall-events');
                    setIsOpen(false);
                    clearNotification(index);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {notif.event?.severity === 'CRITICAL' ? '🚨' : '⚠️'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notif.message || '낙상 감지'}
                      </p>
                      {notif.event && (
                        <>
                          <p className="text-xs text-gray-500 mt-1">
                            위치: {notif.event.location || '미상'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(notif.event.occurredAt).toLocaleString('ko-KR')}
                          </p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(index);
                      }}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t bg-gray-50 rounded-b-xl">
            <button
              onClick={() => { navigate('/fall-events'); setIsOpen(false); }}
              className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              낙상 이벤트 전체 보기 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

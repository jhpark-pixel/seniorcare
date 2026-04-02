import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type MockRoom } from '../../data/mockData';
import { useRooms, useCollection } from '../../context/AppStateContext';

type RoomStatus = '사용중' | '빈방' | '수리중';

interface RoomState extends MockRoom {}

const statusConfig: Record<RoomStatus, { bg: string; border: string; text: string; dot: string }> = {
  '사용중': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', dot: 'bg-blue-500' },
  '빈방': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', dot: 'bg-gray-400' },
  '수리중': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
};

function countByStatus(roomList: RoomState[]) {
  const counts: Record<RoomStatus, number> = { '사용중': 0, '빈방': 0, '수리중': 0 };
  roomList.forEach(r => counts[r.status as RoomStatus]++);
  return counts;
}

interface AssignForm {
  roomId: string;
  residentName: string;
}

interface InspectionRecord {
  id: string;
  roomId: string;
  room: string;
  date: string;
  inspector: string;
  result: '이상없음' | '경미한결함' | '수리필요';
  note: string;
}

const initialInspections: InspectionRecord[] = [
  { id: '1', roomId: '', room: '2층 201호', date: '2026-03-25', inspector: '김서연', result: '이상없음', note: '정기 점검' },
  { id: '2', roomId: '', room: '3층 307호', date: '2026-03-28', inspector: '이하은', result: '수리필요', note: '온수 배관 누수 발견' },
  { id: '3', roomId: '', room: '2층 203호', date: '2026-03-27', inspector: '김서연', result: '경미한결함', note: '에어컨 필터 교체 필요' },
  { id: '4', roomId: '', room: '4층 410호', date: '2026-03-20', inspector: '이하은', result: '이상없음', note: '정기 점검' },
  { id: '5', roomId: '', room: '3층 305호', date: '2026-03-22', inspector: '김서연', result: '경미한결함', note: '창문 잠금장치 헐거움' },
];

const inspectionColors: Record<string, string> = {
  '이상없음': 'bg-green-100 text-green-800',
  '경미한결함': 'bg-yellow-100 text-yellow-800',
  '수리필요': 'bg-red-100 text-red-800',
};

const tabs = [
  { id: 'status', label: '동/호실 현황', path: '/facility/room/status' },
  { id: 'assign', label: '호실배정 관리', path: '/facility/room/assign' },
  { id: 'inspection', label: '호실점검 이력', path: '/facility/room/inspection' },
];

export default function RoomStatusPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [rooms, setRooms] = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<RoomState | null>(null);
  const [newStatus, setNewStatus] = useState<RoomStatus>('사용중');
  const [assignForm, setAssignForm] = useState<AssignForm>({ roomId: '', residentName: '' });
  const [inspections] = useCollection<InspectionRecord>('inspections', initialInspections);

  const floor2 = rooms.filter(r => r.floor === 2);
  const floor3 = rooms.filter(r => r.floor === 3);
  const floor4 = rooms.filter(r => r.floor === 4);
  const total = rooms.length;
  const counts = countByStatus(rooms);

  const emptyRooms = rooms.filter(r => r.status === '빈방');

  const openDetail = (room: RoomState) => {
    setSelectedRoom(room);
    setNewStatus(room.status as RoomStatus);
  };

  const handleStatusChange = () => {
    if (!selectedRoom) return;
    setRooms(prev => prev.map(r => {
      if (r.id !== selectedRoom.id) return r;
      const updatedResident = newStatus === '빈방' || newStatus === '수리중' ? undefined : r.residentName;
      return { ...r, status: newStatus, residentName: updatedResident };
    }));
    setSelectedRoom(null);
  };

  const handleAssign = () => {
    if (!assignForm.roomId || !assignForm.residentName) return;
    setRooms(prev => prev.map(r =>
      r.id === assignForm.roomId
        ? { ...r, status: '사용중' as RoomStatus, residentName: assignForm.residentName }
        : r
    ));
    setAssignForm({ roomId: '', residentName: '' });
  };

  function RoomGrid({ title, roomList }: { title: string; roomList: RoomState[] }) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {roomList.map(room => {
            const status = room.status as RoomStatus;
            const cfg = statusConfig[status];
            return (
              <div
                key={room.id}
                onClick={() => openDetail(room)}
                className={`p-3 rounded-lg border ${cfg.bg} ${cfg.border} text-center transition-transform hover:scale-105 cursor-pointer`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                  <span className="text-sm font-bold text-gray-900">{room.roomNumber}호</span>
                </div>
                {room.residentName ? (
                  <p className="text-xs font-medium text-gray-700 truncate">{room.residentName}</p>
                ) : (
                  <p className={`text-xs font-medium ${cfg.text}`}>{room.status}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">{room.type}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">동/호실 현황</h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* status: 동/호실 현황 그리드 */}
      {segment === 'status' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">총 호실</p>
              <p className="text-3xl font-bold text-gray-900">{total}<span className="text-base font-normal text-gray-500">실</span></p>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
              <p className="text-sm text-blue-600">사용중</p>
              <p className="text-3xl font-bold text-blue-700">{counts['사용중']}<span className="text-base font-normal text-blue-500">실</span></p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">빈방</p>
              <p className="text-3xl font-bold text-gray-600">{counts['빈방']}<span className="text-base font-normal text-gray-400">실</span></p>
            </div>
            <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 text-center">
              <p className="text-sm text-orange-600">수리중</p>
              <p className="text-3xl font-bold text-orange-700">{counts['수리중']}<span className="text-base font-normal text-orange-500">실</span></p>
            </div>
          </div>
          <div className="space-y-6">
            <RoomGrid title="2층 (12실)" roomList={floor2} />
            <RoomGrid title="3층 (9실)" roomList={floor3} />
            <RoomGrid title="4층 (12실)" roomList={floor4} />
          </div>
        </div>
      )}

      {/* assign: 호실배정 관리 */}
      {segment === 'assign' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">신규 호실 배정</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">빈방 선택</label>
                <select
                  value={assignForm.roomId}
                  onChange={e => setAssignForm({ ...assignForm, roomId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="">-- 호실 선택 --</option>
                  {emptyRooms.map(r => (
                    <option key={r.id} value={r.id}>{r.building} {r.roomNumber}호 ({r.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <input
                  type="text"
                  value={assignForm.residentName}
                  onChange={e => setAssignForm({ ...assignForm, residentName: e.target.value })}
                  placeholder="입소자 이름 입력"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAssign}
                  className="w-full px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#d9714d]"
                >
                  배정 처리
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">현재 배정 현황</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">건물</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">호실</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">유형</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">입소자</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => {
                    const status = room.status as RoomStatus;
                    const cfg = statusConfig[status];
                    return (
                      <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{room.building}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{room.roomNumber}호</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{room.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{room.residentName || '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${cfg.bg} ${cfg.text}`}>{room.status}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => openDetail(room)}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            상태변경
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* inspection: 호실점검 이력 */}
      {segment === 'inspection' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-600">이상없음</p>
              <p className="text-3xl font-bold text-green-700">{inspections.filter(i => i.result === '이상없음').length}<span className="text-base font-normal">건</span></p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-sm text-yellow-600">경미한결함</p>
              <p className="text-3xl font-bold text-yellow-700">{inspections.filter(i => i.result === '경미한결함').length}<span className="text-base font-normal">건</span></p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm text-red-600">수리필요</p>
              <p className="text-3xl font-bold text-red-700">{inspections.filter(i => i.result === '수리필요').length}<span className="text-base font-normal">건</span></p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">점검 이력</h2>
              <button className="px-3 py-1.5 bg-[#F0835A] text-white rounded-lg text-xs font-medium hover:bg-[#d9714d]">+ 점검 등록</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">점검일</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">호실</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">점검자</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">결과</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map(rec => (
                    <tr key={rec.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{rec.room}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{rec.inspector}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${inspectionColors[rec.result]}`}>{rec.result}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Status change modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {selectedRoom.building} {selectedRoom.roomNumber}호 상세
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">유형</span>
                <span className="font-medium text-gray-700">{selectedRoom.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">현재 상태</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusConfig[selectedRoom.status as RoomStatus].bg} ${statusConfig[selectedRoom.status as RoomStatus].text}`}>
                  {selectedRoom.status}
                </span>
              </div>
              {selectedRoom.residentName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">입소자</span>
                  <span className="font-medium text-gray-900">{selectedRoom.residentName}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태 변경</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as RoomStatus)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>사용중</option>
                  <option>빈방</option>
                  <option>수리중</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedRoom(null)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleStatusChange} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

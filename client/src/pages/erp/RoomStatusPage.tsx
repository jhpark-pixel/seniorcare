import React, { useState } from 'react';

interface Room {
  id: string;
  building: string;
  number: string;
  resident: string | null;
  status: '사용중' | '빈방' | '수리중';
}

const makeRooms = (building: string, rooms: { number: string; resident: string | null; status: '사용중' | '빈방' | '수리중' }[]): Room[] =>
  rooms.map(r => ({ id: `${building}-${r.number}`, building, ...r }));

const initialBuilding1: Room[] = makeRooms('1관', [
  { number: '101', resident: '김영숙', status: '사용중' },
  { number: '102', resident: '강순옥', status: '사용중' },
  { number: '103', resident: '이말순', status: '사용중' },
  { number: '104', resident: null, status: '빈방' },
  { number: '105', resident: '박정희', status: '사용중' },
  { number: '106', resident: '홍길자', status: '사용중' },
  { number: '201', resident: '정복순', status: '사용중' },
  { number: '202', resident: '오영자', status: '사용중' },
  { number: '203', resident: '이순자', status: '사용중' },
  { number: '204', resident: null, status: '수리중' },
  { number: '205', resident: '배옥희', status: '사용중' },
  { number: '206', resident: null, status: '빈방' },
  { number: '301', resident: '장명숙', status: '사용중' },
  { number: '302', resident: '최옥순', status: '사용중' },
  { number: '303', resident: '신정옥', status: '사용중' },
  { number: '304', resident: '서영희', status: '사용중' },
  { number: '305', resident: null, status: '빈방' },
  { number: '306', resident: '임복자', status: '사용중' },
]);

const initialBuilding2: Room[] = makeRooms('2관', [
  { number: '101', resident: '한미경', status: '사용중' },
  { number: '102', resident: '조순희', status: '사용중' },
  { number: '103', resident: null, status: '빈방' },
  { number: '104', resident: '유정숙', status: '사용중' },
  { number: '105', resident: '송말자', status: '사용중' },
  { number: '106', resident: '권옥자', status: '사용중' },
  { number: '201', resident: '문정순', status: '사용중' },
  { number: '202', resident: null, status: '수리중' },
  { number: '203', resident: '양순자', status: '사용중' },
  { number: '204', resident: '구정임', status: '사용중' },
  { number: '205', resident: '안영숙', status: '사용중' },
  { number: '206', resident: null, status: '빈방' },
  { number: '301', resident: '황복순', status: '사용중' },
  { number: '302', resident: '전옥희', status: '사용중' },
  { number: '303', resident: '노정자', status: '사용중' },
  { number: '304', resident: null, status: '빈방' },
  { number: '305', resident: '백순옥', status: '사용중' },
  { number: '306', resident: '차영자', status: '사용중' },
]);

const statusConfig: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  '사용중': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', dot: 'bg-blue-500' },
  '빈방': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', dot: 'bg-gray-400' },
  '수리중': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
};

function countByStatus(rooms: Room[]) {
  const counts = { '사용중': 0, '빈방': 0, '수리중': 0 };
  rooms.forEach(r => counts[r.status]++);
  return counts;
}

export default function RoomStatusPage() {
  const [rooms, setRooms] = useState<Room[]>([...initialBuilding1, ...initialBuilding2]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newStatus, setNewStatus] = useState<Room['status']>('사용중');

  const building1 = rooms.filter(r => r.building === '1관');
  const building2 = rooms.filter(r => r.building === '2관');
  const allRooms = rooms;
  const total = allRooms.length;
  const counts = countByStatus(allRooms);

  const openDetail = (room: Room) => {
    setSelectedRoom(room);
    setNewStatus(room.status);
  };

  const handleStatusChange = () => {
    if (!selectedRoom) return;
    setRooms(prev => prev.map(r => {
      if (r.id !== selectedRoom.id) return r;
      const updatedResident = newStatus === '빈방' || newStatus === '수리중' ? null : r.resident;
      return { ...r, status: newStatus, resident: updatedResident };
    }));
    setSelectedRoom(null);
  };

  function RoomGrid({ title, roomList }: { title: string; roomList: Room[] }) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {roomList.map(room => {
            const cfg = statusConfig[room.status];
            return (
              <div
                key={room.id}
                onClick={() => openDetail(room)}
                className={`p-3 rounded-lg border ${cfg.bg} ${cfg.border} text-center transition-transform hover:scale-105 cursor-pointer`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                  <span className="text-sm font-bold text-gray-900">{room.number}호</span>
                </div>
                {room.resident ? (
                  <p className="text-xs font-medium text-gray-700 truncate">{room.resident}</p>
                ) : (
                  <p className={`text-xs font-medium ${cfg.text}`}>{room.status}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">동/호실 현황</h1>

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
        <RoomGrid title="1관 (본관)" roomList={building1} />
        <RoomGrid title="2관 (별관)" roomList={building2} />
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {selectedRoom.building} {selectedRoom.number}호 상세
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">현재 상태</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusConfig[selectedRoom.status].bg} ${statusConfig[selectedRoom.status].text}`}>
                  {selectedRoom.status}
                </span>
              </div>
              {selectedRoom.resident && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">입소자</span>
                  <span className="font-medium text-gray-900">{selectedRoom.resident}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태 변경</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as Room['status'])} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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

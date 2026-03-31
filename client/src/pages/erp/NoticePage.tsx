import React, { useState } from 'react';

interface Notice {
  id: string;
  title: string;
  category: '일반' | '행사' | '건강' | '시설';
  author: string;
  date: string;
  views: number;
  pinned: boolean;
}

const notices: Notice[] = [
  { id: '1', title: '2026년 4월 시설 운영 안내 및 면회 시간 변경 공지', category: '일반', author: '김시설장', date: '2026-03-28', views: 142, pinned: true },
  { id: '2', title: '봄맞이 야외 나들이 행사 참가 신청 안내', category: '행사', author: '최생활지도사', date: '2026-03-27', views: 98 , pinned: false },
  { id: '3', title: '인플루엔자 예방접종 일정 안내 (4/5 ~ 4/7)', category: '건강', author: '이간호사', date: '2026-03-26', views: 87, pinned: false },
  { id: '4', title: '2관 엘리베이터 정기 점검 안내 (4/3)', category: '시설', author: '박관리과장', date: '2026-03-25', views: 65, pinned: false },
  { id: '5', title: '4월 어르신 생신잔치 안내', category: '행사', author: '최생활지도사', date: '2026-03-24', views: 73, pinned: false },
  { id: '6', title: '낙상 예방 교육 실시 안내', category: '건강', author: '김간호사', date: '2026-03-23', views: 56, pinned: false },
  { id: '7', title: '주간 식단표 변경 안내 (3/31~4/6)', category: '일반', author: '정영양사', date: '2026-03-22', views: 48, pinned: false },
  { id: '8', title: '1관 3층 화장실 수리 완료 안내', category: '시설', author: '박관리과장', date: '2026-03-21', views: 34, pinned: false },
  { id: '9', title: '치매 가족 상담 프로그램 운영 안내', category: '건강', author: '최생활지도사', date: '2026-03-20', views: 41, pinned: false },
  { id: '10', title: '시설 내 개인물품 보관 규정 안내', category: '일반', author: '김시설장', date: '2026-03-19', views: 29, pinned: false },
];

const categoryColors: Record<string, string> = {
  '일반': 'bg-gray-100 text-gray-800',
  '행사': 'bg-purple-100 text-purple-800',
  '건강': 'bg-green-100 text-green-800',
  '시설': 'bg-orange-100 text-orange-800',
};

const categories = ['전체', '일반', '행사', '건강', '시설'];

export default function NoticePage() {
  const [activeCategory, setActiveCategory] = useState('전체');

  const filtered = activeCategory === '전체'
    ? notices
    : notices.filter(n => n.category === activeCategory);

  const pinned = filtered.filter(n => n.pinned);
  const regular = filtered.filter(n => !n.pinned);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">공지사항</h1>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pinned Notice */}
      {pinned.map(notice => (
        <div key={notice.id} className="mb-4 p-5 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">중요</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${categoryColors[notice.category]}`}>
              {notice.category}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h2>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>작성자: {notice.author}</span>
            <span>작성일: {notice.date}</span>
            <span>조회수: {notice.views}</span>
          </div>
        </div>
      ))}

      {/* Notice List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-sm font-medium text-gray-600 w-20">번호</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-gray-600 w-24">카테고리</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">제목</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-gray-600 w-28">작성자</th>
              <th className="text-left px-5 py-3 text-sm font-medium text-gray-600 w-28">작성일</th>
              <th className="text-right px-5 py-3 text-sm font-medium text-gray-600 w-20">조회수</th>
            </tr>
          </thead>
          <tbody>
            {regular.map((notice, idx) => (
              <tr key={notice.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-5 py-3 text-sm text-gray-500">{idx + 1}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${categoryColors[notice.category]}`}>
                    {notice.category}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-900 font-medium">{notice.title}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{notice.author}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{notice.date}</td>
                <td className="px-5 py-3 text-sm text-gray-500 text-right">{notice.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

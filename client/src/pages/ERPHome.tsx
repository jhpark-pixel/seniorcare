import React from 'react';

interface WidgetProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

function Widget({ title, icon, children, className = '' }: WidgetProps) {
  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        <button className="text-xs text-[#F0835A] hover:underline font-medium">더보기</button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function MiniTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h, i) => (
            <th key={i} className="px-2 py-1.5 text-left font-semibold text-gray-600 border-b border-gray-200">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="hover:bg-gray-50">
            {row.map((cell, ci) => (
              <td key={ci} className="px-2 py-1.5 text-gray-700 border-b border-gray-100">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ERPHome() {
  return (
    <div className="space-y-4">
      {/* Row 1: Full width emergency widget */}
      <Widget title="응급 및 안전 사고 발생 (주간)" icon="🚨" className="col-span-2">
        <MiniTable
          headers={['일시', '입소자', '호실', '유형', '심각도', '상태']}
          rows={[
            ['03/28 14:30', '김영순', '1관 301호', '낙상감지', '주의', '처리완료'],
            ['03/27 09:15', '이순자', '2관 205호', '낙상감지', '경고', '처리완료'],
            ['03/26 22:40', '박정희', '1관 402호', '긴급호출', '위급', '처리중'],
            ['03/25 11:20', '최옥순', '2관 103호', '낙상감지', '주의', '처리완료'],
          ]}
        />
      </Widget>

      <div className="grid grid-cols-2 gap-4">
        {/* Widget 2: 집중케어대상자 현황 */}
        <Widget title="집중케어대상자 현황" icon="🩺">
          <MiniTable
            headers={['입소자', '호실', '케어등급', '담당자', '특이사항']}
            rows={[
              ['김영순', '1관 301호', 'A등급', '간호사 김', '혈압 상승 주의'],
              ['이순자', '2관 205호', 'B등급', '간호사 이', '당뇨 집중관리'],
              ['정미숙', '1관 201호', 'A등급', '간호사 김', '낙상 고위험'],
              ['한순이', '2관 302호', 'B등급', '간호사 이', '심장질환 관찰'],
            ]}
          />
        </Widget>

        {/* Widget 3: 집중케어 디바이스 관리 */}
        <Widget title="집중케어 디바이스 관리" icon="📡">
          <MiniTable
            headers={['장치코드', '입소자', '위치', '배터리', '상태']}
            rows={[
              ['DEV-001', '김영순', '1관 301호', '85%', '정상'],
              ['DEV-003', '이순자', '2관 205호', '12%', '배터리 부족'],
              ['DEV-005', '정미숙', '1관 201호', '67%', '정상'],
              ['DEV-008', '-', '2관 복도', '-', '연결끊김'],
            ]}
          />
        </Widget>

        {/* Widget 4: 건강 상담 예약 현황 */}
        <Widget title="건강 상담 예약 현황" icon="🏥">
          <MiniTable
            headers={['날짜', '시간', '입소자', '상담유형', '담당자']}
            rows={[
              ['03/31', '10:00', '김영순', '정기상담', '간호사 김'],
              ['03/31', '11:00', '박정희', '투약상담', '간호사 이'],
              ['03/31', '14:00', '최옥순', '건강검진 결과', '간호사 김'],
              ['04/01', '09:30', '한순이', '심장 전문상담', '외부 전문의'],
            ]}
          />
        </Widget>

        {/* Widget 5: 서비스 신청 현황 */}
        <Widget title="서비스 신청 현황" icon="🛎️">
          <MiniTable
            headers={['신청일', '입소자', '서비스유형', '상태', '처리일']}
            rows={[
              ['03/29', '김영순', '병원동행', '승인', '03/31'],
              ['03/28', '이순자', '세탁서비스', '처리완료', '03/28'],
              ['03/28', '박정희', '외부진료 예약', '접수', '-'],
              ['03/27', '최옥순', '미용서비스', '처리완료', '03/29'],
            ]}
          />
        </Widget>

        {/* Widget 6: 거주자 현황 */}
        <Widget title="거주자 현황" icon="🏠">
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-blue-50 rounded p-2">
                <div className="text-lg font-bold text-blue-700">48</div>
                <div className="text-xs text-gray-500">전체 입소자</div>
              </div>
              <div className="bg-green-50 rounded p-2">
                <div className="text-lg font-bold text-green-700">42</div>
                <div className="text-xs text-gray-500">거주중</div>
              </div>
              <div className="bg-yellow-50 rounded p-2">
                <div className="text-lg font-bold text-yellow-700">4</div>
                <div className="text-xs text-gray-500">외출/입원</div>
              </div>
              <div className="bg-red-50 rounded p-2">
                <div className="text-lg font-bold text-red-700">2</div>
                <div className="text-xs text-gray-500">퇴소예정</div>
              </div>
            </div>
            <MiniTable
              headers={['구분', '정원', '현원', '공실', '입실률']}
              rows={[
                ['1관', '30', '26', '4', '86.7%'],
                ['2관', '25', '22', '3', '88.0%'],
                ['합계', '55', '48', '7', '87.3%'],
              ]}
            />
          </div>
        </Widget>

        {/* Widget 7: 월간 행사 계획 */}
        <Widget title="월간 행사 계획 (4월)" icon="🎉">
          <MiniTable
            headers={['일정', '행사명', '장소', '대상', '담당자']}
            rows={[
              ['04/02 (수)', '봄맞이 체조교실', '다목적실', '전체', '생활지도사 최'],
              ['04/05 (토)', '가족초청 다과회', '1층 로비', '전체', '생활지도사 박'],
              ['04/10 (목)', '건강강좌: 낙상예방', '강당', '전체', '간호사 김'],
              ['04/15 (화)', '생신잔치 (4월)', '식당', '해당 입소자', '생활지도사 최'],
              ['04/20 (일)', '봄 나들이', '인근공원', '보행가능자', '생활지도사 박'],
            ]}
          />
        </Widget>
      </div>
    </div>
  );
}

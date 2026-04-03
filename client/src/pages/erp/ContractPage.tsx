import React, { useState, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateId } from '../../data/mockData';
import { useCollection, useResidents, useStaff, useRooms } from '../../context/AppStateContext';

const contractStatusColor: Record<string, string> = {
  '계약중': 'bg-green-100 text-green-800',
  '만료예정': 'bg-yellow-100 text-yellow-800',
  '해지': 'bg-red-100 text-red-800',
  '갱신대기': 'bg-blue-100 text-blue-800',
  '만료': 'bg-gray-100 text-gray-800',
};

const depositStatusColor: Record<string, string> = {
  '완납': 'bg-green-100 text-green-800',
  '분할납부중': 'bg-yellow-100 text-yellow-800',
  '미납': 'bg-red-100 text-red-800',
  '환불완료': 'bg-gray-100 text-gray-800',
};

interface ContractItem {
  id: string;
  contractNo: string;
  name: string;
  room: string;
  type: string;
  startDate: string;
  endDate: string;
  monthly: number;
  deposit: number;
  depositStatus: string;
  status: string;
}

const initialData: ContractItem[] = [
  { id: '1', contractNo: 'CT-2025-001', name: '김영순', room: '1관 101호', type: '1인실', startDate: '2022-01-10', endDate: '2026-01-09', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '갱신대기' },
  { id: '2', contractNo: 'CT-2021-003', name: '이복자', room: '1관 103호', type: '1인실', startDate: '2021-06-15', endDate: '2026-06-14', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { id: '3', contractNo: 'CT-2023-005', name: '박정호', room: '1관 105호', type: '1인실', startDate: '2023-02-20', endDate: '2026-02-19', monthly: 2000000, deposit: 25000000, depositStatus: '완납', status: '만료예정' },
  { id: '4', contractNo: 'CT-2022-007', name: '최순남', room: '1관 107호', type: '1인실', startDate: '2022-09-05', endDate: '2026-09-04', monthly: 2500000, deposit: 35000000, depositStatus: '완납', status: '계약중' },
  { id: '5', contractNo: 'CT-2023-009', name: '정기원', room: '1관 109호', type: '1인실', startDate: '2023-07-01', endDate: '2026-06-30', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { id: '6', contractNo: 'CT-2021-011', name: '한말순', room: '2관 201호', type: '1인실', startDate: '2021-03-10', endDate: '2026-03-09', monthly: 1800000, deposit: 20000000, depositStatus: '완납', status: '갱신대기' },
  { id: '7', contractNo: 'CT-2024-013', name: '오세진', room: '2관 203호', type: '1인실', startDate: '2024-01-15', endDate: '2027-01-14', monthly: 2000000, deposit: 25000000, depositStatus: '완납', status: '계약중' },
  { id: '8', contractNo: 'CT-2023-015', name: '송미경', room: '2관 205호', type: '1인실', startDate: '2023-05-20', endDate: '2026-05-19', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { id: '9', contractNo: 'CT-2022-017', name: '윤태식', room: '2관 207호', type: '1인실', startDate: '2022-11-01', endDate: '2026-10-31', monthly: 2200000, deposit: 30000000, depositStatus: '분할납부중', status: '계약중' },
  { id: '10', contractNo: 'CT-2024-019', name: '강옥희', room: '2관 209호', type: '1인실', startDate: '2024-06-10', endDate: '2027-06-09', monthly: 2000000, deposit: 25000000, depositStatus: '완납', status: '계약중' },
];

// 보증금 입금 내역 (deposit 탭용)
interface DepositRecord {
  id: string;
  name: string;
  room: string;
  contractNo: string;
  total: number;
  paid: number;
  balance: number;
  depositStatus: string;
  paidDate: string;
}

const emptyForm = { name: '', room: '', type: '1인실', startDate: '', endDate: '', monthly: '2200000', deposit: '30000000' };

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

const tabs = [
  { id: 'register', label: '계약등록', path: '/resident/contract/register' },
  { id: 'deposit', label: '보증금 입금', path: '/resident/contract/deposit' },
  { id: 'status', label: '계약자 현황', path: '/resident/contract/status' },
];

// ─── Register tab types ───────────────────────────────────────────────────────

interface PersonInfo {
  name: string;
  gender: string;
  ssn: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  relationship: string;
}

interface FileItem {
  id: string;
  name: string;
  size: string;
  date: string;
}

interface ContractFormData {
  id: string;
  contractNo: string;
  contractDate: string;
  contractType: string;
  department: string;
  manager: string;
  contractStatus: string;
  building: string;
  roomNumber: string;
  contractCategory: string;
  deductRent: boolean;
  deductLiving: boolean;
  leaseDeposit: string;
  contractDeposit: string;
  prepayment: string;
  depositPayMethod: string;
  monthlyRent: string;
  monthlyLiving: string;
  contractYears: string;
  mealPlan1: string;
  mealPlan2: string;
  contractor: PersonInfo;
  primaryResident: PersonInfo;
  secondaryResident: PersonInfo;
  guardian: PersonInfo;
  guarantor: PersonInfo;
  consents: Record<string, boolean>;
  memo: string;
  files: FileItem[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNumber = (v: string) => {
  const num = v.replace(/[^0-9]/g, '');
  return num ? Number(num).toLocaleString('ko-KR') : '';
};

const parseNumber = (v: string) => v.replace(/[^0-9]/g, '');

function generateContractNo(existing: ContractFormData[]): string {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const todayContracts = existing.filter(c => c.contractNo.startsWith(`Cont${dateStr}`));
  const seq = todayContracts.length + 1;
  return `Cont${dateStr}${seq}`;
}

const emptyPerson = (): PersonInfo => ({
  name: '',
  gender: '',
  ssn: '',
  phone: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  relationship: '',
});

const emptyContractForm = (contractNo: string): ContractFormData => ({
  id: '',
  contractNo,
  contractDate: '',
  contractType: '신규',
  department: '',
  manager: '',
  contractStatus: '진행중',
  building: '',
  roomNumber: '',
  contractCategory: '전세형',
  deductRent: false,
  deductLiving: false,
  leaseDeposit: '',
  contractDeposit: '',
  prepayment: '',
  depositPayMethod: '일시불',
  monthlyRent: '',
  monthlyLiving: '',
  contractYears: '',
  mealPlan1: '30식',
  mealPlan2: '없음',
  contractor: emptyPerson(),
  primaryResident: emptyPerson(),
  secondaryResident: emptyPerson(),
  guardian: emptyPerson(),
  guarantor: emptyPerson(),
  consents: {},
  memo: '',
  files: [],
});

// ─── Collapsible section component ───────────────────────────────────────────

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleCard({ title, children, extra, defaultOpen = true }: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          {extra}
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label={open ? '접기' : '펼치기'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      {open && <div className="px-5 py-5">{children}</div>}
    </div>
  );
}

// ─── Amount input helper ──────────────────────────────────────────────────────

interface AmountInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

function AmountInput({ value, onChange, placeholder }: AmountInputProps) {
  const [display, setDisplay] = useState(value ? formatNumber(value) : '');

  // Sync display when value changes from outside (e.g. form reset)
  React.useEffect(() => {
    setDisplay(value ? formatNumber(value) : '');
  }, [value]);

  return (
    <div className="flex items-center">
      <input
        type="text"
        inputMode="numeric"
        value={display}
        placeholder={placeholder}
        onChange={e => {
          const raw = parseNumber(e.target.value);
          setDisplay(e.target.value);
          onChange(raw);
        }}
        onBlur={() => setDisplay(formatNumber(value))}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#F0835A] focus:border-[#F0835A]"
      />
      <span className="ml-1 text-sm text-gray-500 whitespace-nowrap">원</span>
    </div>
  );
}

// ─── Person section form ──────────────────────────────────────────────────────

interface PersonFormProps {
  data: PersonInfo;
  onChange: (p: PersonInfo) => void;
  showGender?: boolean;
  showRelationship?: boolean;
  relationshipOptions?: string[];
}

function PersonForm({ data, onChange, showGender = false, showRelationship = false, relationshipOptions = [] }: PersonFormProps) {
  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#F0835A] focus:border-[#F0835A]';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  const set = (field: keyof PersonInfo, val: string) => onChange({ ...data, [field]: val });

  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className={`grid gap-4 ${showGender ? 'grid-cols-4' : 'grid-cols-3'}`}>
        <div>
          <label className={labelCls}>성명</label>
          <input type="text" value={data.name} onChange={e => set('name', e.target.value)} className={inputCls} />
        </div>
        {showGender && (
          <div>
            <label className={labelCls}>성별</label>
            <div className="flex items-center gap-4 mt-2">
              {['남', '여'].map(g => (
                <label key={g} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name={`gender-${Math.random()}`}
                    value={g}
                    checked={data.gender === g}
                    onChange={() => set('gender', g)}
                    className="accent-[#F0835A]"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className={labelCls}>주민등록번호</label>
          <input type="text" value={data.ssn} onChange={e => set('ssn', e.target.value)} placeholder="000000-0000000" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>연락처</label>
          <input type="tel" value={data.phone} onChange={e => set('phone', e.target.value)} className={inputCls} />
        </div>
      </div>
      {/* Row 2 */}
      <div className="flex items-end gap-2">
        <div className="w-32">
          <label className={labelCls}>우편번호</label>
          <input type="text" value={data.zipCode} onChange={e => set('zipCode', e.target.value)} className={inputCls} />
        </div>
        <button type="button" className="mb-0.5 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap">
          🔍 검색
        </button>
        <div className="flex-1">
          <label className={labelCls}>주소</label>
          <input type="text" value={data.address} onChange={e => set('address', e.target.value)} readOnly className={`${inputCls} bg-gray-50`} />
        </div>
      </div>
      {/* Row 3 */}
      <div className={`grid gap-4 ${showRelationship ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <div>
          <label className={labelCls}>상세주소</label>
          <input type="text" value={data.addressDetail} onChange={e => set('addressDetail', e.target.value)} className={inputCls} />
        </div>
        {showRelationship && (
          <div>
            <label className={labelCls}>관계</label>
            <select value={data.relationship} onChange={e => set('relationship', e.target.value)} className={inputCls}>
              <option value="">선택</option>
              {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContractPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || 'register';

  const [residents] = useResidents();
  const [staff] = useStaff();
  const [rooms] = useRooms();
  const [data, setData] = useCollection<ContractItem>('contracts', initialData);

  const depositRecordsInit = useMemo(() => initialData.map(c => ({
    id: c.id,
    name: c.name,
    room: c.room,
    contractNo: c.contractNo,
    total: c.deposit,
    paid: c.depositStatus === '완납' ? c.deposit : c.depositStatus === '분할납부중' ? Math.round(c.deposit * 0.67) : 0,
    balance: c.depositStatus === '완납' ? 0 : c.depositStatus === '분할납부중' ? Math.round(c.deposit * 0.33) : c.deposit,
    depositStatus: c.depositStatus,
    paidDate: c.depositStatus !== '미납' ? c.startDate : '-',
  })), []);

  const residentOptions = useMemo(() => residents
    .filter(r => r.status !== 'DISCHARGED')
    .map(r => ({ name: r.name, room: `${r.building} ${r.roomNumber}호`, type: '1인실' })), [residents]);

  const [depData, setDepData] = useCollection<DepositRecord>('contractDeposits', depositRecordsInit);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedDepId, setSelectedDepId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const filtered = search ? data.filter(d => d.name.includes(search)) : data;

  const nextContractNo = () => {
    const year = new Date().getFullYear();
    const nums = data.map(d => {
      const m = d.contractNo.match(/CT-\d{4}-(\d{3})/);
      return m ? parseInt(m[1]) : 0;
    });
    const next = Math.max(...nums, 0) + 1;
    return `CT-${year}-${String(next).padStart(3, '0')}`;
  };

  const handleResidentSelect = (name: string) => {
    const found = residentOptions.find(r => r.name === name);
    if (found) {
      setFormData(prev => ({ ...prev, name: found.name, room: found.room, type: found.type }));
    } else {
      setFormData(prev => ({ ...prev, name }));
    }
  };

  const handleEdit = (id: string) => {
    const item = data.find(d => d.id === id);
    if (!item) return;
    setFormData({ name: item.name, room: item.room, type: item.type, startDate: item.startDate, endDate: item.endDate, monthly: String(item.monthly), deposit: String(item.deposit) });
    setEditingId(id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) return;
    if (editingId) {
      setData(prev => prev.map(d => d.id === editingId ? {
        ...d,
        name: formData.name,
        room: formData.room,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthly: Number(formData.monthly) || 0,
        deposit: Number(formData.deposit) || 0,
      } : d));
    } else {
      const newItem: ContractItem = {
        id: generateId('contract'),
        contractNo: nextContractNo(),
        name: formData.name,
        room: formData.room,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthly: Number(formData.monthly) || 0,
        deposit: Number(formData.deposit) || 0,
        depositStatus: '미납',
        status: '계약중',
      };
      setData(prev => [newItem, ...prev]);
    }
    setFormData(emptyForm);
    setEditingId(null);
    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setData(prev => prev.map(d => {
      if (d.id !== id) return d;
      return { ...d, status: d.status === '계약중' ? '만료' : '계약중' };
    }));
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  const handleDepositPay = () => {
    if (!selectedDepId) return;
    const amount = Number(payAmount) || 0;
    if (amount <= 0) return;
    setDepData(prev => prev.map(r => {
      if (r.id !== selectedDepId) return r;
      const newPaid = r.paid + amount;
      const newBalance = Math.max(0, r.total - newPaid);
      return {
        ...r,
        paid: Math.min(newPaid, r.total),
        balance: newBalance,
        depositStatus: newBalance === 0 ? '완납' : '분할납부중',
        paidDate: new Date().toISOString().slice(0, 10),
      };
    }));
    setShowPayModal(false);
    setSelectedDepId(null);
    setPayAmount('');
  };

  // 현황 탭용 집계
  const statusGroups = {
    active: data.filter(d => d.status === '계약중').length,
    expiringSoon: data.filter(d => d.status === '만료예정' || d.status === '갱신대기').length,
    expired: data.filter(d => d.status === '만료' || d.status === '해지').length,
  };

  // ─── Register tab state ────────────────────────────────────────────────────

  const [contractForms, setContractForms] = useCollection<ContractFormData>('contractForms', []);
  const [regForm, setRegForm] = useState<ContractFormData>(() => emptyContractForm(generateContractNo([])));
  const [toast, setToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buildingOptions = useMemo(() => {
    const buildings = Array.from(new Set(rooms.map(r => r.building)));
    return buildings.length > 0 ? buildings : ['2층', '3층', '4층'];
  }, [rooms]);

  const staffOptions = useMemo(() => staff.map(s => s.name), [staff]);

  const updateRegField = <K extends keyof ContractFormData>(key: K, val: ContractFormData[K]) => {
    setRegForm(prev => ({ ...prev, [key]: val }));
  };

  const updatePerson = (section: 'contractor' | 'primaryResident' | 'secondaryResident' | 'guardian' | 'guarantor', val: PersonInfo) => {
    setRegForm(prev => ({ ...prev, [section]: val }));
  };

  const copyContractorTo = (section: 'primaryResident' | 'guardian' | 'guarantor') => {
    const { name, ssn, phone, zipCode, address, addressDetail } = regForm.contractor;
    setRegForm(prev => ({
      ...prev,
      [section]: { ...prev[section], name, ssn, phone, zipCode, address, addressDetail },
    }));
  };

  const copyGuardianTo = (section: 'guarantor') => {
    const { name, gender, ssn, phone, zipCode, address, addressDetail, relationship } = regForm.guardian;
    setRegForm(prev => ({
      ...prev,
      [section]: { ...prev[section], name, gender, ssn, phone, zipCode, address, addressDetail, relationship },
    }));
  };

  const toggleConsent = (key: string) => {
    setRegForm(prev => ({
      ...prev,
      consents: { ...prev.consents, [key]: !prev.consents[key] },
    }));
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const today = new Date().toISOString().slice(0, 10);
    const newFiles: FileItem[] = Array.from(files).map(f => ({
      id: generateId('file'),
      name: f.name,
      size: f.size > 1024 * 1024
        ? `${(f.size / 1024 / 1024).toFixed(1)}MB`
        : `${(f.size / 1024).toFixed(0)}KB`,
      date: today,
    }));
    setRegForm(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
    e.target.value = '';
  };

  const handleFileDelete = (id: string) => {
    setRegForm(prev => ({ ...prev, files: prev.files.filter(f => f.id !== id) }));
  };

  const handleRegSave = () => {
    const existing = contractForms.find(c => c.id === regForm.id);
    let saved: ContractFormData;
    if (existing) {
      saved = { ...regForm };
      setContractForms(prev => prev.map(c => c.id === regForm.id ? saved : c));
    } else {
      saved = { ...regForm, id: generateId('contractForm') };
      setContractForms(prev => [saved, ...prev]);
    }
    setRegForm(saved);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#F0835A] focus:border-[#F0835A]';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">계약관리</h1>
          <p className="mt-1 text-sm text-gray-500">입소자 계약 현황을 조회하고 관리합니다.</p>
        </div>
        {segment === 'register' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/resident/settlement/deposit')}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              보증금정산
            </button>
            <button
              type="button"
              onClick={handleRegSave}
              className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors"
            >
              저장
            </button>
          </div>
        )}
      </div>

      {/* 탭 바 */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── 계약등록 탭 ──────────────────────────────────────────────────────── */}
      {segment === 'register' && (
        <div className="space-y-5 pb-20">

          {/* Section 1: 계약 기본정보 */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-800">계약 기본정보</h3>
            </div>
            <div className="px-5 py-5 space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>계약번호</label>
                  <input
                    type="text"
                    value={regForm.contractNo}
                    readOnly
                    className={`${inputCls} bg-gray-50 text-gray-500`}
                  />
                </div>
                <div>
                  <label className={labelCls}>계약일</label>
                  <input
                    type="date"
                    value={regForm.contractDate}
                    onChange={e => updateRegField('contractDate', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>계약구분</label>
                  <div className="flex items-center gap-4 mt-2">
                    {['신규', '재계약'].map(t => (
                      <label key={t} className="flex items-center gap-1 text-sm cursor-pointer">
                        <input
                          type="radio"
                          value={t}
                          checked={regForm.contractType === t}
                          onChange={() => updateRegField('contractType', t)}
                          className="accent-[#F0835A]"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>부서</label>
                  <select value={regForm.department} onChange={e => updateRegField('department', e.target.value)} className={inputCls}>
                    <option value="">선택</option>
                    <option value="관리파트">관리파트</option>
                    <option value="운영파트">운영파트</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>담당자</label>
                  <select value={regForm.manager} onChange={e => updateRegField('manager', e.target.value)} className={inputCls}>
                    <option value="">선택</option>
                    {staffOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>계약상태</label>
                  <select value={regForm.contractStatus} onChange={e => updateRegField('contractStatus', e.target.value)} className={inputCls}>
                    <option value="진행중">진행중</option>
                    <option value="확정">확정</option>
                    <option value="해지">해지</option>
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>동/호수</label>
                  <div className="flex items-center gap-1">
                    <select value={regForm.building} onChange={e => updateRegField('building', e.target.value)} className={`${inputCls} w-24`}>
                      <option value="">층</option>
                      {buildingOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <input
                      type="text"
                      value={regForm.roomNumber}
                      onChange={e => updateRegField('roomNumber', e.target.value)}
                      placeholder="호수"
                      className={`${inputCls} flex-1`}
                    />
                    <button type="button" className="px-2 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap">
                      🔍
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>계약유형</label>
                  <select value={regForm.contractCategory} onChange={e => updateRegField('contractCategory', e.target.value)} className={inputCls}>
                    <option value="전세형">전세형</option>
                    <option value="월세형">월세형</option>
                    <option value="혼합형">혼합형</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>차감방식</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regForm.deductRent}
                        onChange={e => updateRegField('deductRent', e.target.checked)}
                        className="accent-[#F0835A]"
                      />
                      임대료
                    </label>
                    <label className="flex items-center gap-1 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regForm.deductLiving}
                        onChange={e => updateRegField('deductLiving', e.target.checked)}
                        className="accent-[#F0835A]"
                      />
                      기본생활비
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>전세보증금 총액</label>
                  <AmountInput
                    value={regForm.leaseDeposit}
                    onChange={v => updateRegField('leaseDeposit', v)}
                  />
                </div>
                <div>
                  <label className={labelCls}>계약보증금</label>
                  <AmountInput
                    value={regForm.contractDeposit}
                    onChange={v => updateRegField('contractDeposit', v)}
                  />
                </div>
                <div>
                  <label className={labelCls}>선납금</label>
                  <AmountInput
                    value={regForm.prepayment}
                    onChange={v => updateRegField('prepayment', v)}
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>입소보증금 납부방식</label>
                  <select value={regForm.depositPayMethod} onChange={e => updateRegField('depositPayMethod', e.target.value)} className={inputCls}>
                    <option value="일시불">일시불</option>
                    <option value="분납">분납</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>월 임대료</label>
                  <AmountInput
                    value={regForm.monthlyRent}
                    onChange={v => updateRegField('monthlyRent', v)}
                  />
                </div>
                <div>
                  <label className={labelCls}>기본생활비</label>
                  <AmountInput
                    value={regForm.monthlyLiving}
                    onChange={v => updateRegField('monthlyLiving', v)}
                  />
                </div>
              </div>

              {/* Row 6 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>계약기간</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={regForm.contractYears}
                      onChange={e => updateRegField('contractYears', e.target.value)}
                      min={0}
                      className={`${inputCls}`}
                    />
                    <span className="ml-1 text-sm text-gray-500">년</span>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>월 의무식 - 입소자1</label>
                  <select value={regForm.mealPlan1} onChange={e => updateRegField('mealPlan1', e.target.value)} className={inputCls}>
                    <option value="30식">30식</option>
                    <option value="60식">60식</option>
                    <option value="90식">90식</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>월 의무식 - 입소자2</label>
                  <select value={regForm.mealPlan2} onChange={e => updateRegField('mealPlan2', e.target.value)} className={inputCls}>
                    <option value="없음">없음</option>
                    <option value="30식">30식</option>
                    <option value="60식">60식</option>
                    <option value="90식">90식</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 계약자 정보 */}
          <CollapsibleCard title="계약자 정보">
            <PersonForm
              data={regForm.contractor}
              onChange={val => updatePerson('contractor', val)}
              showGender={false}
              showRelationship={true}
              relationshipOptions={['본인', '자녀', '배우자', '기타']}
            />
          </CollapsibleCard>

          {/* Section 3: 대표입소자 정보 */}
          <CollapsibleCard
            title="대표입소자 정보"
            extra={
              <button
                type="button"
                onClick={() => copyContractorTo('primaryResident')}
                className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
              >
                계약자 정보 복사 ▼
              </button>
            }
          >
            <PersonForm
              data={regForm.primaryResident}
              onChange={val => updatePerson('primaryResident', val)}
              showGender={true}
              showRelationship={false}
            />
          </CollapsibleCard>

          {/* Section 4: 입소자 정보 */}
          <CollapsibleCard title="입소자 정보 (대표입소자와 다른 경우)" defaultOpen={false}>
            <PersonForm
              data={regForm.secondaryResident}
              onChange={val => updatePerson('secondaryResident', val)}
              showGender={true}
              showRelationship={false}
            />
          </CollapsibleCard>

          {/* Section 5: 보호자 정보 */}
          <CollapsibleCard
            title="보호자 정보"
            extra={
              <button
                type="button"
                onClick={() => copyContractorTo('guardian')}
                className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
              >
                계약자 정보 복사 ▼
              </button>
            }
          >
            <PersonForm
              data={regForm.guardian}
              onChange={val => updatePerson('guardian', val)}
              showGender={true}
              showRelationship={true}
              relationshipOptions={['아들', '딸', '배우자', '며느리', '사위', '형제', '기타']}
            />
          </CollapsibleCard>

          {/* Section 6: 신원인수자 정보 */}
          <CollapsibleCard
            title="신원인수자 정보"
            extra={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyContractorTo('guarantor')}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
                >
                  계약자 정보 복사 ▼
                </button>
                <button
                  type="button"
                  onClick={() => copyGuardianTo('guarantor')}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
                >
                  보호자 정보 복사 ▼
                </button>
              </div>
            }
          >
            <PersonForm
              data={regForm.guarantor}
              onChange={val => updatePerson('guarantor', val)}
              showGender={true}
              showRelationship={true}
              relationshipOptions={['아들', '딸', '배우자', '며느리', '사위', '형제', '기타']}
            />
          </CollapsibleCard>

          {/* Section 7: 동의 및 서명 */}
          <CollapsibleCard title="동의 및 서명">
            <div className="space-y-3">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'rules_rep', label: '이용수칙(대표자)' },
                  { key: 'rules_resident', label: '이용수칙(입소자)' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!regForm.consents[item.key]}
                      onChange={() => toggleConsent(item.key)}
                      className="accent-[#F0835A]"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'privacy_contractor', label: '개인정보이용(계약자)' },
                  { key: 'privacy_rep', label: '개인정보이용(대표자)' },
                  { key: 'privacy_resident', label: '개인정보이용(입소자)' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!regForm.consents[item.key]}
                      onChange={() => toggleConsent(item.key)}
                      className="accent-[#F0835A]"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'privacy_guardian', label: '개인정보이용(보호자)' },
                  { key: 'privacy_guarantor', label: '개인정보이용(신원인수자)' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!regForm.consents[item.key]}
                      onChange={() => toggleConsent(item.key)}
                      className="accent-[#F0835A]"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
              {/* Row 4 */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'sign_rep', label: '대표입소자 전자서명' },
                  { key: 'sign_resident', label: '입소자 전자서명' },
                  { key: 'sign_guarantor', label: '신원인수자 전자서명' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!regForm.consents[item.key]}
                      onChange={() => toggleConsent(item.key)}
                      className="accent-[#F0835A]"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleCard>

          {/* Section 8: 메모 */}
          <CollapsibleCard title="메모">
            <textarea
              value={regForm.memo}
              onChange={e => updateRegField('memo', e.target.value)}
              rows={4}
              placeholder="메모를 입력하세요..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#F0835A] focus:border-[#F0835A] resize-none"
            />
          </CollapsibleCard>

          {/* Section 9: 파일 등록 */}
          <CollapsibleCard title={`파일 등록 (${regForm.files.length}건)`}>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">파일명</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">크기</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">등록일</th>
                      <th className="px-4 py-2 text-center font-semibold text-gray-600 w-16">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regForm.files.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-400 text-sm">
                          등록된 파일이 없습니다.
                        </td>
                      </tr>
                    ) : regForm.files.map(file => (
                      <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-800">{file.name}</td>
                        <td className="px-4 py-2 text-gray-500">{file.size}</td>
                        <td className="px-4 py-2 text-gray-500">{file.date}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleFileDelete(file.id)}
                            className="text-gray-400 hover:text-red-500 font-bold text-base leading-none"
                            aria-label="삭제"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRegForm(prev => ({ ...prev, files: [] }))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
                >
                  삭제
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-sm bg-[#F0835A] text-white rounded-md hover:bg-[#d9714d]"
                >
                  추가
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileAdd}
                />
              </div>
            </div>
          </CollapsibleCard>

          {/* Sticky bottom bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-6 py-3 flex justify-end z-40">
            <button
              type="button"
              onClick={handleRegSave}
              className="px-6 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors"
            >
              저장
            </button>
          </div>

          {/* Toast */}
          {toast && (
            <div className="fixed bottom-16 right-6 z-50 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg pointer-events-none transition-opacity">
              저장되었습니다
            </div>
          )}
        </div>
      )}

      {/* 보증금 입금 탭 */}
      {segment === 'deposit' && (
        <div className="space-y-6">
          {/* 요약 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
              <div className="text-sm text-gray-500">보증금 총액</div>
              <div className="text-xl font-bold text-gray-900 mt-1">{fmt(depData.reduce((s, r) => s + r.total, 0))}</div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
              <div className="text-sm text-gray-500">납부완료</div>
              <div className="text-xl font-bold text-green-600 mt-1">{fmt(depData.reduce((s, r) => s + r.paid, 0))}</div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
              <div className="text-sm text-gray-500">미납잔액</div>
              <div className="text-xl font-bold text-red-600 mt-1">{fmt(depData.reduce((s, r) => s + r.balance, 0))}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">계약번호</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">보증금총액</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">납부액</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">잔액</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">최종납부일</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">처리</th>
                  </tr>
                </thead>
                <tbody>
                  {depData.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.room}</td>
                      <td className="px-4 py-3 text-blue-600 font-mono text-xs">{row.contractNo}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{fmt(row.total)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{fmt(row.paid)}</td>
                      <td className="px-4 py-3 text-right font-medium" style={{ color: row.balance > 0 ? '#dc2626' : '#16a34a' }}>{fmt(row.balance)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${depositStatusColor[row.depositStatus]}`}>{row.depositStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.paidDate}</td>
                      <td className="px-4 py-3">
                        {row.balance > 0 && (
                          <button onClick={() => { setSelectedDepId(row.id); setPayAmount(''); setShowPayModal(true); }}
                            className="px-2 py-1 text-xs bg-[#F0835A] text-white rounded hover:bg-[#d9714d]">입금처리</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 계약자 현황 탭 */}
      {segment === 'status' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <div className="text-sm text-green-700 font-medium">계약중</div>
              <div className="text-3xl font-bold text-green-700 mt-2">{statusGroups.active}명</div>
              <div className="mt-3 space-y-1">
                {data.filter(d => d.status === '계약중').map(d => (
                  <div key={d.id} className="text-xs text-green-600 flex justify-between">
                    <span>{d.name}</span><span>{d.room}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
              <div className="text-sm text-yellow-700 font-medium">만료예정 / 갱신대기</div>
              <div className="text-3xl font-bold text-yellow-700 mt-2">{statusGroups.expiringSoon}명</div>
              <div className="mt-3 space-y-1">
                {data.filter(d => d.status === '만료예정' || d.status === '갱신대기').map(d => (
                  <div key={d.id} className="text-xs text-yellow-700 flex justify-between">
                    <span>{d.name}</span><span className="text-gray-500">{d.endDate} 만료</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <div className="text-sm text-gray-700 font-medium">만료 / 해지</div>
              <div className="text-3xl font-bold text-gray-600 mt-2">{statusGroups.expired}명</div>
              <div className="mt-3 space-y-1">
                {data.filter(d => d.status === '만료' || d.status === '해지').map(d => (
                  <div key={d.id} className="text-xs text-gray-500 flex justify-between">
                    <span>{d.name}</span><span>{d.room}</span>
                  </div>
                ))}
                {statusGroups.expired === 0 && <div className="text-xs text-gray-400">해당 없음</div>}
              </div>
            </div>
          </div>

          {/* 계약 기간 현황 테이블 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">계약자 전체 현황</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">계약시작일</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">계약종료일</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">기준생활비</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">계약상태</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.room}</td>
                      <td className="px-4 py-3 text-gray-700">{row.startDate}</td>
                      <td className="px-4 py-3 text-gray-700">{row.endDate}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{fmt(row.monthly)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${contractStatusColor[row.status]}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 입금처리 모달 */}
      {showPayModal && selectedDepId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">보증금 입금처리</h2>
            {(() => {
              const item = depData.find(d => d.id === selectedDepId);
              if (!item) return null;
              return (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600"><span className="font-medium text-gray-900">{item.name}</span> ({item.room})</div>
                  <div className="text-sm text-gray-600">미납잔액: <span className="font-bold text-red-600">{fmt(item.balance)}</span></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">입금액</label>
                    <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}
                      placeholder={String(item.balance)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
                  </div>
                </div>
              );
            })()}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setShowPayModal(false); setSelectedDepId(null); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleDepositPay}
                className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 신규 계약 등록 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{editingId ? '수정' : '신규 계약 등록'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <select value={formData.name} onChange={e => handleResidentSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]">
                  <option value="">선택하세요</option>
                  {residentOptions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">호실</label>
                <input type="text" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })}
                  placeholder="예: 1관 101호"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]">
                  <option value="1인실">1인실</option>
                  <option value="2인실">2인실</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계약시작일</label>
                <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계약종료일</label>
                <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기준생활비</label>
                <input type="number" value={formData.monthly} onChange={e => setFormData({ ...formData, monthly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">보증금</label>
                <input type="number" value={formData.deposit} onChange={e => setFormData({ ...formData, deposit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setShowModal(false); setFormData(emptyForm); setEditingId(null); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleSave}
                className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Search, X, Check, Pen, Trash2, ChevronLeft, ChevronRight, UserCog, Plus } from 'lucide-react';

const PAGE_SIZE = 15;

const skillOptions = [
  { id: 1, skill_name: 'React' }, { id: 2, skill_name: 'Vue' }, { id: 3, skill_name: 'Node.js' },
  { id: 4, skill_name: 'Python' }, { id: 5, skill_name: 'TypeScript' }, { id: 6, skill_name: 'MySQL' },
  { id: 7, skill_name: 'Docker' }, { id: 8, skill_name: 'AWS' }, { id: 9, skill_name: 'Figma' },
];

const positionList = [
  { value: 1, label: '前端工程師' }, { value: 2, label: '後端工程師' }, { value: 3, label: '全端工程師' },
  { value: 4, label: 'UI/UX 設計師' }, { value: 5, label: 'DevOps 工程師' },
];

const initialMembers = [
  { member_id: 1, user_name: '陳雅琳', user_en_name: 'Yaling Chen', email: 'yaling@example.com', role: 'admin', status: 1, seat_number: '01', joined: '2024-01-15', user_nick_name: 'Yaling', user_title: '全端開發者', position_id: 3, phone: '0912-345-678', github: 'github.com/yaling', linkedin: '', bio: '熱愛開發，專注於系統架構設計。', skills: [1, 3, 5] },
  { member_id: 2, user_name: '林志偉', user_en_name: 'Zhiwei Lin', email: 'zhiwei@example.com', role: 'editor', status: 1, seat_number: '02', joined: '2024-02-20', user_nick_name: 'Wei', user_title: '前端愛好者', position_id: 1, phone: '', github: '', linkedin: '', bio: '', skills: [1, 2, 9] },
  { member_id: 3, user_name: '王美華', user_en_name: '', email: 'meihua@example.com', role: 'member', status: 0, seat_number: '03', joined: '2024-03-05', user_nick_name: '', user_title: '', position_id: '', phone: '', github: '', linkedin: '', bio: '', skills: [] },
  { member_id: 4, user_name: '張俊傑', user_en_name: '', email: 'junjie@example.com', role: 'member', status: 1, seat_number: '04', joined: '2024-04-10', user_nick_name: '', user_title: '', position_id: 2, phone: '', github: '', linkedin: '', bio: '', skills: [3, 4, 6] },
  { member_id: 5, user_name: '李靜怡', user_en_name: '', email: 'jingyi@example.com', role: 'editor', status: 2, seat_number: '05', joined: '2024-05-18', user_nick_name: '', user_title: '', position_id: 4, phone: '', github: '', linkedin: '', bio: '', skills: [9] },
  { member_id: 6, user_name: '黃建宏', user_en_name: '', email: 'jianhong@example.com', role: 'member', status: 1, seat_number: '06', joined: '2024-06-22', user_nick_name: '', user_title: '', position_id: '', phone: '', github: '', linkedin: '', bio: '', skills: [] },
  { member_id: 7, user_name: '劉雪梅', user_en_name: '', email: 'xuemei@example.com', role: 'member', status: 0, seat_number: '07', joined: '2024-07-30', user_nick_name: '', user_title: '', position_id: '', phone: '', github: '', linkedin: '', bio: '', skills: [] },
  { member_id: 8, user_name: '吳俊宏', user_en_name: '', email: 'junhong@example.com', role: 'admin', status: 1, seat_number: '08', joined: '2024-08-01', user_nick_name: '', user_title: '', position_id: 5, phone: '', github: '', linkedin: '', bio: '', skills: [7, 8] },
  { member_id: 9, user_name: '蔡佳玲', user_en_name: '', email: 'jialing@example.com', role: 'member', status: 2, seat_number: '09', joined: '2024-09-12', user_nick_name: '', user_title: '', position_id: '', phone: '', github: '', linkedin: '', bio: '', skills: [] },
  { member_id: 10, user_name: '鄭文凱', user_en_name: '', email: 'wenkai@example.com', role: 'editor', status: 1, seat_number: '10', joined: '2024-10-05', user_nick_name: '', user_title: '', position_id: 2, phone: '', github: '', linkedin: '', bio: '', skills: [3, 6] },
];

const inputCls = 'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all';

const ROLE_CONFIG = {
  admin:  { label: '管理員', bg: 'bg-rose-100 text-rose-700 border-rose-200',     dot: 'bg-rose-400' },
  editor: { label: '編輯',   bg: 'bg-sky-100 text-sky-700 border-sky-200',        dot: 'bg-sky-400' },
  member: { label: '會員',   bg: 'bg-slate-100 text-slate-600 border-slate-200',  dot: 'bg-slate-400' },
};

const STATUS_CONFIG = {
  1: { label: '啟用', dot: 'bg-emerald-400', bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  0: { label: '停用', dot: 'bg-slate-300',   bg: 'bg-slate-100 text-slate-500 border-slate-200' },
  2: { label: '待審', dot: 'bg-orange-400',  bg: 'bg-orange-100 text-orange-600 border-orange-200' },
};

const AVATAR_COLORS = [
  'bg-rose-200 text-rose-700','bg-violet-200 text-violet-700','bg-teal-200 text-teal-700',
  'bg-amber-200 text-amber-700','bg-sky-200 text-sky-700','bg-pink-200 text-pink-700',
  'bg-lime-200 text-lime-700','bg-indigo-200 text-indigo-700','bg-cyan-200 text-cyan-700','bg-orange-200 text-orange-700',
];

const EMPTY_FORM = {
  user_name: '', user_en_name: '', email: '', seat_number: '',
  user_nick_name: '', user_title: '', position_id: '', phone: '',
  github: '', linkedin: '', bio: '', skills: [], role: 'member', status: 1,
};

/* ─── Modal ─────────────────────────────────────────────────────── */
function Modal({ title, onClose, onConfirm, confirmLabel = '儲存', confirmColor = 'bg-rose-500 hover:bg-rose-600', children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(15,15,15,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh', animation: 'modalIn .18s cubic-bezier(.4,0,.2,1)' }}
        onClick={e => e.stopPropagation()}>
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <div onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </div>
        </div>
        {/* scrollable body */}
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">{children}</div>
        {/* footer */}
        <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100 shrink-0">
          <div onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">取消</div>
          <div onClick={onConfirm} className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${confirmColor}`}>
            <Check className="w-4 h-4" />{confirmLabel}
          </div>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(-16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}

function DeleteModal({ name, onClose, onConfirm }) {
  return (
    <Modal title="確認刪除" onClose={onClose} onConfirm={onConfirm} confirmLabel="刪除" confirmColor="bg-red-500 hover:bg-red-600">
      <p className="text-sm text-gray-600">確定要刪除會員 <span className="font-bold text-slate-900">「{name}」</span> 嗎？此操作無法復原。</p>
    </Modal>
  );
}

function Field({ label, required = false, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
        {required && <span className="text-red-500">*</span>}{label}
      </label>
      {children}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function AdminMemberManagement() {
  const [members, setMembers] = useState(initialMembers);
  const [modal, setModal]     = useState(null);
  const [search, setSearch]   = useState('');
  const [filterRole, setFilterRole]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);

  // const [allMembers, setAllMembers] = useState([]);
  // const [selectMember, setSelectMember] = useState();

  const closeModal = () => setModal(null);
  const anyFilter  = filterRole || filterStatus !== '';
  

  const filtered = members.filter(m => {
    const q = search.trim().toLowerCase();
    if (q && !m.user_name.includes(q) && !m.email.toLowerCase().includes(q) && !String(m.seat_number).includes(q)) return false;
    if (filterRole   && m.role !== filterRole) return false;
    if (filterStatus !== '' && String(m.status) !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, filterRole, filterStatus]);

  const clearAll = () => { setSearch(''); setFilterRole(''); setFilterStatus(''); };

  const pageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= safePage - 1 && i <= safePage + 1)) pages.push(i);
      else if (pages[pages.length - 1] !== '…') pages.push('…');
    }
    return pages;
  };

  const stats = {
    total:   members.length,
    active:  members.filter(m => m.status === 1).length,
    pending: members.filter(m => m.status === 2).length,
    admin:   members.filter(m => m.role === 'admin').length,
  };

  const saveMember = (data) => {
    if (data.member_id) {
      setMembers(prev => prev.map(m => m.member_id === data.member_id ? { ...m, ...data } : m));
    } else {
      setMembers(prev => [...prev, { ...data, member_id: Date.now(), joined: new Date().toISOString().split('T')[0] }]);
    }
    closeModal();
  };

  const deleteMember = (member_id) => {
    setMembers(prev => prev.filter(m => m.member_id !== member_id));
    closeModal();
  };

  /* ─── Render Modal ──────── */
  const renderModal = () => {
    if (!modal) return null;
    const { type, data } = modal;

    if (type === 'delete')
      return <DeleteModal name={data.user_name} onClose={closeModal} onConfirm={() => deleteMember(data.member_id)} />;

    const form    = data;
    const setForm = (patch) => setModal(m => ({ ...m, data: { ...m.data, ...patch } }));
    const isEdit  = !!form.member_id;

    return (
      <Modal
        title={isEdit ? '編輯會員' : '新增會員'}
        onClose={closeModal}
        onConfirm={() => { if (!form.user_name?.trim() || !form.email?.trim()) return; saveMember(form); }}
        confirmColor="bg-rose-500 hover:bg-rose-600"
      >
        {/* ── 基本資料 ── */}
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest -mb-2">基本資料</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="姓名" required>
            <input type="text" className={inputCls} placeholder="輸入姓名"
              value={form.user_name ?? ''} onChange={e => setForm({ user_name: e.target.value })} />
          </Field>
          <Field label="英文姓名">
            <input type="text" className={inputCls} placeholder="English Name"
              value={form.user_en_name ?? ''} onChange={e => setForm({ user_en_name: e.target.value })} />
          </Field>
          <Field label="E-mail" required>
            <input type="email"
              className={inputCls + (isEdit ? ' cursor-not-allowed opacity-50' : '')}
              placeholder="email@example.com"
              value={form.email ?? ''}
              readOnly={isEdit}
              onChange={e => !isEdit && setForm({ email: e.target.value })}
            />
          </Field>
          <Field label="座號">
            <input type="text"
              className={inputCls + ' cursor-not-allowed opacity-50'}
              value={form.seat_number ?? ''} readOnly
            />
          </Field>
          <Field label="暱稱">
            <input type="text" className={inputCls} placeholder="輸入暱稱"
              value={form.user_nick_name ?? ''} onChange={e => setForm({ user_nick_name: e.target.value })} />
          </Field>
          <Field label="個人簡介">
            <input type="text" className={inputCls} placeholder="一句話介紹自己"
              value={form.user_title ?? ''} onChange={e => setForm({ user_title: e.target.value })} />
          </Field>
          <Field label="開發主力">
            <select className={inputCls + ' appearance-none'} value={form.position_id ?? ''}
              onChange={e => setForm({ position_id: Number(e.target.value) })}>
              <option value="">請選擇</option>
              {positionList.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
          <Field label="電話">
            <input type="text" className={inputCls} placeholder="0912-345-678"
              value={form.phone ?? ''} onChange={e => setForm({ phone: e.target.value })} />
          </Field>
          <Field label="GitHub">
            <input type="text" className={inputCls} placeholder="github.com/username"
              value={form.github ?? ''} onChange={e => setForm({ github: e.target.value })} />
          </Field>
          <Field label="LinkedIn">
            <input type="text" className={inputCls} placeholder="linkedin.com/in/name"
              value={form.linkedin ?? ''} onChange={e => setForm({ linkedin: e.target.value })} />
          </Field>
        </div>

        {/* ── 自我介紹 ── */}
        <Field label="自我介紹">
          <textarea rows={3} className={inputCls + ' resize-none'} placeholder="輸入自我介紹…"
            value={form.bio ?? ''} onChange={e => setForm({ bio: e.target.value })} />
        </Field>

        {/* ── 技能 ── */}
        <Field label="技能">
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[44px]">
            {skillOptions.map(skill => {
              const selected = (form.skills ?? []).includes(skill.id);
              return (
                <span key={skill.id}
                  onClick={() => {
                    const curr = form.skills ?? [];
                    setForm({ skills: selected ? curr.filter(id => id !== skill.id) : [...curr, skill.id] });
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all select-none border
                    ${selected ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-500'}`}>
                  {skill.skill_name}
                </span>
              );
            })}
          </div>
        </Field>

        {/* ── 角色 + 狀態 ── */}
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest -mb-2">權限設定</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="角色" required>
            <select className={inputCls + ' appearance-none'} value={form.role ?? 'member'}
              onChange={e => setForm({ role: e.target.value })}>
              <option value="admin">管理員</option>
              <option value="editor">編輯</option>
              <option value="member">會員</option>
            </select>
          </Field>
          <Field label="狀態" required>
            <select className={inputCls + ' appearance-none'} value={String(form.status ?? 1)}
              onChange={e => setForm({ status: Number(e.target.value) })}>
              <option value="1">啟用</option>
              <option value="0">停用</option>
              <option value="2">待審</option>
            </select>
          </Field>
        </div>
      </Modal>
    );
  };

  // useEffect(()=>{

  // },[])

  /* ─── Render ────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 lg:px-8 pt-6 pb-4 flex items-center gap-4">
          <div className="shrink-0 p-3 bg-rose-500 rounded-xl shadow-sm">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold text-slate-900">會員管理</h2>
            <p className="text-sm text-gray-500 mt-0.5">管理系統成員與權限設定</p>
          </div>
          <div className="ml-auto">
            <div onClick={() => setModal({ type: 'add', data: { ...EMPTY_FORM } })}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all text-sm font-medium flex items-center gap-2 shadow-sm cursor-pointer">
              <Plus className="h-4 w-4" /><span>新增會員</span>
            </div>
          </div>
        </div>
      </div>
      {/* {user?.user?.roles?.includes("sysmanager") &&
        <></>
      } */}

      <div className="px-4 lg:px-8 py-6 mx-auto">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: '總會員數', value: stats.total,   color: 'from-rose-50 to-white border-rose-100',     icon: '👥' },
            { label: '啟用中',   value: stats.active,  color: 'from-emerald-50 to-white border-emerald-100', icon: '✅' },
            { label: '待審核',   value: stats.pending, color: 'from-orange-50 to-white border-orange-100',  icon: '⏳' },
            { label: '管理員',   value: stats.admin,   color: 'from-violet-50 to-white border-violet-100',  icon: '🛡️' },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl border p-4 shadow-sm`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="搜尋姓名、Email、座號…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white shadow-sm" />
            {search && (
              <div onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div onClick={clearAll}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${!anyFilter && !search ? 'bg-rose-900 text-white border-rose-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
              全部
            </div>
            {[{ value: 'admin', label: '管理員' }, { value: 'editor', label: '編輯' }, { value: 'member', label: '會員' }].map(r => (
              <div key={r.value} onClick={() => setFilterRole(v => v === r.value ? '' : r.value)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${filterRole === r.value ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-400 hover:text-rose-600'}`}>
                {r.label}
              </div>
            ))}
            {[{ v: '1', label: '✓ 啟用', on: 'bg-emerald-600 text-white border-emerald-600', off: 'hover:border-emerald-400 hover:text-emerald-700' },
              { v: '0', label: '⊘ 停用', on: 'bg-slate-500 text-white border-slate-500',   off: 'hover:border-slate-400' },
              { v: '2', label: '⏳ 待審', on: 'bg-orange-500 text-white border-orange-500', off: 'hover:border-orange-400 hover:text-orange-600' },
            ].map(({ v, label, on, off }) => (
              <div key={v} onClick={() => setFilterStatus(s => s === v ? '' : v)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${filterStatus === v ? on : `bg-white text-slate-600 border-slate-200 ${off}`}`}>
                {label}
              </div>
            ))}
            {(anyFilter || search) && (
              <div onClick={clearAll} className="ml-auto flex items-center gap-1 px-2.5 py-2 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                <X className="w-3 h-3" /> 清除篩選
              </div>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="h-12 bg-rose-400 text-xs text-white">
                  {['座號', '姓名', 'Email', '開發主力', '技能', '角色', '狀態', '加入日期', '操作'].map(h => (
                    <th key={h} className="px-3 py-3 text-center font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pageItems.length === 0 ? (
                  <tr><td colSpan={9} className="py-16 text-center text-slate-400 text-sm">
                    <div className="text-3xl mb-2">👥</div>查無符合條件的會員
                  </td></tr>
                ) : pageItems.map((m) => {
                  const role        = ROLE_CONFIG[m.role]   ?? ROLE_CONFIG.member;
                  const status      = STATUS_CONFIG[m.status] ?? STATUS_CONFIG[0];
                  const avatarColor = AVATAR_COLORS[(m.member_id - 1) % AVATAR_COLORS.length];
                  const position    = positionList.find(p => p.value === m.position_id);
                  const memberSkills = skillOptions.filter(s => (m.skills ?? []).includes(s.id));
                  return (
                    <tr key={m.member_id}
                      className="transition-colors duration-100 odd:bg-[rgb(255,248,248)] even:bg-white hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 cursor-pointer"
                      onDoubleClick={() => setModal({ type: 'edit', data: { ...m } })}>

                      {/* 座號 */}
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-300 shrink-0" />
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">{m.seat_number}</span>
                        </div>
                      </td>

                      {/* 姓名 */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor}`}>
                            {m.user_name[0]}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-800 whitespace-nowrap">{m.user_name}</div>
                            {m.user_nick_name && <div className="text-[11px] text-slate-400">{m.user_nick_name}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-3 py-3 text-center text-slate-500 text-xs font-mono whitespace-nowrap">{m.email}</td>

                      {/* 開發主力 */}
                      <td className="px-3 py-3 text-center">
                        {position
                          ? <span className="text-xs text-slate-600 whitespace-nowrap">{position.label}</span>
                          : <span className="text-slate-300 text-xs">—</span>}
                      </td>

                      {/* 技能 */}
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1 justify-center max-w-[160px] mx-auto">
                          {memberSkills.length === 0
                            ? <span className="text-slate-300 text-xs">—</span>
                            : memberSkills.slice(0, 3).map(s => (
                              <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 whitespace-nowrap">
                                {s.skill_name}
                              </span>
                            ))}
                          {memberSkills.length > 3 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                              +{memberSkills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 角色 */}
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${role.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${role.dot}`} />{role.label}
                        </span>
                      </td>

                      {/* 狀態 */}
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${status.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />{status.label}
                        </span>
                      </td>

                      {/* 加入日期 */}
                      <td className="px-3 py-3 text-center text-slate-500 text-xs whitespace-nowrap">{m.joined}</td>

                      {/* 操作 */}
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <div className="p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-400 transition-all cursor-pointer"
                            onClick={e => { e.stopPropagation(); setModal({ type: 'edit', data: { ...m } }); }}>
                            <Pen className="w-3.5 h-3.5" />
                          </div>
                          <div className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-400 transition-all cursor-pointer"
                            onClick={e => { e.stopPropagation(); setModal({ type: 'delete', data: m }); }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
            <span className="text-xs text-slate-400">
              共 <span className="font-semibold text-slate-600">{filtered.length}</span> 筆 ／
              第 <span className="font-semibold text-slate-600">{safePage}</span> / <span className="font-semibold text-slate-600">{totalPages}</span> 頁
            </span>
            <div className="flex items-center gap-1">
              <div onClick={() => { if (page > 1) setPage(p => p - 1); }}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" />
              </div>
              {pageNumbers().map((p, i) =>
                p === '…'
                  ? <span key={`e${i}`} className="px-1.5 text-xs text-slate-400">…</span>
                  : <div key={p} onClick={() => setPage(p)}
                    className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-semibold transition-all flex justify-center items-center cursor-pointer
                      ${p === safePage ? 'bg-rose-500 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-rose-100 hover:border-rose-300'}`}>
                    {p}
                  </div>
              )}
              <div onClick={() => { if (page < totalPages) setPage(p => p + 1); }}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
}
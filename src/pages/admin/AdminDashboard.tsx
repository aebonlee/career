import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import '../../styles/admin.css';

type Tab = 'members' | 'stats';
const PER_PAGE = 10;

interface MemberRow {
  id: string;
  display_name: string | null;
  email: string | null;
  provider: string | null;
  role: string | null;
  created_at: string | null;
  last_login_at: string | null;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('members');
  const [stats, setStats] = useState({ members: 0 });
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberPage, setMemberPage] = useState(1);
  const [memberLoading, setMemberLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { count } = await supabase.from('user_profiles').select('id', { count: 'exact', head: true }).contains('visited_sites', [window.location.hostname]);
      setStats({ members: count || 0 });
    })();
  }, []);

  const loadMembers = useCallback(async () => {
    if (!supabase) return;
    setMemberLoading(true);
    const { data } = await supabase
      .from('user_profiles')
      .select('id, display_name, email, provider, role, created_at, last_login_at')
      .order('created_at', { ascending: false });
    setMembers((data || []) as MemberRow[]);
    setMemberLoading(false);
  }, []);

  useEffect(() => { if (tab === 'members') loadMembers(); }, [tab, loadMembers]);

  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return members;
    const q = memberSearch.trim().toLowerCase();
    return members.filter(
      (m) => (m.display_name || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q)
    );
  }, [members, memberSearch]);

  const pagedMembers = useMemo(() => {
    const start = (memberPage - 1) * PER_PAGE;
    return filteredMembers.slice(start, start + PER_PAGE);
  }, [filteredMembers, memberPage]);
  const memberTotalPages = Math.max(1, Math.ceil(filteredMembers.length / PER_PAGE));

  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString() : '-';

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'members', label: '회원관리', icon: '👥' },
    { key: 'stats', label: '통계', icon: '📊' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>ADMIN</h3>
        <ul className="admin-nav">
          {tabs.map((t) => (
            <li key={t.key}>
              <button className={`admin-nav-item${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                <span>{t.icon}</span> {t.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="admin-main">
        <div className="admin-header"><h1>관리자 대시보드</h1></div>

        <div className="admin-dashboard-stats">
          <div className="admin-stat-card-v2"><div className="stat-label">총 회원수</div><div className="stat-value">{stats.members.toLocaleString()}</div></div>
        </div>

        {tab === 'members' && (
          <>
            <div className="admin-toolbar-v2">
              <input type="text" placeholder="이름 또는 이메일 검색..." value={memberSearch} onChange={(e) => { setMemberSearch(e.target.value); setMemberPage(1); }} />
            </div>
            <div className="admin-table-wrapper">
              {memberLoading ? (<div className="admin-empty"><div className="loading-spinner" /></div>) : (
                <table className="admin-table">
                  <thead><tr><th>이름</th><th>이메일</th><th>가입수단</th><th>역할</th><th>가입일</th><th>최근 로그인</th></tr></thead>
                  <tbody>
                    {pagedMembers.length === 0 ? (
                      <tr><td colSpan={6} className="admin-empty">회원이 없습니다.</td></tr>
                    ) : pagedMembers.map((m) => (
                      <tr key={m.id}>
                        <td>{m.display_name || '-'}</td><td>{m.email || '-'}</td><td>{m.provider || 'email'}</td>
                        <td><span className={`badge ${m.role === 'admin' ? 'badge-admin' : 'badge-member'}`}>{m.role || 'member'}</span></td>
                        <td>{fmt(m.created_at)}</td><td>{fmt(m.last_login_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {memberTotalPages > 1 && (<div className="admin-pagination"><button disabled={memberPage <= 1} onClick={() => setMemberPage(memberPage - 1)}>이전</button><span>{memberPage} / {memberTotalPages}</span><button disabled={memberPage >= memberTotalPages} onClick={() => setMemberPage(memberPage + 1)}>다음</button></div>)}
          </>
        )}

        {tab === 'stats' && (
          <div className="admin-table-wrapper" style={{ padding: 32 }}>
            <h2 style={{ marginBottom: 24 }}>사이트 통계 요약</h2>
            <table className="admin-table">
              <thead><tr><th>항목</th><th>수량</th></tr></thead>
              <tbody>
                <tr><td>총 회원수</td><td><strong>{stats.members.toLocaleString()}</strong></td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

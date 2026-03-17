import { useState } from 'react';
import Tabs from '../components/common/Tabs';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatPrice, getBookingStatusLabel, getDocumentStatusLabel } from '../utils';

const mockUpcoming = [
  { id: '1', menteeName: '정하윤', service: '진로상담', date: '2025-03-20', time: '14:00', duration: 50, status: 'confirmed' },
  { id: '2', menteeName: '김도현', service: '커리어 컨설팅', date: '2025-03-22', time: '10:00', duration: 80, status: 'confirmed' },
];

const mockDocQueue = [
  { id: '1', submitter: '이서연', name: '이력서_이서연.pdf', type: 'resume', status: 'submitted', date: '2025-03-16' },
  { id: '2', submitter: '박민수', name: '자소서_박민수.docx', type: 'cover_letter', status: 'submitted', date: '2025-03-15' },
];

const tabs = [
  { key: 'schedule', label: '스케줄 관리' },
  { key: 'upcoming', label: '예정 상담' },
  { key: 'documents', label: '서류 리뷰' },
  { key: 'revenue', label: '수익 통계' },
];

export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <>
      <div className="page-header">
        <div className="container"><h1>멘토 대시보드</h1></div>
      </div>

      <section className="section">
        <div className="container">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div style={{ marginTop: 32 }}>
            {activeTab === 'schedule' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>시간 슬롯 관리</h3>
                  <Button size="sm">새 슬롯 추가</Button>
                </div>
                <Card padding="lg">
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>
                    캘린더 뷰에서 상담 가능한 시간 슬롯을 등록하고 관리할 수 있습니다.
                    <br />Supabase 연동 후 활성화됩니다.
                  </p>
                </Card>
              </div>
            )}

            {activeTab === 'upcoming' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mockUpcoming.map(b => (
                  <Card key={b.id} padding="md">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <h4 style={{ fontWeight: 700 }}>{b.service}</h4>
                          <Badge variant="info" size="sm">{getBookingStatusLabel(b.status)}</Badge>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          멘티: {b.menteeName} &middot; {b.date} {b.time} &middot; {b.duration}분
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">상세 보기</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'documents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mockDocQueue.map(d => (
                  <Card key={d.id} padding="md">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <i className={d.type === 'resume' ? 'fa-solid fa-file-lines' : 'fa-solid fa-pen-fancy'} style={{ fontSize: 24 }} />
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{d.name}</h4>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>제출자: {d.submitter} &middot; {d.date}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Badge variant="warning" size="sm">{getDocumentStatusLabel(d.status)}</Badge>
                        <Button size="sm">리뷰 시작</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'revenue' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                  {[
                    { label: '총 수익', value: formatPrice(2850000), color: 'var(--primary)' },
                    { label: '이번 달', value: formatPrice(450000), color: 'var(--success)' },
                    { label: '정산 대기', value: formatPrice(185000), color: 'var(--warning)' },
                    { label: '완료 상담', value: '47건', color: 'var(--info)' },
                  ].map(stat => (
                    <Card key={stat.label} padding="md">
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)', marginBottom: 4 }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

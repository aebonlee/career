import { useState } from 'react';
import Tabs from '../components/common/Tabs';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatPrice, formatDate, getBookingStatusLabel, getPaymentStatusLabel, getDocumentStatusLabel } from '../utils';

const mockBookings = [
  { id: '1', mentorName: '김진영', service: '진로상담', date: '2025-03-20', time: '14:00', duration: 50, status: 'confirmed', zoomUrl: 'https://zoom.us/j/123', price: 60000 },
  { id: '2', mentorName: '박수현', service: '이력서 진단', date: '2025-03-15', time: '10:00', duration: 30, status: 'completed', price: 40000 },
  { id: '3', mentorName: '이민지', service: '모의면접', date: '2025-03-25', time: '16:00', duration: 80, status: 'pending', price: 85000 },
];

const mockDocuments = [
  { id: '1', name: '이력서_2025.pdf', type: 'resume', status: 'reviewed', date: '2025-03-10' },
  { id: '2', name: '자기소개서_최종.docx', type: 'cover_letter', status: 'in_review', date: '2025-03-14' },
];

const mockPayments = [
  { id: '1', date: '2025-03-14', service: '진로상담 50분', amount: 60000, status: 'paid' },
  { id: '2', date: '2025-03-10', service: '이력서 진단 30분', amount: 40000, status: 'paid' },
];

const statusVariant = { pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'error' };
const docVariant = { submitted: 'warning', in_review: 'info', reviewed: 'success' };
const payVariant = { pending: 'warning', paid: 'success', failed: 'error', refunded: 'neutral' };

const tabs = [
  { key: 'bookings', label: '예약 관리' },
  { key: 'documents', label: '서류 관리' },
  { key: 'payments', label: '결제 내역' },
  { key: 'messages', label: '메시지' },
];

export default function MenteeDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <>
      <div className="page-header">
        <div className="container"><h1>대시보드</h1></div>
      </div>

      <section className="section">
        <div className="container">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div style={{ marginTop: 32 }}>
            {activeTab === 'bookings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mockBookings.map(b => (
                  <Card key={b.id} padding="md" className="booking-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <h4 style={{ fontWeight: 700 }}>{b.service}</h4>
                          <Badge variant={statusVariant[b.status]} size="sm">{getBookingStatusLabel(b.status)}</Badge>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {b.mentorName} &middot; {b.date} {b.time} &middot; {b.duration}분
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(b.price)}</p>
                        {b.zoomUrl && b.status === 'confirmed' && (
                          <a href={b.zoomUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: 'var(--info)' }}>
                            Zoom 참여
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'documents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mockDocuments.map(d => (
                  <Card key={d.id} padding="md">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{d.type === 'resume' ? '\uD83D\uDCC4' : '\u270D\uFE0F'}</span>
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{d.name}</h4>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>{d.date}</p>
                        </div>
                      </div>
                      <Badge variant={docVariant[d.status]} size="sm">{getDocumentStatusLabel(d.status)}</Badge>
                    </div>
                  </Card>
                ))}
                <Button variant="secondary" style={{ alignSelf: 'flex-start' }}>새 서류 업로드</Button>
              </div>
            )}

            {activeTab === 'payments' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['날짜', '서비스', '금액', '상태'].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px', textAlign: 'left', fontWeight: 600,
                          fontSize: '0.8125rem', color: 'var(--text-light)',
                          borderBottom: '2px solid var(--border-light)',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockPayments.map(p => (
                      <tr key={p.id}>
                        <td style={{ padding: '12px 16px', fontSize: '0.9375rem', borderBottom: '1px solid var(--border-light)' }}>{p.date}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.9375rem', borderBottom: '1px solid var(--border-light)' }}>{p.service}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.9375rem', fontWeight: 600, borderBottom: '1px solid var(--border-light)' }}>{formatPrice(p.amount)}</td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
                          <Badge variant={payVariant[p.status]} size="sm">{getPaymentStatusLabel(p.status)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'messages' && (
              <EmptyState icon="\uD83D\uDCAC" title="아직 메시지가 없습니다"
                description="멘토와 상담을 예약하면 메시지를 주고받을 수 있습니다." />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

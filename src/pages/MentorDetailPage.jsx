import { useParams, Link } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import StarRating from '../components/common/StarRating';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { formatPrice } from '../utils';
import { SERVICES } from '../constants';

const mockMentor = {
  id: '1', name: '김진영', title: '진로상담전문가', institution: '서울대학교',
  credentials: '직업학박사', bio: '서울대학교에서 직업학 박사 학위를 취득하고 10년간 대학생 및 구직자 대상 진로상담을 진행해왔습니다. 한국직업상담학회 정회원이며, 다수의 기업에서 커리어 코칭을 수행한 경험이 있습니다. 개인의 강점과 가치를 기반으로 최적의 커리어 방향을 함께 설계합니다.',
  specialties: ['진로탐색', '취업전략', '경력개발', '대기업'],
  rating: 4.9, reviewCount: 128, hourlyRate: 60000,
};

const mockReviews = [
  { id: '1', name: '정하윤', rating: 5, content: '정말 도움이 많이 되었습니다. 구체적이고 실질적인 조언 감사합니다.', date: '2025-03-10' },
  { id: '2', name: '김도현', rating: 5, content: '체계적인 상담 프로세스가 인상적이었어요. 진로 방향을 확실히 잡았습니다.', date: '2025-03-05' },
  { id: '3', name: '이서연', rating: 4, content: '전문적인 시각에서 제 이력서를 분석해주셨어요. 많이 개선되었습니다.', date: '2025-02-28' },
];

export default function MentorDetailPage() {
  const { id } = useParams();

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>멘토 프로필</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
            {/* Main content */}
            <div>
              {/* Profile header */}
              <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                <Avatar name={mockMentor.name} size="xl" />
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{mockMentor.name}</h2>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{mockMentor.title}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 12 }}>
                    {mockMentor.institution} &middot; {mockMentor.credentials}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating rating={mockMentor.rating} />
                    <span style={{ fontWeight: 700 }}>{mockMentor.rating}</span>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>({mockMentor.reviewCount}개 리뷰)</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <Card padding="lg" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 12 }}>소개</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{mockMentor.bio}</p>
              </Card>

              {/* Specialties */}
              <Card padding="lg" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 12 }}>전문분야</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {mockMentor.specialties.map(s => <Badge key={s}>{s}</Badge>)}
                </div>
              </Card>

              {/* Reviews */}
              <Card padding="lg">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 20 }}>리뷰 ({mockReviews.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {mockReviews.map(r => (
                    <div key={r.id} style={{ paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <span style={{ fontWeight: 600, marginRight: 8 }}>{r.name}</span>
                          <StarRating rating={r.rating} size="sm" />
                        </div>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>{r.date}</span>
                      </div>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar - Booking CTA */}
            <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 24px)' }}>
              <Card padding="lg">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>상담 예약</h3>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 4 }}>상담료</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatPrice(mockMentor.hourlyRate)}<span style={{ fontSize: '0.875rem', fontWeight: 400 }}>/시간</span>
                  </p>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 8 }}>제공 서비스</p>
                  {SERVICES.slice(0, 3).map(s => (
                    <div key={s.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 0', borderBottom: '1px solid var(--border-light)',
                      fontSize: '0.875rem',
                    }}>
                      <span><i className={s.icon} /> {s.name}</span>
                      <span style={{ color: 'var(--text-light)' }}>{s.durations.join('/')}분</span>
                    </div>
                  ))}
                </div>
                <Link to={`/booking?mentor=${id}`}>
                  <Button variant="primary" fullWidth size="lg">상담 예약하기</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .section .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

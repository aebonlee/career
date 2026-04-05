import Avatar from '../components/common/Avatar';
import StarRating from '../components/common/StarRating';
import Card from '../components/common/Card';

const mockReviews = [
  { id: '1', mentorName: '김진영', rating: 5, content: '진로에 대해 막연하게 고민만 하고 있었는데, 구체적인 방향을 잡을 수 있었습니다. 정말 감사합니다.', date: '2025-03-10', service: '진로상담' },
  { id: '2', mentorName: '박수현', rating: 5, content: '이력서를 완전히 다시 작성하는 데 큰 도움이 되었어요. 서류 합격률이 확실히 올랐습니다.', date: '2025-03-08', service: '이력서 진단' },
  { id: '3', mentorName: '이민지', rating: 4, content: '모의면접을 통해 실전에서 자신감을 가질 수 있었습니다. 피드백이 매우 구체적이었어요.', date: '2025-03-05', service: '모의면접' },
  { id: '4', mentorName: '최서준', rating: 5, content: '커리어 전환에 대한 두려움이 있었는데, 체계적인 상담을 통해 확신을 가질 수 있게 되었습니다.', date: '2025-02-28', service: '커리어 컨설팅' },
  { id: '5', mentorName: '정하윤', rating: 5, content: '대기업 취업 준비를 위한 전략을 구체적으로 세울 수 있었습니다. 멘토님의 경험이 정말 값졌어요.', date: '2025-02-20', service: '취업전략' },
];

export default function ReviewsPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>리뷰</h1>
          <p>상담에 대한 후기를 확인하세요</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockReviews.map(r => (
              <Card key={r.id} padding="md">
                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                  <Avatar name={r.mentorName} size="md" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div>
                        <span style={{ fontWeight: 700, marginRight: 8 }}>{r.mentorName}</span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>{r.service}</span>
                      </div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>{r.date}</span>
                    </div>
                    <StarRating rating={r.rating} size="sm" />
                  </div>
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{r.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

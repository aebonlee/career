import StarRating from '../common/StarRating';

const testimonials = [
  {
    content: '김진영 멘토님 덕분에 진로 방향을 확실히 잡을 수 있었습니다. 막연했던 취업 준비가 체계적으로 바뀌었어요.',
    name: '정하윤', role: '서울대 경영학과 4학년', rating: 5,
  },
  {
    content: '이력서와 자소서를 전문가의 시선으로 진단받으니 합격률이 확실히 올랐습니다. 정말 추천합니다!',
    name: '김도현', role: '이직 준비생', rating: 5,
  },
  {
    content: '모의면접 후 실전에서 훨씬 자신감 있게 답변할 수 있었습니다. 구체적인 피드백이 큰 도움이 됐어요.',
    name: '이서연', role: '고려대 사회학과 3학년', rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">멘티들의 이야기</h2>
          <p className="section-subtitle">상담공간에서 커리어 목표를 달성한 멘티들의 후기입니다.</p>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="testimonial-card__quote">&ldquo;</div>
              <p className="testimonial-card__content">{t.content}</p>
              <div className="testimonial-card__footer">
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
                <StarRating rating={t.rating} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

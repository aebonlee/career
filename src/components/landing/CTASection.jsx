import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-section__circle cta-section__circle--1" />
      <div className="cta-section__circle cta-section__circle--2" />
      <div className="container cta-section__inner">
        <h2 className="cta-section__title">지금 바로 커리어 상담을 시작하세요</h2>
        <p className="cta-section__subtitle">전문가의 도움으로 더 나은 미래를 설계하세요</p>
        <Link to="/register" className="cta-section__btn">무료 상담 신청</Link>
      </div>
    </section>
  );
}

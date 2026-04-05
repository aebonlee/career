import { Link } from 'react-router-dom';
import { useMemo } from 'react';

function Particle({ index }) {
  const style = useMemo(() => ({
    width: 4 + Math.random() * 8,
    height: 4 + Math.random() * 8,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${4 + Math.random() * 4}s`,
    animationDelay: `${index * 0.5}s`,
  }), [index]);
  return <div className="hero__particle" style={style} />;
}

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__particles">
        {Array.from({ length: 8 }, (_, i) => <Particle key={i} index={i} />)}
      </div>

      <div className="container hero__content">
        <p className="hero__eyebrow">직업학박사와 함께하는</p>
        <h1 className="hero__title">
          당신의 커리어,<br />전문가와 함께 설계하세요
        </h1>
        <p className="hero__subtitle">
          진로상담부터 이력서 진단, 모의면접까지. 검증된 멘토와 1:1 맞춤 상담으로 커리어 목표를 달성하세요.
        </p>

        <div className="hero__cta-group">
          <Link to="/mentors" className="hero__cta hero__cta--primary">상담 예약하기</Link>
          <Link to="/services" className="hero__cta hero__cta--secondary">서비스 둘러보기</Link>
        </div>

        <div className="hero__stats">
          {[
            { num: '50+', label: '전문 멘토' },
            { num: '3,000+', label: '상담 완료' },
            { num: '4.9/5.0', label: '만족도' },
          ].map(s => (
            <div key={s.label}>
              <div className="hero__stat-value">{s.num}</div>
              <div className="hero__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

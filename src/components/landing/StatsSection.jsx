const stats = [
  { value: '50+', label: '전문 멘토' },
  { value: '3,000+', label: '상담 완료' },
  { value: '98%', label: '만족도' },
  { value: '4.9', label: '평균 평점' },
];

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-section__grid">
          {stats.map((s, i) => (
            <div key={s.label} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

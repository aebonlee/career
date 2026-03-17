const values = [
  { icon: 'fa-solid fa-graduation-cap', title: '전문성', desc: '직업학박사 학위를 보유한 전문가들이 체계적인 커리어 상담을 제공합니다.' },
  { icon: 'fa-solid fa-bullseye', title: '맞춤형', desc: '개인의 적성, 경험, 목표에 맞는 1:1 맞춤 상담을 진행합니다.' },
  { icon: 'fa-solid fa-handshake', title: '신뢰', desc: '검증된 멘토와 투명한 프로세스로 신뢰할 수 있는 서비스를 제공합니다.' },
];

const steps = [
  { num: '01', title: '상담 신청', desc: '원하는 서비스와 멘토를 선택하고 예약합니다.' },
  { num: '02', title: '멘토 매칭', desc: '전문 멘토가 배정되고 상담 일정이 확정됩니다.' },
  { num: '03', title: '상담 진행', desc: 'Zoom을 통한 1:1 화상 상담을 진행합니다.' },
  { num: '04', title: '피드백', desc: '상담 내용 정리와 후속 조언을 제공합니다.' },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>소개</h1>
          <p>상담공간을 소개합니다</p>
        </div>
      </div>

      <section className="section">
        <div className="container about-page__mission">
          <h2 className="about-page__mission-title">우리의 미션</h2>
          <p className="about-page__mission-desc">
            상담공간은 직업학 분야의 전문가들과 진로에 고민을 가진 대학생, 구직자를 연결합니다.
            체계적인 커리어 상담을 통해 모든 사람이 자신에게 맞는 직업을 찾고,
            성공적인 커리어를 설계할 수 있도록 돕는 것이 우리의 미션입니다.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">핵심 가치</h2>
          </div>
          <div className="about-page__values">
            {values.map(v => (
              <div key={v.title} className="value-card">
                <div className="value-card__icon"><i className={v.icon} /></div>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">이용 프로세스</h2>
            <p className="section-subtitle">간단한 4단계로 전문 커리어 상담을 받으세요.</p>
          </div>
          <div className="process-steps">
            {steps.map(s => (
              <div key={s.num} className="process-step">
                <div className="process-step__number">{s.num}</div>
                <h4 className="process-step__title">{s.title}</h4>
                <p className="process-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

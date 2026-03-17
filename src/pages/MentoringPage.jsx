import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatPrice } from '../utils';

const plans = [
  {
    id: 'basic',
    name: '기본 멘토링',
    icon: 'fa-solid fa-seedling',
    price: 150000,
    period: '월',
    description: '커리어 방향 설정이 필요한 분들을 위한 기본 멘토링',
    features: [
      '월 2회 1:1 화상 상담 (50분)',
      '이력서/자소서 1회 피드백',
      '커리어 로드맵 설계',
      '카카오톡 질의응답 (영업일)',
    ],
    popular: false,
  },
  {
    id: 'standard',
    name: '집중 멘토링',
    icon: 'fa-solid fa-fire',
    price: 280000,
    period: '월',
    description: '적극적인 취업 준비가 필요한 분들을 위한 집중 멘토링',
    features: [
      '월 4회 1:1 화상 상담 (50분)',
      '이력서/자소서 무제한 피드백',
      '모의면접 월 2회',
      '맞춤 기업 추천 리스트',
      '카카오톡 질의응답 (상시)',
      '온라인 강의 전체 무료 수강',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: '프리미엄 멘토링',
    icon: 'fa-solid fa-crown',
    price: 450000,
    period: '월',
    description: '취업 성공까지 올인 케어가 필요한 분들을 위한 프리미엄 멘토링',
    features: [
      '주 2회 1:1 화상 상담 (80분)',
      '이력서/자소서 무제한 피드백',
      '모의면접 무제한',
      '맞춤 기업 추천 + 지원 전략',
      '연봉 협상 코칭',
      '카카오톡 24시간 질의응답',
      '온라인 강의 전체 무료 수강',
      '취업 성공 시까지 A/S',
    ],
    popular: false,
  },
];

const process = [
  { num: '01', icon: 'fa-solid fa-clipboard-question', title: '상담 신청', desc: '간단한 설문을 통해 현재 상황과 목표를 알려주세요.' },
  { num: '02', icon: 'fa-solid fa-handshake', title: '멘토 매칭', desc: '분야와 목표에 최적화된 전문 멘토를 매칭해 드립니다.' },
  { num: '03', icon: 'fa-solid fa-route', title: '로드맵 설계', desc: '첫 상담에서 맞춤 커리어 로드맵을 함께 설계합니다.' },
  { num: '04', icon: 'fa-solid fa-trophy', title: '목표 달성', desc: '정기 상담과 지속적인 피드백으로 목표를 달성합니다.' },
];

export default function MentoringPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>1:1 맞춤 멘토링</h1>
          <p>직업학박사와 함께하는 체계적인 커리어 멘토링 프로그램</p>
        </div>
      </div>

      {/* Plans */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">멘토링 플랜</h2>
            <p className="section-subtitle">나에게 맞는 멘토링 플랜을 선택하세요.</p>
          </div>
          <div className="mentoring-plans">
            {plans.map(plan => (
              <div key={plan.id} className={`mentoring-plan${plan.popular ? ' mentoring-plan--popular' : ''}`}>
                {plan.popular && <div className="mentoring-plan__badge">인기</div>}
                <div className="mentoring-plan__icon"><i className={plan.icon} /></div>
                <h3 className="mentoring-plan__name">{plan.name}</h3>
                <p className="mentoring-plan__desc">{plan.description}</p>
                <div className="mentoring-plan__price">
                  <span className="mentoring-plan__amount">{formatPrice(plan.price)}</span>
                  <span className="mentoring-plan__period">/{plan.period}</span>
                </div>
                <ul className="mentoring-plan__features">
                  {plan.features.map((f, i) => (
                    <li key={i}><i className="fa-solid fa-check" /> {f}</li>
                  ))}
                </ul>
                <Link to="/mentors">
                  <Button variant={plan.popular ? 'primary' : 'secondary'} fullWidth>
                    시작하기
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">진행 과정</h2>
            <p className="section-subtitle">간단한 4단계로 1:1 맞춤 멘토링을 시작하세요.</p>
          </div>
          <div className="process-steps">
            {process.map(s => (
              <div key={s.num} className="process-step">
                <div className="process-step__number">{s.num}</div>
                <h4 className="process-step__title">{s.title}</h4>
                <p className="process-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>
            커리어 고민, 혼자 하지 마세요
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 520, margin: '0 auto 24px' }}>
            직업학박사가 당신의 커리어 목표 달성을 끝까지 함께합니다.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/mentors">
              <Button variant="primary">멘토 찾아보기</Button>
            </Link>
            <Link to="/courses">
              <Button variant="secondary">온라인 강의 보기</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

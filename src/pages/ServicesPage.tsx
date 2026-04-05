import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { formatPrice, formatDuration, cn } from '../utils';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const faqs = [
  { q: '상담은 어떤 방식으로 진행되나요?', a: 'Zoom을 통한 1:1 화상 상담으로 진행됩니다. 예약 확정 후 Zoom 링크가 제공됩니다.' },
  { q: '멘토는 어떻게 선발되나요?', a: '모든 멘토는 직업학 관련 석박사 학위 보유자이며, 엄격한 심사를 거쳐 선발됩니다.' },
  { q: '상담 취소 및 환불은 어떻게 하나요?', a: '상담 24시간 전까지 무료 취소가 가능합니다. 이후 취소 시 취소 수수료가 발생할 수 있습니다.' },
  { q: '이력서/자소서 진단은 어떻게 진행되나요?', a: '서류를 업로드하면 멘토가 검토 후 상세한 피드백을 제공합니다. 필요시 화상 상담도 병행합니다.' },
  { q: '한 번의 상담으로 충분한가요?', a: '한 번의 상담으로도 도움이 되지만, 체계적인 커리어 설계를 위해 정기 상담을 권장합니다.' },
];

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>서비스</h1>
          <p>전문 커리어 상담 서비스</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="services-page__grid">
            {SERVICES.map(service => (
              <Card key={service.id} padding="lg" hoverable>
                <div className="service-detail-card__icon"><i className={service.icon} /></div>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: 12 }}>{service.name}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  {service.description}
                </p>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: 8 }}>상담 시간</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {service.durations.map(d => (
                      <span key={d} className="badge badge--neutral">{formatDuration(d)}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>시작가</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(service.basePrice)}</span>
                </div>
                <Link to="/mentors">
                  <Button variant="primary" size="md" fullWidth>예약하기</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="section-header">
            <h2 className="section-title">자주 묻는 질문</h2>
          </div>
          <div className="faq-accordion">
            {faqs.map((faq, i) => (
              <div key={i} className={cn('faq-item', openFaq === i && 'faq-item--open')}>
                <button className="faq-item__question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className="faq-item__arrow">&#x25BE;</span>
                </button>
                {openFaq === i && <div className="faq-item__answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

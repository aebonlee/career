import { Link } from 'react-router-dom';
import { SERVICES } from '../../constants';
import { formatPrice } from '../../utils';

export default function ServiceCards() {
  return (
    <section className="section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">맞춤형 커리어 서비스</h2>
          <p className="section-subtitle">직업학박사가 제공하는 전문 상담 서비스로 커리어 고민을 해결하세요.</p>
        </div>
        <div className="service-cards__grid">
          {SERVICES.map((service, i) => (
            <Link
              key={service.id}
              to="/services"
              className="service-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="service-card__icon"><i className={service.icon} /></div>
              <h3 className="service-card__title">{service.name}</h3>
              <p className="service-card__desc">{service.description}</p>
              <div className="service-card__meta">
                <span className="service-card__duration">{service.durations.join('/')}분</span>
                <span className="service-card__price">{formatPrice(service.basePrice)}~</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

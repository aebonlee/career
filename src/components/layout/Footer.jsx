import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <div className="footer__brand-logo">
              <span className="footer__brand-primary">상담</span>
              <span className="footer__brand-secondary">공간</span>
            </div>
            <p className="footer__brand-desc">
              직업학박사와 함께하는 커리어 상담 플랫폼. 전문가의 도움으로 더 나은 미래를 설계하세요.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer__heading">서비스</h4>
            {['진로상담', '이력서 진단', '커리어 컨설팅', '모의면접'].map(s => (
              <Link key={s} to="/services" className="footer__link">{s}</Link>
            ))}
          </div>

          {/* Info */}
          <div>
            <h4 className="footer__heading">안내</h4>
            <Link to="#" className="footer__link">이용약관</Link>
            <Link to="#" className="footer__link">개인정보처리방침</Link>
            <Link to="/guides" className="footer__link">학습가이드</Link>
            <Link to="/about" className="footer__link">소개</Link>
          </div>

          {/* Support */}
          <div>
            <h4 className="footer__heading">고객지원</h4>
            <p className="footer__contact">support@sangdam.space</p>
            <p className="footer__contact">02-1234-5678</p>
            <p className="footer__contact footer__contact--small">평일 09:00 - 18:00</p>
          </div>
        </div>

        <div className="footer__bottom">
          &copy; 2025 상담공간. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

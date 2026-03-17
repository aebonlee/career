import { useSearchParams, Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function BookingConfirmPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const isSuccess = status === 'success';

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className={`confirm-card__icon ${isSuccess ? 'confirm-card__icon--success' : 'confirm-card__icon--error'}`}>
          {isSuccess ? '\u2713' : '\u2717'}
        </div>
        <h2 className="confirm-card__title">
          {isSuccess ? '예약이 확정되었습니다' : '결제에 실패했습니다'}
        </h2>
        <p className="confirm-card__desc">
          {isSuccess
            ? '상담 시간에 맞춰 Zoom 링크가 이메일로 발송됩니다. 대시보드에서 예약 내역을 확인하세요.'
            : '결제 과정에서 문제가 발생했습니다. 다시 시도해 주세요.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard">
            <Button variant={isSuccess ? 'primary' : 'secondary'}>대시보드로 이동</Button>
          </Link>
          {!isSuccess && (
            <Link to="/mentors">
              <Button variant="primary">다시 예약하기</Button>
            </Link>
          )}
          <Link to="/">
            <Button variant="ghost">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

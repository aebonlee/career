import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <h1 className="not-found__title">페이지를 찾을 수 없습니다</h1>
      <p className="not-found__desc">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
      <Link to="/">
        <Button variant="primary">홈으로 돌아가기</Button>
      </Link>
    </div>
  );
}

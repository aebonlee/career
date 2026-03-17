import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function LoginPage() {
  const { signIn, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page" style={{ background: 'var(--bg-light)' }}>
      <div className="auth-card">
        <h1 className="auth-card__title">로그인</h1>
        <p className="auth-card__subtitle">상담공간에 오신 것을 환영합니다</p>

        {error && <div className="auth-card__error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="이메일" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com" required />
          <Input label="비밀번호" type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요" required />
          <Button type="submit" fullWidth loading={loading} style={{ marginBottom: 8 }}>로그인</Button>
        </form>

        <div className="auth-divider">또는</div>

        <div className="auth-social-btns" style={{ flexDirection: 'column' }}>
          <button className="auth-social-btn" onClick={() => signInWithOAuth('google')}>
            Google로 로그인
          </button>
          <button
            className="auth-social-btn"
            style={{ background: '#FEE500', borderColor: '#FEE500', color: '#3C1E1E' }}
            onClick={() => signInWithOAuth('kakao')}
          >
            카카오로 로그인
          </button>
        </div>

        <div className="auth-footer">
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </div>
      </div>
    </section>
  );
}

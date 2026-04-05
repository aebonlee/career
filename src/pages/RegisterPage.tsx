import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { cn } from '../utils';

export default function RegisterPage() {
  const { signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', passwordConfirm: '', role: 'mentee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.fullName);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page" style={{ background: 'var(--bg-light)' }}>
      <div className="auth-card">
        <h1 className="auth-card__title">회원가입</h1>
        <p className="auth-card__subtitle">상담공간에 가입하고 커리어를 설계하세요</p>

        {error && <div className="auth-card__error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input label="이름" value={form.fullName} onChange={set('fullName')} placeholder="홍길동" required />
          <Input label="이메일" type="email" value={form.email} onChange={set('email')} placeholder="example@email.com" required />
          <Input label="비밀번호" type="password" value={form.password} onChange={set('password')} placeholder="6자 이상" required />
          <Input label="비밀번호 확인" type="password" value={form.passwordConfirm} onChange={set('passwordConfirm')} placeholder="비밀번호를 다시 입력하세요" required />

          <div style={{ marginBottom: 20 }}>
            <label className="form-label">가입 유형</label>
            <div className="role-selector">
              {[
                { value: 'mentee', icon: 'fa-solid fa-user', label: '멘티 (상담받기)' },
                { value: 'mentor', icon: 'fa-solid fa-graduation-cap', label: '멘토 (상담하기)' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn('role-option', form.role === opt.value && 'role-option--selected')}
                  onClick={() => setForm(p => ({ ...p, role: opt.value }))}
                >
                  <div className="role-option__icon"><i className={opt.icon} /></div>
                  <div className="role-option__label">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading} style={{ marginBottom: 8 }}>회원가입</Button>
        </form>

        <div className="auth-divider">또는</div>

        <div className="auth-social-btns" style={{ flexDirection: 'column' }}>
          <button className="auth-social-btn" onClick={() => signInWithOAuth('google')}>
            Google로 가입
          </button>
          <button
            className="auth-social-btn"
            style={{ background: '#FEE500', borderColor: '#FEE500', color: '#3C1E1E' }}
            onClick={() => signInWithOAuth('kakao')}
          >
            카카오로 가입
          </button>
        </div>

        <div className="auth-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';

export default function ProfilePage() {
  const { profile, updateProfile, isMentor } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await updateProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>프로필</h1>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 640 }}>
          {/* Profile header */}
          <Card padding="lg" className="profile-header" style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Avatar src={profile?.avatar_url} name={profile?.full_name} size="xl" />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: 4 }}>{profile?.full_name}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{profile?.email}</p>
            <Badge variant={isMentor ? 'primary' : 'info'}>
              {isMentor ? '멘토' : '멘티'}
            </Badge>
          </Card>

          {/* Edit form */}
          <Card padding="lg">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 24 }}>프로필 수정</h3>

            {success && (
              <div style={{
                padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 20,
                background: 'var(--success-light)', color: 'var(--success)', fontSize: '0.875rem',
              }}>프로필이 저장되었습니다.</div>
            )}

            <form onSubmit={handleSave}>
              <Input label="이름" value={form.full_name} onChange={set('full_name')} required />
              <Input label="전화번호" value={form.phone} onChange={set('phone')} placeholder="010-0000-0000" />
              <Input label="자기소개" type="textarea" value={form.bio} onChange={set('bio')}
                placeholder="간단한 자기소개를 작성해주세요" />
              <Button type="submit" fullWidth loading={loading} style={{ marginTop: 8 }}>저장</Button>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}

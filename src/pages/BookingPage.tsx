import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { SERVICES } from '../constants';
import { formatPrice, formatDuration, generateMerchantUid } from '../utils';
import { usePayment } from '../hooks/usePayment';
import { useAuth } from '../contexts/AuthContext';

const timeSlots = [
  { id: '1', label: '09:00', period: 'morning' },
  { id: '2', label: '10:00', period: 'morning' },
  { id: '3', label: '11:00', period: 'morning' },
  { id: '4', label: '14:00', period: 'afternoon' },
  { id: '5', label: '15:00', period: 'afternoon' },
  { id: '6', label: '16:00', period: 'afternoon' },
  { id: '7', label: '19:00', period: 'evening' },
  { id: '8', label: '20:00', period: 'evening' },
];

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { requestPayment, loading: payLoading } = usePayment();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const mentorId = searchParams.get('mentor') || '1';

  // Calendar - simple current month view
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  const calcPrice = () => {
    if (!selectedService || !selectedDuration) return 0;
    const svc = SERVICES.find(s => s.id === selectedService);
    const baseIdx = svc.durations.indexOf(selectedDuration);
    return svc.basePrice + baseIdx * 15000;
  };

  const handlePayment = async () => {
    const amount = calcPrice();
    const svc = SERVICES.find(s => s.id === selectedService);
    try {
      await requestPayment({
        name: `${svc.name} ${formatDuration(selectedDuration)}`,
        amount,
        buyerName: profile?.full_name || '',
        buyerEmail: profile?.email || '',
        buyerTel: profile?.phone || '',
        merchantUid: generateMerchantUid(),
      });
      navigate('/booking/confirm?status=success');
    } catch {
      navigate('/booking/confirm?status=fail');
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>상담 예약</h1>
          <p>Step {step} / 3</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          {/* Step indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
            {['서비스 선택', '일정 선택', '결제'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700,
                  background: step > i ? 'var(--primary)' : step === i + 1 ? 'var(--primary)' : 'var(--bg-light)',
                  color: step >= i + 1 ? '#fff' : 'var(--text-light)',
                }}>{i + 1}</div>
                <span style={{ fontSize: '0.8125rem', color: step === i + 1 ? 'var(--primary)' : 'var(--text-light)' }}>{s}</span>
                {i < 2 && <div style={{ width: 40, height: 2, background: 'var(--border-light)' }} />}
              </div>
            ))}
          </div>

          {/* Step 1: Service */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 20 }}>서비스와 시간을 선택하세요</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {SERVICES.map(svc => (
                  <Card key={svc.id} hoverable padding="md"
                    onClick={() => setSelectedService(svc.id)}
                    style={{
                      border: selectedService === svc.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <i className={svc.icon} style={{ fontSize: 28 }} />
                        <div>
                          <h4 style={{ fontWeight: 700 }}>{svc.name}</h4>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>{svc.description}</p>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(svc.basePrice)}~</span>
                    </div>
                  </Card>
                ))}
              </div>
              {selectedService && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontWeight: 600, marginBottom: 12 }}>상담 시간</h4>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {SERVICES.find(s => s.id === selectedService)?.durations.map(d => (
                      <button key={d} onClick={() => setSelectedDuration(d)} style={{
                        padding: '10px 24px', borderRadius: 'var(--radius-md)', fontWeight: 600,
                        border: selectedDuration === d ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        background: selectedDuration === d ? 'var(--primary-bg)' : 'var(--bg-white)',
                        color: selectedDuration === d ? 'var(--primary)' : 'var(--text-primary)',
                        cursor: 'pointer',
                      }}>{formatDuration(d)}</button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setStep(2)} disabled={!selectedService || !selectedDuration}>
                  다음 단계
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Calendar */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 20 }}>날짜와 시간을 선택하세요</h3>
              <Card padding="lg" style={{ marginBottom: 24 }}>
                <h4 style={{ textAlign: 'center', fontWeight: 700, marginBottom: 16 }}>{monthName}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
                  {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                    <div key={d} style={{ padding: 8, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-light)' }}>{d}</div>
                  ))}
                  {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isPast = day < now.getDate();
                    const isSelected = selectedDate === day;
                    return (
                      <button key={day} disabled={isPast} onClick={() => setSelectedDate(day)}
                        className="calendar-day" style={{
                          padding: 10, borderRadius: 'var(--radius-sm)', fontSize: '0.875rem',
                          fontWeight: isSelected ? 700 : 400, cursor: isPast ? 'not-allowed' : 'pointer',
                          background: isSelected ? 'var(--primary)' : 'transparent',
                          color: isSelected ? '#fff' : isPast ? 'var(--text-muted)' : 'var(--text-primary)',
                          border: 'none', transition: 'all 0.15s',
                        }}>{day}</button>
                    );
                  })}
                </div>
              </Card>

              {selectedDate && (
                <Card padding="lg">
                  <h4 style={{ fontWeight: 600, marginBottom: 12 }}>시간 선택</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {timeSlots.map(slot => (
                      <button key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                        className="time-slot" style={{
                          padding: '10px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem',
                          fontWeight: selectedSlot === slot.id ? 700 : 400, cursor: 'pointer',
                          background: selectedSlot === slot.id ? 'var(--primary)' : 'var(--bg-light)',
                          color: selectedSlot === slot.id ? '#fff' : 'var(--text-primary)',
                          border: selectedSlot === slot.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                          transition: 'all 0.15s',
                        }}>{slot.label}</button>
                    ))}
                  </div>
                </Card>
              )}

              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="ghost" onClick={() => setStep(1)}>이전</Button>
                <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedSlot}>다음 단계</Button>
              </div>
            </div>
          )}

          {/* Step 3: Summary & Pay */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 20 }}>예약 확인</h3>
              <Card padding="lg" style={{ marginBottom: 24 }}>
                {[
                  { label: '서비스', value: SERVICES.find(s => s.id === selectedService)?.name },
                  { label: '시간', value: formatDuration(selectedDuration) },
                  { label: '날짜', value: `${year}년 ${month + 1}월 ${selectedDate}일` },
                  { label: '시간대', value: timeSlots.find(s => s.id === selectedSlot)?.label },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '12px 0',
                    borderBottom: '1px solid var(--border-light)',
                  }}>
                    <span style={{ color: 'var(--text-light)' }}>{item.label}</span>
                    <span style={{ fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 700 }}>총 결제금액</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(calcPrice())}</span>
                </div>
              </Card>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="ghost" onClick={() => setStep(2)}>이전</Button>
                <Button onClick={handlePayment} loading={payLoading} size="lg">결제하기</Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

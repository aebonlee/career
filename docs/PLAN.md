# 상담공간 (Counseling Space) - 커리어 상담 플랫폼 구현 계획

## 프로젝트 개요
직업학박사들이 대학생 및 구직자에게 진로상담, 커리어상담, 이력서/자소서 진단, 1:1 맞춤 컨설팅을 제공하는 멘토-멘티 협업 플랫폼.
D:\coding (DreamIT) 프로젝트의 디자인 시스템을 기반으로 React + Vite + Supabase 스택으로 구축.

---

## 기술 스택
| 카테고리 | 기술 |
|---------|------|
| 프론트엔드 | React 19 + Vite 8 + React Router v7 |
| 백엔드 | Supabase (Auth, DB, Storage, Realtime, Edge Functions) |
| 스타일링 | Pure CSS with CSS Variables + BEM 네이밍 (no Tailwind) |
| 결제 | PortOne/I'mport (Inicis) |
| 화상회의 | Zoom API (Edge Functions, Server-to-Server OAuth) |
| 문자알림 | CoolSMS (Edge Functions) |
| 폰트 | Noto Sans KR (Google Fonts) |
| 배포 | Vercel |

---

## 구현 단계 (10 Phases)

### Phase 1: Project Scaffolding
- Vite + React 초기화, 의존성 설치 (`react-router-dom`, `@supabase/supabase-js`, `date-fns`)
- `.env` 설정, CSS 디자인 시스템 (11개 파일), Supabase 클라이언트
- 상수/유틸리티 파일, 라우터 + lazy loading, `index.html` (OG 태그, 폰트, PortOne SDK)

### Phase 2: Design System Components (16개)
Button, Card, Modal, Input, Badge, Avatar, StarRating, LoadingSpinner, EmptyState, Toast, Tabs, FileUpload, Pagination, ProtectedRoute, RoleGuard, ScrollToTop

### Phase 3: Auth + Database
- Supabase 11개 테이블 + RLS 정책 + Triggers
- AuthContext, ThemeContext, NotificationContext
- 로그인/회원가입/프로필 페이지

### Phase 4: Landing Page
HeroSection (파티클), ServiceCards (4개), MentorShowcase (3명), StatsSection, TestimonialsSection, CTASection + About/Services 페이지

### Phase 5: Mentor System
멘토 목록 (필터/정렬/검색/페이지네이션), 멘토 상세 (프로필, 리뷰, 예약 CTA)

### Phase 6: Booking + Payment
3단계 예약 플로우 + PortOne 결제 + `usePayment` 훅 + payment-webhook Edge Function

### Phase 7: Zoom + SMS (Edge Functions)
create-zoom-meeting, send-sms, schedule-reminders (24h/1h 전 알림)

### Phase 8: Dashboards
멘티 (예약/서류/결제/메시지), 멘토 (스케줄/상담/서류리뷰/수익)

### Phase 9: Documents + Reviews + Messaging
이력서/자소서 업로드→멘토 리뷰→피드백, 리뷰 시스템, Supabase Realtime 메시징

### Phase 10: Polish
다크모드, 반응형 (480/768/1024/1200px), SEO/OG, 접근성, 성능 최적화

---

## 데이터베이스 스키마 (핵심 테이블)

| 테이블 | 주요 컬럼 | 설명 |
|--------|----------|------|
| `profiles` | id, email, full_name, phone, avatar_url, role, bio | 사용자 프로필 |
| `mentors` | profile_id, title, credentials, institution, specialties[], hourly_rate, rating_avg | 멘토 정보 |
| `services` | name, slug, description, durations[], base_price | 서비스 목록 |
| `time_slots` | mentor_id, start_time, end_time, is_booked | 예약 가능 시간 |
| `bookings` | mentee_id, mentor_id, service_id, time_slot_id, status, zoom_meeting_url | 예약 내역 |
| `payments` | booking_id, imp_uid, merchant_uid, amount, status, pg_response | 결제 내역 |
| `documents` | submitter_id, reviewer_id, type, file_url, status, feedback | 서류 관리 |
| `reviews` | booking_id, reviewer_id, mentor_id, rating(1-5), content | 리뷰 |
| `messages` | sender_id, receiver_id, content, is_read | 메시지 (Realtime) |
| `notifications` | user_id, type, title, body, is_read, sms_sent | 알림 (Realtime) |

---

## 라우팅 구조
```
/ ─────────────────── HomePage (랜딩)
/about ────────────── AboutPage (소개)
/services ─────────── ServicesPage (서비스 안내)
/mentors ──────────── MentorListPage (멘토 목록)
/mentors/:id ──────── MentorDetailPage (멘토 상세)
/booking ──────────── BookingPage (예약) ⟵ Protected
/booking/confirm ──── BookingConfirmPage (예약확인) ⟵ Protected
/login ────────────── LoginPage (로그인)
/register ─────────── RegisterPage (회원가입)
/profile ──────────── ProfilePage (프로필) ⟵ Protected
/dashboard ────────── MenteeDashboard ⟵ Protected, Role: mentee
/mentor-dashboard ──── MentorDashboard ⟵ Protected, Role: mentor
/reviews ──────────── ReviewsPage ⟵ Protected
```

---

## 환경변수

### 프론트엔드 (.env)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_IMP_CODE=imp00000000
VITE_PG_PROVIDER=html5_inicis
VITE_SITE_URL=http://localhost:5173
```

### Edge Functions (Supabase Dashboard → Settings)
```
IMP_KEY=your-iamport-api-key
IMP_SECRET=your-iamport-api-secret
ZOOM_ACCOUNT_ID=your-zoom-account-id
ZOOM_CLIENT_ID=your-zoom-client-id
ZOOM_CLIENT_SECRET=your-zoom-client-secret
COOLSMS_API_KEY=your-coolsms-api-key
COOLSMS_API_SECRET=your-coolsms-api-secret
COOLSMS_SENDER=01012345678
```

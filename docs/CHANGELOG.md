# Changelog - 상담공간 (Counseling Space)

## v1.0.0 - Initial Release (2025-03-18)

### Phase 1: Project Scaffolding
- Vite 8 + React 19 프로젝트 초기화
- 의존성: react-router-dom, @supabase/supabase-js, date-fns
- CSS 디자인 시스템: variables, reset, typography, utilities, animations
- Supabase 클라이언트 싱글톤 (`src/lib/supabase.js`)
- 상수 파일 (SERVICES, SPECIALTIES, NAV_LINKS, BOOKING_STATUS 등)
- 유틸리티 함수 (formatPrice, formatDate, cn, debounce 등)
- React Router v7 라우팅 + lazy loading
- index.html (Noto Sans KR, PortOne SDK, OG 태그)
- `@` path alias 설정 (vite.config.js)

### Phase 2: Design System Components
16개 공통 UI 컴포넌트:
- Button (primary/secondary/ghost/danger, 3 sizes)
- Card (hoverable, padding variants)
- Modal (overlay, size variants, body scroll lock)
- Input (text/textarea/select, icon, error state)
- Badge (6 color variants)
- Avatar (image or initial fallback, deterministic color)
- StarRating (display/interactive mode)
- LoadingSpinner, EmptyState, Toast (Provider + hook)
- Tabs, FileUpload (drag & drop), Pagination
- ProtectedRoute, RoleGuard, ScrollToTop

### Phase 3: Auth + Database
- **Supabase 스키마**: 11개 테이블 (profiles, mentors, services, time_slots, bookings, payments, documents, reviews, messages, notifications)
- **RLS 정책**: 모든 테이블에 Row Level Security 적용
- **Triggers**: handle_new_user, update_updated_at, update_mentor_rating
- **Realtime**: messages, notifications 테이블
- **Seed Data**: 4개 서비스 (진로상담, 이력서진단, 커리어컨설팅, 모의면접)
- **AuthContext**: 세션관리, 프로필, OAuth (Google/Kakao), signIn/signUp/signOut
- **ThemeContext**: 라이트/다크 모드, localStorage 저장, 시스템 설정 감지
- **NotificationContext**: Supabase Realtime 구독, 읽지 않은 알림 카운트

### Phase 4: Landing Page
- HeroSection: 파티클 애니메이션, 그라데이션 배경, CTA, 통계
- ServiceCards: 4개 서비스 카드 (fadeInUp 애니메이션)
- MentorShowcase: 추천 멘토 3명 프로필
- StatsSection: 그라데이션 배경 통계 카드 4개
- TestimonialsSection: 멘티 후기 3개
- CTASection: 회원가입 유도 배너

### Phase 5: Mentor System
- MentorListPage: 검색/필터(전문분야)/정렬(평점/가격/리뷰)/페이지네이션
- MentorDetailPage: 프로필, 자격, 전문분야 배지, 리뷰, 예약 사이드바

### Phase 6: Booking + Payment
- BookingPage: 3단계 (서비스선택 -> 캘린더+시간 -> 결제요약)
- BookingConfirmPage: 성공/실패 상태 표시
- usePayment 훅: PortOne IMP SDK 연동
- payment-webhook Edge Function: I'mport 결제 검증 + 예약 확인

### Phase 7: Zoom + SMS (Edge Functions)
- create-zoom-meeting: Server-to-Server OAuth, 미팅 생성, 예약에 URL 저장
- send-sms: CoolSMS API 래퍼
- schedule-reminders: 24시간/1시간 전 알림 발송

### Phase 8: Dashboards
- MenteeDashboard: 예약목록, 서류관리, 결제내역, 메시지 (탭)
- MentorDashboard: 스케줄, 예정상담, 서류리뷰, 수익 (탭)

### Phase 9: Documents + Reviews + Messaging
- 서류 업로드/리뷰 시스템 (이력서, 자소서)
- 리뷰 페이지 (별점, 내용)
- 메시지 UI (멘티/멘토 대시보드 내)

### Phase 10: Polish
- 다크모드: CSS 변수 오버라이드 (data-theme="dark")
- 반응형: 4개 브레이크포인트 (480/768/1024/1200px)
- SEO: OG 메타태그, Twitter Card, canonical, keywords
- OG 이미지: 1200x630 PNG (자동 생성 스크립트)

### CSS Refactoring (v1.0.1)
- 전체 컴포넌트 인라인 스타일 -> CSS 클래스 마이그레이션
- BEM 네이밍 컨벤션 적용
- CSS 파일 4개 추가: components.css, layout.css, landing.css, pages.css
- hover/focus/active 의사 클래스 정상 작동
- 반응형 미디어 쿼리 CSS에서 직접 적용
- Barrel export 파일 (common/index.js, layout/index.js, landing/index.js)
- 빌드: 941 modules, 530ms, CSS 44KB + JS 404KB (gzip: 9KB + 119KB)

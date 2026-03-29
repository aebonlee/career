# 상담공간 (Counseling Space)

> 직업학박사와 함께하는 커리어 상담 플랫폼

진로상담부터 이력서 진단, 모의면접까지. 검증된 멘토와 1:1 맞춤 상담으로 커리어 목표를 달성하세요.

## 기술 스택

- **Frontend:** React 19 + Vite 8 + React Router v7
- **Backend:** Supabase (Auth, PostgreSQL, Storage, Realtime, Edge Functions)
- **Styling:** Pure CSS + CSS Variables (BEM 네이밍)
- **Payment:** PortOne/I'mport (Inicis)
- **Video:** Zoom API (Server-to-Server OAuth)
- **SMS:** CoolSMS API

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 Supabase 프로젝트 정보를 입력하세요:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_IMP_CODE=imp00000000
VITE_PG_PROVIDER=html5_inicis
VITE_SITE_URL=http://localhost:5173
```

### 3. Supabase 데이터베이스 설정

Supabase SQL Editor에서 마이그레이션 파일을 실행:

```bash
# supabase/migrations/001_initial_schema.sql
```

### 4. 개발 서버 실행

```bash
npm run dev
```

### 5. 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 프로젝트 구조

```
src/
├── main.jsx                    # 앱 엔트리포인트
├── App.jsx                     # 라우팅 + Provider 설정
├── styles/                     # CSS 디자인 시스템 (11 files)
│   ├── variables.css           # CSS 변수 정의
│   ├── reset.css               # 리셋 스타일
│   ├── typography.css          # 타이포그래피
│   ├── utilities.css           # 유틸리티 클래스
│   ├── animations.css          # 키프레임 애니메이션
│   ├── components.css          # 컴포넌트 스타일 (BEM)
│   ├── layout.css              # Navbar, Footer
│   ├── landing.css             # 랜딩 페이지 섹션
│   ├── pages.css               # 개별 페이지 스타일
│   ├── responsive.css          # 반응형 (480/768/1024/1200px)
│   └── dark-mode.css           # 다크모드 오버라이드
├── lib/supabase.js             # Supabase 클라이언트
├── constants/index.js          # 상수 (서비스, 전문분야, 네비게이션)
├── utils/index.js              # 유틸리티 함수
├── contexts/                   # React Context Providers
│   ├── AuthContext.jsx          # 인증 (세션, 프로필, OAuth)
│   ├── ThemeContext.jsx         # 테마 (라이트/다크)
│   └── NotificationContext.jsx  # 실시간 알림
├── hooks/usePayment.js         # PortOne 결제 훅
├── components/
│   ├── common/                 # 공통 UI 컴포넌트 (16개)
│   ├── layout/                 # Layout, Navbar, Footer
│   └── landing/                # 랜딩 페이지 섹션 (6개)
└── pages/                      # 페이지 컴포넌트 (14개)

supabase/
├── migrations/
│   └── 001_initial_schema.sql  # DB 스키마 (11 테이블 + RLS)
└── functions/                  # Edge Functions (Deno)
    ├── payment-webhook/        # 결제 검증
    ├── create-zoom-meeting/    # Zoom 미팅 생성
    ├── send-sms/               # CoolSMS 문자 발송
    └── schedule-reminders/     # 상담 알림 (24h/1h 전)
```

## 주요 기능

### 사용자 (멘티)
- 이메일/Google/Kakao OAuth 회원가입 및 로그인
- 멘토 검색, 필터링 (전문분야, 평점, 가격)
- 3단계 예약 플로우 (서비스 선택 -> 날짜/시간 -> 결제)
- PortOne 결제 (카드, 카카오페이 등)
- 이력서/자소서 업로드 및 피드백 수신
- 실시간 메시징, 알림

### 멘토
- 상담 가능 시간 슬롯 관리
- 예정 상담 목록, Zoom 자동 미팅 생성
- 서류 리뷰 및 피드백 작성
- 수익 통계 대시보드

### 시스템
- 다크모드 지원 (시스템 설정 연동)
- 반응형 디자인 (모바일 ~ 데스크탑)
- OG 메타 태그 (카카오톡/SNS 공유 미리보기)
- Row Level Security (RLS) 기반 데이터 보안

## Edge Functions 배포

```bash
supabase functions deploy payment-webhook
supabase functions deploy create-zoom-meeting
supabase functions deploy send-sms
supabase functions deploy schedule-reminders
```

## 배포

Vercel을 통한 자동 배포:

```bash
npm install -g vercel
vercel
```

## 라이선스

Private - All Rights Reserved


## License / 라이선스

**저작권 (c) 2025-2026 드림아이티비즈(DreamIT Biz). 모든 권리 보유.**

본 소프트웨어는 저작권법 및 지적재산권법에 의해 보호되는 독점 소프트웨어입니다. 본 프로젝트는 소프트웨어 저작권 등록이 완료되어 법적 보호를 받습니다.

- 본 소프트웨어의 무단 복제, 수정, 배포 또는 사용은 엄격히 금지됩니다.
- 저작권자의 사전 서면 허가 없이 본 소프트웨어의 어떠한 부분도 복제하거나 전송할 수 없습니다.
- 본 소프트웨어는 DreamIT Biz(https://www.dreamitbiz.com) 교육 플랫폼의 일부로 제공됩니다.

라이선스 문의: aebon@dreamitbiz.com

---

**Copyright (c) 2025-2026 DreamIT Biz (Ph.D Aebon Lee). All Rights Reserved.**

This software is proprietary and protected under applicable copyright and intellectual property laws. This project has been registered for software copyright protection.

- Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.
- No part of this software may be reproduced or transmitted in any form without prior written permission from the copyright holder.
- This software is provided as part of the DreamIT Biz (https://www.dreamitbiz.com) educational platform.

For licensing inquiries, contact: aebon@dreamitbiz.com

---

**Designed & Developed by Ph.D Aebon Lee**

DreamIT Biz | https://www.dreamitbiz.com


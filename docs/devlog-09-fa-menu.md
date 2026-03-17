# 개발일지 #9 - 이모지→Font Awesome 전환, 메뉴 드롭다운, 신규 페이지

**날짜:** 2026-03-18
**작업:** 사이트 전체 이모지 아이콘을 Font Awesome으로 교체, 네비게이션 메뉴에 구분바/드롭다운 도입, 온라인 강의·1:1 멘토링 페이지 신규 생성

---

## 작업 내용

### 1. Font Awesome 6 Free CDN 도입

- `index.html`에 Font Awesome 6.5.1 CDN `<link>` 추가
- 사이트 전체 25종 이모지를 FA `<i>` 태그로 교체
- constants/data의 icon 필드를 FA className 문자열로 변경, 렌더링 시 `<i className={icon} />`

**교체 범위 (16개 파일):**
- 데이터: `constants/index.js` (서비스 4개), `data/guides.js` (카테고리 6개)
- 레이아웃: `Navbar.jsx` (테마토글, 프로필/대시보드/로그아웃)
- 페이지: `AboutPage`, `RegisterPage`, `MentorListPage`, `BookingConfirmPage`, `MenteeDashboard`, `MentorDashboard`, `GuidesPage`, `GuideDetailPage`, `ServicesPage`
- 공통: `FileUpload`, `StarRating`, `ServiceCards`
- CSS: `pages.css` 체크리스트 `☐` → FA `\f0c8`

### 2. CSS 정렬 및 너비 개선

- `--container-max`: 1200px → 1320px
- `.guides-grid`, `.mentor-list__grid` minmax: 340px → 300px (4열 가능)
- `.mentor-showcase__grid`, `.testimonials__grid` minmax: 300px → 280px
- `.guide-topics-grid`: `margin: 0 auto` 추가 (중앙정렬)
- `AboutPage` 미션 섹션 인라인 스타일 → CSS 클래스로 이동
- `ServicesPage` 그리드 인라인 스타일 → `.services-page__grid` CSS 클래스로 이동

### 3. 네비게이션 메뉴 구조 변경

**변경 전:**
```
이력서 | 자기소개서 | GenAI 활용 | 전공별 면접 | 기업별 면접 | 취업전략 | 서비스 | 멘토 | 소개
```

**변경 후:**
```
이력서 | 자기소개서 | GenAI 활용 | 전공별 면접 | 기업별 면접 | 취업전략 | ── | 서비스 소개 ▾ | 소개
```

- 학습가이드 그룹과 서비스 그룹 사이에 **구분바(divider)** 삽입
- "서비스 소개" **드롭다운 메뉴** 신규 구현
  - 서비스 소개 (`/services`) - 기존
  - 멘토 소개 (`/mentors`) - 기존
  - 온라인 강의 (`/courses`) - 신규
  - 1:1 맞춤 멘토링 (`/mentoring`) - 신규
- 모바일에서는 아코디언 방식으로 펼침/접힘 지원
- 다크모드 드롭다운 배경 지원

### 4. 신규 페이지 2개

#### 온라인 강의 (`/courses`)
- 6개 강의 카드 (이력서, 면접, GenAI, 자기소개서, 커리어 전환, 연봉 협상)
- 강의별 레벨 뱃지, 강수/시간 표시, 가격, 수강 신청 버튼

#### 1:1 맞춤 멘토링 (`/mentoring`)
- 3단계 멘토링 플랜 (기본/집중/프리미엄) 가격표
- "인기" 뱃지 표시 (집중 멘토링)
- 4단계 진행 과정 안내
- CTA 섹션

---

## 수정/생성 파일

| 구분 | 파일 | 변경 |
|------|------|------|
| 설정 | `index.html` | FA CDN 추가 |
| 데이터 | `src/constants/index.js` | 서비스 아이콘 FA 전환, NAV_LINKS divider+dropdown |
| 데이터 | `src/data/guides.js` | 카테고리 아이콘 FA 전환 |
| 레이아웃 | `src/components/layout/Navbar.jsx` | divider, 드롭다운, 모바일 아코디언 |
| 랜딩 | `src/components/landing/ServiceCards.jsx` | `<i>` 태그 렌더링 |
| 공통 | `src/components/common/FileUpload.jsx` | 📎 → FA paperclip |
| 공통 | `src/components/common/StarRating.jsx` | ★/☆ → FA star |
| 페이지 | `src/pages/AboutPage.jsx` | 아이콘 + 인라인→CSS |
| 페이지 | `src/pages/BookingConfirmPage.jsx` | ✓/✗ → FA check/xmark |
| 페이지 | `src/pages/GuideDetailPage.jsx` | 팁/경고/예시 아이콘 |
| 페이지 | `src/pages/GuidesPage.jsx` | 카테고리 `<i>` 렌더링 |
| 페이지 | `src/pages/MenteeDashboard.jsx` | 문서/메시지 아이콘 |
| 페이지 | `src/pages/MentorDashboard.jsx` | 문서 아이콘 |
| 페이지 | `src/pages/MentorListPage.jsx` | 검색 아이콘 |
| 페이지 | `src/pages/RegisterPage.jsx` | 역할 아이콘 |
| 페이지 | `src/pages/ServicesPage.jsx` | 서비스 아이콘 + grid CSS |
| **신규** | `src/pages/CoursesPage.jsx` | 온라인 강의 페이지 |
| **신규** | `src/pages/MentoringPage.jsx` | 1:1 멘토링 페이지 |
| 라우팅 | `src/App.jsx` | /courses, /mentoring 라우트 추가 |
| CSS | `src/styles/variables.css` | container-max 1320px |
| CSS | `src/styles/pages.css` | 정렬/그리드 + courses/mentoring CSS |
| CSS | `src/styles/landing.css` | 그리드 minmax 축소 |
| CSS | `src/styles/layout.css` | navbar divider, nav-dropdown CSS |
| CSS | `src/styles/dark-mode.css` | nav-dropdown 다크모드 |
| 문서 | `docs/CHANGELOG-FA-migration.md` | FA 마이그레이션 상세 문서 |

---

## 빌드 결과

- 947 modules 빌드 성공
- Main JS: ~408KB (gzip ~120KB)
- CSS: ~56KB (gzip ~10KB)
- 신규 청크: `CoursesPage` (~4KB), `MentoringPage` (~5KB)

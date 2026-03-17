# 사이트 전체 점검: 이모지→Font Awesome, 정렬, 너비 개선

## 작업일: 2026-03-18

---

## 1. Font Awesome 6 Free CDN 도입

### 추가 위치
- `index.html` `<head>` 에 CDN `<link>` 추가
- 버전: Font Awesome 6.5.1 (cdnjs)

---

## 2. 이모지 → Font Awesome 아이콘 매핑

| 이모지 | FA 아이콘 | 사용처 |
|--------|-----------|--------|
| 🧭 | `fa-solid fa-compass` | 서비스(진로상담) |
| 📄 | `fa-solid fa-file-lines` | 서비스(이력서), 가이드(이력서), 대시보드 |
| 💼 | `fa-solid fa-briefcase` | 서비스(커리어컨설팅) |
| 🎤 | `fa-solid fa-microphone` | 서비스(모의면접) |
| ✍️ | `fa-solid fa-pen-fancy` | 가이드(자기소개서), 대시보드 |
| 🤖 | `fa-solid fa-robot` | 가이드(GenAI) |
| 🎓 | `fa-solid fa-graduation-cap` | 가이드(전공별면접), 소개, 회원가입 |
| 🏢 | `fa-solid fa-building` | 가이드(기업별면접) |
| 🎯 | `fa-solid fa-bullseye` | 가이드(취업전략), 소개 |
| 🌙 | `fa-solid fa-moon` | 다크모드 토글 |
| ☀️ | `fa-solid fa-sun` | 라이트모드 토글 |
| 👤 | `fa-solid fa-user` | 프로필 메뉴, 회원가입(멘티) |
| 📊 | `fa-solid fa-chart-bar` | 대시보드 메뉴 |
| 🚪 | `fa-solid fa-right-from-bracket` | 로그아웃 |
| 🔍 | `fa-solid fa-magnifying-glass` | 검색 |
| 💡 | `fa-solid fa-lightbulb` | 가이드 팁 |
| ⚠️ | `fa-solid fa-triangle-exclamation` | 가이드 경고 |
| ✅ | `fa-solid fa-circle-check` | 좋은 예 |
| ❌ | `fa-solid fa-circle-xmark` | 나쁜 예 |
| 📎 | `fa-solid fa-paperclip` | 파일 업로드 |
| 💬 | `fa-solid fa-comment` | 메시지 |
| 🤝 | `fa-solid fa-handshake` | 소개(신뢰) |
| ★/☆ | `fa-solid fa-star` / `fa-regular fa-star` | 별점 |
| ✓/✗ | `fa-solid fa-check` / `fa-solid fa-xmark` | 예약확인 |
| ☐ | CSS `content: '\f0c8'` (fa-square) | 체크리스트 |

---

## 3. 수정된 파일 목록 (16개)

| 파일 | 변경 내용 |
|------|-----------|
| `index.html` | FA CDN `<link>` 추가 |
| `src/constants/index.js` | SERVICES 아이콘 4개 → FA className 문자열 |
| `src/data/guides.js` | 카테고리 icon 6개 → FA className |
| `src/components/layout/Navbar.jsx` | 테마토글, 드롭다운 아이콘 4개 |
| `src/components/landing/ServiceCards.jsx` | 서비스 아이콘 렌더링 `<i>` 태그 |
| `src/pages/GuidesPage.jsx` | 카테고리 카드 아이콘 렌더링 |
| `src/pages/GuideDetailPage.jsx` | 팁/경고/예시 아이콘 4개, 사이드바 |
| `src/pages/AboutPage.jsx` | 핵심가치 아이콘 3개, 미션 인라인→CSS |
| `src/pages/RegisterPage.jsx` | 역할 선택 아이콘 2개 |
| `src/pages/MentorListPage.jsx` | 검색 아이콘 1개 |
| `src/pages/BookingConfirmPage.jsx` | 확인/에러 아이콘 2개 |
| `src/pages/MenteeDashboard.jsx` | 문서/메시지 아이콘 3개 |
| `src/pages/MentorDashboard.jsx` | 문서 아이콘 2개 |
| `src/components/common/FileUpload.jsx` | 파일첨부 아이콘 1개 |
| `src/components/common/StarRating.jsx` | 별점 ★/☆ → FA star |
| `src/pages/ServicesPage.jsx` | 서비스 아이콘 + 인라인 grid→CSS |

---

## 4. CSS 변경사항

### 4-1. 변수 (`src/styles/variables.css`)
- `--container-max`: `1200px` → `1320px`

### 4-2. 페이지 스타일 (`src/styles/pages.css`)
- `.guide-topics-grid`: `margin: 0 auto` 추가 (중앙정렬)
- `.guides-grid` minmax: `340px` → `300px` (4열 가능)
- `.mentor-list__grid` minmax: `340px` → `300px`
- `.guide-detail__checklist li::before`: `☐` → FA `\f0c8` (font-family 지정)
- `.about-page__mission`, `.about-page__mission-title`, `.about-page__mission-desc` 신규 클래스 추가
- `.services-page__grid` 신규 클래스 추가

### 4-3. 랜딩 스타일 (`src/styles/landing.css`)
- `.mentor-showcase__grid` minmax: `300px` → `280px`
- `.testimonials__grid` minmax: `300px` → `280px`

---

## 5. 아이콘 렌더링 패턴

### constants/data 파일의 icon 필드
```js
// Before
icon: '🧭'

// After
icon: 'fa-solid fa-compass'
```

### 렌더링 컴포넌트
```jsx
// Before
<div className="icon">{service.icon}</div>

// After
<div className="icon"><i className={service.icon} /></div>
```

### 인라인 아이콘 (직접 사용)
```jsx
// Before
<span>💡</span>

// After
<span><i className="fa-solid fa-lightbulb" /></span>
```

---

## 6. 빌드 결과
- 945 modules 빌드 성공
- Main JS: ~405KB (gzip ~119KB)
- CSS: ~51KB (gzip ~10KB)

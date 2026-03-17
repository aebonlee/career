# 개발일지 #10 - edu-hub 디자인 시스템 통일

**날짜**: 2026-03-18

## 변경 사항

### 1. CSS 변수 (variables.css)
- Primary 컬러: `#0046C8` → `#2563EB` (edu-hub 기준)
- Primary Dark: `#002E8A` → `#1D4ED8`
- Primary Light: `#4A8FE7` → `#60A5FA`
- 그래디언트: 블루→퍼플 (`#2563EB` → `#7C3AED`) 적용
- Hero 그래디언트: 딥 블루→인디고→다크 네이비
- 테두리/배경/텍스트 컬러 edu-hub 기준 정렬
- Glass blur: 12px → 16px, nav-height: 72px → 80px
- Border radius: md 12→10, lg 16→14, xl 20→18

### 2. 네비바 (layout.css)
- 링크 간격: 4px → 8px, 패딩: 8px 10px → 12px 20px
- 링크 폰트: 13px → 14px, 언더라인 3px로 강화
- 액션 영역 간격: 8px → 12px
- 설정 기어 아이콘 + 툴바 드롭다운 추가
- 모든 드롭다운에 glassmorphism 적용 (backdrop-filter blur 16px)
- 드롭다운 화살표(::before) 추가 (toolbar, user, nav)
- 드롭다운 폰트: 13px, font-weight 500, hover 컬러 통일
- 드롭다운 너비: toolbar 260px, user 230px, nav 220px
- 로그인/회원가입 버튼: pill shape + hover lift + glow shadow
- 아바타 hover 시 primary ring 효과

### 3. 버튼 (components.css)
- border: 2px → 1.5px
- font-weight: 600 → 500
- hover shadow: `0 8px 24px rgba(37, 99, 235, 0.35)` (블루 글로우)
- btn--md 폰트: 15px → 16px

### 4. 다크모드 (dark-mode.css)
- Primary: `#4A8FE7` → `#60A5FA` (밝은 블루 for contrast)
- 그래디언트: 블루→퍼플 (`#3B82F6` → `#A78BFA`)
- 드롭다운 화살표 다크모드 대응
- 툴바 버튼 border 다크모드 대응
- 드롭다운 hover 다크모드 대응

### 5. 파비콘 (favicon.svg)
- 텍스트 "Career Navigator" → "CN" 모노그램
- 그래디언트: `#2563EB` → `#7C3AED` 적용
- viewBox: 32x32 (심플한 아이콘)

### 6. 기타
- Avatar.jsx 폴백 컬러: `#0046C8` → `#2563EB`
- index.html theme-color: `#0046C8` → `#2563EB`
- 새 keyframe `toolbarFadeIn` 추가 (translateY 6px fade)

## 수정 파일 목록 (10개)
| 파일 | 변경 내용 |
|------|-----------|
| `src/styles/variables.css` | 전체 컬러/그래디언트/spacing 재정의 |
| `src/styles/layout.css` | 네비바 링크/드롭다운/툴바/버튼 전면 수정 |
| `src/styles/components.css` | 버튼 border/weight/shadow 수정 |
| `src/styles/dark-mode.css` | 다크모드 컬러/드롭다운 화살표 대응 |
| `src/components/layout/Navbar.jsx` | 설정 기어 아이콘 툴바 추가 |
| `src/components/common/Avatar.jsx` | 폴백 컬러 업데이트 |
| `public/favicon.svg` | CN 모노그램 + 그래디언트 |
| `index.html` | theme-color 메타 태그 업데이트 |

## 빌드 결과
- 947 모듈, ~409KB JS + ~59KB CSS
- gzip: ~120KB JS + ~11KB CSS

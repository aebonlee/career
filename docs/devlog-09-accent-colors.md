# 개발일지 #9 - 설정 드롭다운 개편 & 컬러팔레트

**날짜:** 2026-03-18
**작업:** 설정 드롭다운 4개 항목 재구성, 사이트 전체 accent 컬러 시스템 도입, 멘토 찾기 컬러 통일

---

## 작업 내용

### 1. ThemeContext 확장 - 컬러팔레트 시스템

- `accentColor` 상태 추가 (기본값: `blue`)
- 6개 프리셋 컬러: `blue`, `indigo`, `violet`, `emerald`, `rose`, `amber`
- `setAccentColor(color)` 함수 제공, localStorage `accent-color` 키로 저장
- `<html>` 태그에 `data-accent="blue"` 속성 설정하여 CSS 변수 오버라이드

#### 수정 파일
- `src/contexts/ThemeContext.jsx` - accentColor 상태/함수 추가

### 2. CSS 컬러팔레트 변수

- 5개 비-기본 accent 셀렉터 (`[data-accent="indigo"]` 등) 추가
- 각 셀렉터에서 `--primary`, `--primary-dark`, `--primary-light`, `--primary-bg`, `--primary-gradient` 오버라이드
- 다크모드 조합용 `[data-theme="dark"][data-accent="..."]` 셀렉터 추가 (10개)

#### 수정 파일
- `src/styles/variables.css` - accent 셀렉터 + `--star-filled` 변경

### 3. 멘토 찾기 컬러 통일

- `--star-filled: #F59E0B` (주황) → `--star-filled: var(--primary)` 변경
- 별점이 accent 색상(기본 다크블루)을 따르도록 통일
- 뱃지, 가격 등은 이미 `var(--primary)` 사용 중이므로 자동 적용

### 4. 설정 드롭다운 개편

기존 3개 항목 → 4개 항목으로 교체:

| 순서 | 아이콘 | 라벨 | 동작 |
|------|--------|------|------|
| 1 | fa-magnifying-glass | 검색 | `/mentors` 이동 |
| 2 | fa-globe | EN / KO | 표시 토글 (향후 i18n 확장용) |
| 3 | fa-palette | 컬러팔레트 | 인라인 6개 원형 스와치 |
| 4 | fa-moon/fa-sun | 다크/라이트 | 기존 toggleTheme |

- 컬러팔레트 행에 6개 원형 스와치 인라인 표시
- 선택된 컬러에 체크마크(✓) + ring 표시

#### 수정 파일
- `src/components/layout/Navbar.jsx` - 설정 드롭다운 4개 항목
- `src/styles/layout.css` - 컬러 스와치 스타일 (`.navbar__color-swatch*`)

---

## 빌드 결과
- 947 modules, ~410KB main JS + ~61KB CSS
- 빌드 시간: ~500ms

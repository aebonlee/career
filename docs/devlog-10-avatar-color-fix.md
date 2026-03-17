# 개발일지 #10 - 멘토 찾기 페이지 컬러 통일 & 레이아웃 수정

**날짜:** 2026-03-18
**작업:** 아바타 이니셜 색상 통일, 가격 텍스트 오버플로우 수정

---

## 작업 내용

### 1. 아바타 이니셜 컬러 통일

**문제:** Avatar 컴포넌트에 6개 색상(`#2563EB`, `#059669`, `#D97706`, `#DC2626`, `#7C3AED`, `#DB2777`)이 하드코딩 → 멘토 카드마다 다른 배경색으로 산만

**해결:**
- 하드코딩 색상 배열 및 `getColor()` 함수 제거
- inline style → CSS 클래스 `.avatar--initials` 전환
- `background: var(--primary)`로 통일, 컬러팔레트 변경 시 연동

#### 수정 파일
- `src/components/common/Avatar.jsx` - 색상 배열 제거, `avatar--initials` 클래스 적용
- `src/styles/components.css` - `.avatar--initials { background: var(--primary); color: #fff; }` 추가

### 2. 가격 텍스트 오버플로우 수정

**문제:** "75,000원/시간" 등 가격 텍스트가 카드 박스 밖으로 벗어남

**해결:**
- 카드 그리드 최소 폭 `300px` → `340px` 확대
- 카드에 `overflow: hidden` 추가
- bottom 섹션 `flex-wrap: wrap`으로 가격/별점 줄바꿈 허용
- 가격 텍스트 `white-space: nowrap`, `font-size: 0.875rem` 적용

#### 수정 파일
- `src/styles/pages.css` - `.mentor-list__grid`, `.mentor-list-card`, `.mentor-list-card__bottom`, `.mentor-list-card__price` 수정

---

## 빌드 결과
- 947 modules, ~410KB main JS + ~61KB CSS
- 빌드 시간: ~738ms

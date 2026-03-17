# 개발일지 #10 - 아바타 이니셜 컬러 통일

**날짜:** 2026-03-18
**작업:** 멘토 찾기 페이지 아바타 이니셜 색상을 primary 단일 컬러로 통일

---

## 작업 내용

### 문제
- Avatar 컴포넌트에 6개 색상이 하드코딩되어 있었음
  - `['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777']`
- 멘토 이름 해시값 기반으로 랜덤 배경색 할당 → 다채로운 색상이 촌스러움
- 컬러팔레트(accent) 변경 시 아바타 색상은 그대로 유지되는 불일치

### 해결
- 하드코딩 색상 배열 및 `getColor()` 함수 제거
- inline style 대신 CSS 클래스 `.avatar--initials` 추가
- `background: var(--primary)` 로 통일하여 accent 컬러와 연동

#### 수정 파일
- `src/components/common/Avatar.jsx` - 색상 배열 제거, `avatar--initials` 클래스 적용
- `src/styles/components.css` - `.avatar--initials` 스타일 추가

---

## 빌드 결과
- 947 modules, ~410KB main JS + ~61KB CSS
- 빌드 시간: ~509ms

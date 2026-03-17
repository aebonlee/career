# 개발일지 #11 - 가이드 상세 페이지 헤더 위치 수정

**날짜**: 2026-03-18

## 문제

- 가이드 상세 페이지(`/guides/:category/:topic`)의 타이틀 영역이 고정 네비바 뒤에 가려짐
- 상단 시작점이 `top ≈ 0`으로 보이는 현상

## 원인

- `.page-header--compact`가 shorthand `padding: 24px 0 8px`으로 선언되어 있어서,
  기본 `.page-header`의 `padding-top: calc(var(--nav-height) + 48px)`을 완전히 덮어씀
- 결과적으로 `--nav-height`(80px)가 빠지면서 콘텐츠가 네비바 아래로 밀리지 않음

## 수정

- **파일**: `src/styles/pages.css` (line 1407)
- `padding: 24px 0 8px` → `padding: calc(var(--nav-height) + 24px) 0 8px`
- 네비바 높이를 포함하여 타이틀이 네비바 아래에서 정상 시작되도록 수정

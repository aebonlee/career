# 개발일지 #8 - 네비게이션 재구성 및 배포 수정

**날짜:** 2026-03-18
**작업:** 상단 메뉴 구조 변경, GitHub Pages 배포 방식 수정

---

## 작업 내용

### 1. 네비게이션 메뉴 재구성

**변경 전:** 홈 | 서비스 | 멘토 | 학습가이드 | 소개 (5개)

**변경 후:** 이력서 | 자기소개서 | GenAI 활용 | 전공별 면접 | 기업별 면접 | 취업전략 | 서비스 | 멘토 | 소개 (9개)

- 홈 메뉴 삭제 (로고 클릭으로 홈 이동)
- 학습가이드 단일 메뉴를 6개 카테고리 개별 메뉴로 분리
- 각 메뉴가 `/guides/{categorySlug}` 카테고리 페이지로 직접 연결

#### 수정 파일
- `src/constants/index.js` - NAV_LINKS 9개 항목으로 재구성
- `src/components/layout/Navbar.jsx` - `end` prop 제거 (홈 라우트 삭제에 따른 정리)
- `src/styles/layout.css` - 링크 패딩/폰트 축소 (16px→10px, 0.9375rem→0.8125rem), 모바일 브레이크포인트 768px→1024px

### 2. GitHub Pages 배포 방식 수정

**문제:** GitHub Pages Source가 Branch(main)로 설정되어 빌드 결과물(dist/)이 아닌 소스 코드(index.html)가 직접 배포됨. JS 번들 404 발생으로 사이트 전체 미작동.

**원인:** `deploy.yml`이 `actions/deploy-pages@v4`(GitHub Actions 방식)를 사용하지만, Pages 설정이 Branch 배포 모드였음.

**해결:** `peaceiris/actions-gh-pages@v4`를 사용하여 빌드 결과물을 `gh-pages` 브랜치에 자동 푸시하는 방식으로 전환.

#### 수정 파일
- `.github/workflows/deploy.yml` - gh-pages 브랜치 배포 방식으로 변경

---

## 빌드 결과
- 945 modules, ~405KB main JS + ~51KB CSS
- 빌드 시간: ~493ms

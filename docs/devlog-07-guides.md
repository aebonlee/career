# 개발일지 #7 - 학습가이드 메뉴 추가

**날짜:** 2026-03-18
**작업:** 취업준비 학습가이드 콘텐츠 메뉴 구현

---

## 작업 내용

### 1. 학습가이드 기능 추가
취업 준비에 필요한 학습 콘텐츠를 정적 페이지로 제공하는 **학습가이드** 메뉴를 추가했습니다.

### 2. 콘텐츠 구성 (6개 카테고리 × 5개 토픽 = 30개)

| 카테고리 | 슬러그 | 토픽 수 |
|---------|--------|---------|
| 이력서 작성법 | `resume` | 5 |
| 자기소개서 작성법 | `cover-letter` | 5 |
| GenAI 활용법 | `genai` | 5 |
| 전공별 면접방법 | `interview-major` | 5 |
| 기업유형별 면접 대비 | `interview-company` | 5 |
| 취업 전략 | `job-search` | 5 |

### 3. 라우트 구조
```
/guides                           → GuidesPage (카테고리 목록)
/guides/:categorySlug             → GuideCategoryPage (토픽 목록)
/guides/:categorySlug/:topicSlug  → GuideDetailPage (가이드 상세)
```
- 공개 라우트 (로그인 불필요)

### 4. 구현 세부사항

#### 새 파일 (4개)
- `src/data/guides.js` - 6개 카테고리, 30개 토픽의 정적 데이터 + 헬퍼 함수
- `src/pages/GuidesPage.jsx` - 카테고리 카드 그리드
- `src/pages/GuideCategoryPage.jsx` - 번호 매긴 토픽 카드 + 브레드크럼
- `src/pages/GuideDetailPage.jsx` - 섹션 렌더러 + 사이드바 + 이전/다음 내비게이션

#### 수정 파일 (5개)
- `src/constants/index.js` - NAV_LINKS에 학습가이드 추가
- `src/App.jsx` - 3개 lazy import + 3개 Route 추가
- `src/styles/pages.css` - 가이드 CSS (~250줄)
- `src/styles/dark-mode.css` - 다크모드 오버라이드 (~20줄)
- `src/components/layout/Footer.jsx` - 안내 섹션에 학습가이드 Link 추가

### 5. 핵심 설계 결정
- **데이터 기반 렌더링**: `GuideDetailPage` 하나로 30개 토픽을 `useParams()` + 데이터 조회로 렌더링
- **섹션 타입 시스템**: heading, paragraph, list, tip, warning, example, checklist, quote 등 8가지 섹션 타입
- **사이드바**: 같은 카테고리의 토픽 목록 (sticky), 현재 토픽 하이라이트
- **이전/다음 내비게이션**: 토픽 간 순차 이동
- **브레드크럼**: 학습가이드 › 카테고리 › 토픽
- **반응형**: 1024px 이하 사이드바 상단 이동, 768px 이하 1컬럼

---

## 빌드 결과
- 945 modules, ~405KB main JS + ~51KB CSS
- guides 데이터 chunk: ~60KB (gzip: ~20KB)
- 빌드 시간: ~552ms

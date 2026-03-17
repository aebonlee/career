export const SITE_NAME = '상담공간';
export const SITE_DESCRIPTION = '직업학박사가 함께하는 커리어 상담 플랫폼';

export const ROLES = {
  MENTEE: 'mentee',
  MENTOR: 'mentor',
  ADMIN: 'admin',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
};

export const DOCUMENT_STATUS = {
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in_review',
  REVIEWED: 'reviewed',
};

export const DOCUMENT_TYPES = {
  RESUME: 'resume',
  COVER_LETTER: 'cover_letter',
};

export const SERVICES = [
  {
    id: 'career-counseling',
    name: '진로상담',
    slug: 'career-counseling',
    icon: '🧭',
    description: '적성과 흥미를 분석하여 최적의 진로 방향을 제시합니다.',
    durations: [30, 50, 80],
    basePrice: 50000,
  },
  {
    id: 'resume-review',
    name: '이력서/자소서 진단',
    slug: 'resume-review',
    icon: '📄',
    description: '전문가의 시선으로 이력서와 자기소개서를 진단하고 피드백합니다.',
    durations: [30, 50],
    basePrice: 40000,
  },
  {
    id: 'career-consulting',
    name: '커리어 컨설팅',
    slug: 'career-consulting',
    icon: '💼',
    description: '경력 개발 전략과 커리어 로드맵을 함께 설계합니다.',
    durations: [50, 80],
    basePrice: 60000,
  },
  {
    id: 'mock-interview',
    name: '모의면접',
    slug: 'mock-interview',
    icon: '🎤',
    description: '실전과 동일한 환경에서 면접을 연습하고 피드백을 받습니다.',
    durations: [50, 80],
    basePrice: 70000,
  },
];

export const SPECIALTIES = [
  '진로탐색',
  '취업전략',
  '이직상담',
  '자기소개서',
  '면접코칭',
  '경력개발',
  '직무분석',
  '대학원진학',
  '해외취업',
  '공기업',
  '대기업',
  'IT/스타트업',
];

export const NAV_LINKS = [
  { label: '홈', path: '/' },
  { label: '서비스', path: '/services' },
  { label: '멘토', path: '/mentors' },
  { label: '학습가이드', path: '/guides' },
  { label: '소개', path: '/about' },
];

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1200,
};

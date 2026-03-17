import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { formatPrice } from '../utils';

const courses = [
  {
    id: 1,
    title: '이력서 완성 마스터 클래스',
    instructor: '김진영 박사',
    icon: 'fa-solid fa-file-lines',
    description: 'ATS 최적화부터 디자인까지, 합격하는 이력서 작성의 모든 것을 배웁니다.',
    lessons: 12,
    duration: '6시간',
    level: '초급',
    price: 89000,
  },
  {
    id: 2,
    title: '면접 정복 완전정복',
    instructor: '이민지 박사',
    icon: 'fa-solid fa-microphone',
    description: '구조화 면접, 역량 면접, PT 면접까지 실전 면접의 핵심을 다룹니다.',
    lessons: 15,
    duration: '8시간',
    level: '중급',
    price: 119000,
  },
  {
    id: 3,
    title: 'GenAI로 취업 준비하기',
    instructor: '박수현 박사',
    icon: 'fa-solid fa-robot',
    description: 'ChatGPT, Claude 등 생성형 AI를 활용한 효율적인 취업 준비 전략을 안내합니다.',
    lessons: 8,
    duration: '4시간',
    level: '초급',
    price: 69000,
  },
  {
    id: 4,
    title: '자기소개서 스토리텔링',
    instructor: '정하윤 박사',
    icon: 'fa-solid fa-pen-fancy',
    description: '지원동기부터 성장과정까지, 읽히는 자기소개서 작성법을 마스터합니다.',
    lessons: 10,
    duration: '5시간',
    level: '초급',
    price: 79000,
  },
  {
    id: 5,
    title: '커리어 전환 전략',
    instructor: '최서준 박사',
    icon: 'fa-solid fa-arrows-rotate',
    description: '이직·전직을 준비하는 분들을 위한 체계적인 커리어 전환 로드맵을 제공합니다.',
    lessons: 10,
    duration: '5시간',
    level: '중급',
    price: 99000,
  },
  {
    id: 6,
    title: '연봉 협상의 기술',
    instructor: '윤도현 박사',
    icon: 'fa-solid fa-coins',
    description: '데이터 기반 연봉 협상 전략과 실전 스크립트를 배웁니다.',
    lessons: 6,
    duration: '3시간',
    level: '중급',
    price: 59000,
  },
];

const levelVariant = { '초급': 'success', '중급': 'info', '고급': 'warning' };

export default function CoursesPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>온라인 강의</h1>
          <p>직업학박사의 전문 강의로 체계적으로 취업을 준비하세요</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="courses-grid">
            {courses.map(course => (
              <Card key={course.id} padding="lg" hoverable>
                <div className="course-card__icon">
                  <i className={course.icon} />
                </div>
                <h3 className="course-card__title">{course.title}</h3>
                <p className="course-card__instructor">{course.instructor}</p>
                <p className="course-card__desc">{course.description}</p>
                <div className="course-card__meta">
                  <Badge variant={levelVariant[course.level]} size="sm">{course.level}</Badge>
                  <span className="course-card__info">
                    <i className="fa-solid fa-play-circle" /> {course.lessons}강
                  </span>
                  <span className="course-card__info">
                    <i className="fa-regular fa-clock" /> {course.duration}
                  </span>
                </div>
                <div className="course-card__bottom">
                  <span className="course-card__price">{formatPrice(course.price)}</span>
                  <Button variant="primary" size="sm">수강 신청</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>
            원하는 강의가 없으신가요?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            1:1 맞춤 멘토링을 통해 나에게 꼭 맞는 커리어 상담을 받아보세요.
          </p>
          <Link to="/mentoring">
            <Button variant="primary">1:1 멘토링 알아보기</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

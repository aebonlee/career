import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import StarRating from '../common/StarRating';
import Button from '../common/Button';

const mockMentors = [
  { id: '1', name: '김진영', title: '진로상담전문가', institution: '서울대학교', specialties: ['진로탐색', '취업전략'], rating: 4.9, reviews: 128 },
  { id: '2', name: '박수현', title: '커리어코치', institution: '연세대학교', specialties: ['이직상담', '경력개발'], rating: 4.8, reviews: 95 },
  { id: '3', name: '이민지', title: '취업컨설턴트', institution: '고려대학교', specialties: ['자기소개서', '면접코칭'], rating: 4.9, reviews: 112 },
];

export default function MentorShowcase() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">검증된 전문 멘토진</h2>
          <p className="section-subtitle">직업학박사 학위를 보유한 전문가들이 여러분의 커리어를 함께 설계합니다.</p>
        </div>
        <div className="mentor-showcase__grid">
          {mockMentors.map((mentor, i) => (
            <div key={mentor.id} className="mentor-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="mentor-card__avatar">
                <Avatar name={mentor.name} size="lg" />
              </div>
              <h3 className="mentor-card__name">{mentor.name}</h3>
              <p className="mentor-card__title">{mentor.title}</p>
              <p className="mentor-card__institution">{mentor.institution}</p>
              <div className="mentor-card__badges">
                {mentor.specialties.map(s => <Badge key={s}>{s}</Badge>)}
              </div>
              <div className="mentor-card__rating">
                <StarRating rating={mentor.rating} size="sm" />
                <span className="mentor-card__rating-value">{mentor.rating}</span>
                <span className="mentor-card__rating-count">({mentor.reviews})</span>
              </div>
              <Link to={`/mentors/${mentor.id}`}>
                <Button variant="secondary" size="sm" fullWidth>프로필 보기</Button>
              </Link>
            </div>
          ))}
        </div>
        <div className="mentor-showcase__cta">
          <Link to="/mentors">
            <Button variant="primary" size="lg">모든 멘토 보기</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import StarRating from '../components/common/StarRating';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Pagination from '../components/common/Pagination';
import { formatPrice } from '../utils';
import { SPECIALTIES } from '../constants';

const mockMentors = [
  { id: '1', name: '김진영', title: '진로상담전문가', institution: '서울대학교', credentials: '직업학박사', specialties: ['진로탐색', '취업전략'], rating: 4.9, reviewCount: 128, hourlyRate: 60000 },
  { id: '2', name: '박수현', title: '커리어코치', institution: '연세대학교', credentials: '직업학박사', specialties: ['이직상담', '경력개발'], rating: 4.8, reviewCount: 95, hourlyRate: 50000 },
  { id: '3', name: '이민지', title: '취업컨설턴트', institution: '고려대학교', credentials: '직업학박사', specialties: ['자기소개서', '면접코칭'], rating: 4.9, reviewCount: 112, hourlyRate: 55000 },
  { id: '4', name: '최서준', title: '경력개발전문가', institution: '성균관대학교', credentials: '직업학박사', specialties: ['경력개발', '대기업'], rating: 4.7, reviewCount: 78, hourlyRate: 65000 },
  { id: '5', name: '정하윤', title: '면접코칭전문가', institution: '한양대학교', credentials: '직업학박사', specialties: ['면접코칭', 'IT/스타트업'], rating: 4.8, reviewCount: 86, hourlyRate: 70000 },
  { id: '6', name: '윤도현', title: '해외취업전문가', institution: '서강대학교', credentials: '직업학박사', specialties: ['해외취업', '직무분석'], rating: 4.6, reviewCount: 54, hourlyRate: 75000 },
];

const PER_PAGE = 6;

export default function MentorListPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [sort, setSort] = useState('rating');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...mockMentors];
    if (search) result = result.filter(m => m.name.includes(search) || m.title.includes(search));
    if (specialty) result = result.filter(m => m.specialties.includes(specialty));
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'price') result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    else if (sort === 'reviews') result.sort((a, b) => b.reviewCount - a.reviewCount);
    return result;
  }, [search, specialty, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>멘토 찾기</h1>
          <p>당신에게 맞는 전문 멘토를 찾아보세요</p>
        </div>
      </div>

      <section className="mentor-list">
        <div className="container">
          <div className="mentor-list__controls">
            <div className="mentor-list__search">
              <Input placeholder="멘토 이름 또는 전문분야 검색" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }} icon="🔍" />
            </div>
            <select className="form-select" value={specialty} onChange={e => { setSpecialty(e.target.value); setPage(1); }}
              style={{ width: 'auto' }}>
              <option value="">전체 전문분야</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}
              style={{ width: 'auto' }}>
              <option value="rating">평점순</option>
              <option value="price">가격순</option>
              <option value="reviews">리뷰순</option>
            </select>
          </div>

          <div className="mentor-list__grid">
            {paginated.map(mentor => (
              <Link key={mentor.id} to={`/mentors/${mentor.id}`} className="mentor-list-card">
                <Avatar name={mentor.name} size="lg" />
                <div className="mentor-list-card__info">
                  <h3 className="mentor-list-card__name">{mentor.name}</h3>
                  <p className="mentor-list-card__title">{mentor.title}</p>
                  <p className="mentor-list-card__institution">{mentor.institution} &middot; {mentor.credentials}</p>
                  <div className="mentor-list-card__specialties">
                    {mentor.specialties.map(s => <Badge key={s}>{s}</Badge>)}
                  </div>
                  <div className="mentor-list-card__bottom">
                    <div className="mentor-list-card__rating">
                      <StarRating rating={mentor.rating} size="sm" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{mentor.rating}</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>({mentor.reviewCount})</span>
                    </div>
                    <span className="mentor-list-card__price">{formatPrice(mentor.hourlyRate)}/시간</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </section>
    </>
  );
}

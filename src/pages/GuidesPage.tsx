import { Link } from 'react-router-dom';
import { getAllCategories } from '../data/guides';

const categories = getAllCategories();

export default function GuidesPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>학습가이드</h1>
          <p>취업 준비에 필요한 모든 것을 체계적으로 학습하세요</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="guides-grid">
            {categories.map((cat) => (
              <Link key={cat.slug} to={`/guides/${cat.slug}`} className="guide-category-card">
                <div className="guide-category-card__icon"><i className={cat.icon} /></div>
                <h2 className="guide-category-card__title">{cat.title}</h2>
                <p className="guide-category-card__desc">{cat.description}</p>
                <span className="guide-category-card__count">{cat.topicCount}개 가이드</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

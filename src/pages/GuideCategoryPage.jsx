import { Link, useParams, Navigate } from 'react-router-dom';
import { getCategoryBySlug } from '../data/guides';

export default function GuideCategoryPage() {
  const { categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  if (!category) return <Navigate to="/guides" replace />;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <nav className="guide-breadcrumb">
            <Link to="/guides">학습가이드</Link>
            <span className="guide-breadcrumb__sep">›</span>
            <span>{category.title}</span>
          </nav>
          <h1>{category.icon} {category.title}</h1>
          <p>{category.description}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="guide-topics-grid">
            {category.topics.map((topic, i) => (
              <Link
                key={topic.slug}
                to={`/guides/${categorySlug}/${topic.slug}`}
                className="guide-topic-card"
              >
                <span className="guide-topic-card__number">{String(i + 1).padStart(2, '0')}</span>
                <div className="guide-topic-card__body">
                  <h3 className="guide-topic-card__title">{topic.title}</h3>
                  <p className="guide-topic-card__desc">{topic.description}</p>
                </div>
                <span className="guide-topic-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

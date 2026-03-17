import { Link, useParams, Navigate } from 'react-router-dom';
import { getTopicBySlug, getAdjacentTopics, getCategoryBySlug } from '../data/guides';

function renderSection(section, idx) {
  switch (section.type) {
    case 'heading':
      return <h1 key={idx} className="guide-detail__heading">{section.content}</h1>;
    case 'subheading':
      return <h2 key={idx} className="guide-detail__subheading">{section.content}</h2>;
    case 'paragraph':
      return <p key={idx} className="guide-detail__paragraph">{section.content}</p>;
    case 'list':
      return (
        <ul key={idx} className="guide-detail__list">
          {section.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'ordered-list':
      return (
        <ol key={idx} className="guide-detail__list guide-detail__list--ordered">
          {section.items.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      );
    case 'tip':
      return (
        <div key={idx} className="guide-detail__callout guide-detail__callout--tip">
          <span className="guide-detail__callout-icon"><i className="fa-solid fa-lightbulb" /></span>
          <p>{section.content}</p>
        </div>
      );
    case 'warning':
      return (
        <div key={idx} className="guide-detail__callout guide-detail__callout--warning">
          <span className="guide-detail__callout-icon"><i className="fa-solid fa-triangle-exclamation" /></span>
          <p>{section.content}</p>
        </div>
      );
    case 'example':
      return (
        <div key={idx} className="guide-detail__example">
          <div className="guide-detail__example-item guide-detail__example-item--good">
            <span className="guide-detail__example-label"><i className="fa-solid fa-circle-check" /> 좋은 예</span>
            <p>{section.good}</p>
          </div>
          <div className="guide-detail__example-item guide-detail__example-item--bad">
            <span className="guide-detail__example-label"><i className="fa-solid fa-circle-xmark" /> 나쁜 예</span>
            <p>{section.bad}</p>
          </div>
        </div>
      );
    case 'checklist':
      return (
        <ul key={idx} className="guide-detail__checklist">
          {section.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'quote':
      return <blockquote key={idx} className="guide-detail__quote">{section.content}</blockquote>;
    default:
      return null;
  }
}

export default function GuideDetailPage() {
  const { categorySlug, topicSlug } = useParams();
  const result = getTopicBySlug(categorySlug, topicSlug);

  if (!result) return <Navigate to="/guides" replace />;

  const { category, sections, title } = result;
  const { prev, next } = getAdjacentTopics(categorySlug, topicSlug);
  const currentCategory = getCategoryBySlug(categorySlug);

  return (
    <>
      <div className="page-header page-header--compact">
        <div className="container">
          <nav className="guide-breadcrumb">
            <Link to="/guides">학습가이드</Link>
            <span className="guide-breadcrumb__sep">›</span>
            <Link to={`/guides/${categorySlug}`}>{category.title}</Link>
            <span className="guide-breadcrumb__sep">›</span>
            <span>{title}</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="guide-detail-layout">
            {/* Sidebar */}
            <aside className="guide-sidebar">
              <h4 className="guide-sidebar__title"><i className={category.icon} /> {category.title}</h4>
              <nav className="guide-sidebar__nav">
                {currentCategory.topics.map((t) => (
                  <Link
                    key={t.slug}
                    to={`/guides/${categorySlug}/${t.slug}`}
                    className={`guide-sidebar__link${t.slug === topicSlug ? ' guide-sidebar__link--active' : ''}`}
                  >
                    {t.title}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <article className="guide-detail__content">
              {sections.map((section, idx) => renderSection(section, idx))}

              {/* Prev / Next */}
              <div className="guide-detail__nav">
                {prev ? (
                  <Link to={`/guides/${categorySlug}/${prev.slug}`} className="guide-detail__nav-btn">
                    <span className="guide-detail__nav-label">← 이전</span>
                    <span className="guide-detail__nav-title">{prev.title}</span>
                  </Link>
                ) : <div />}
                {next ? (
                  <Link to={`/guides/${categorySlug}/${next.slug}`} className="guide-detail__nav-btn guide-detail__nav-btn--next">
                    <span className="guide-detail__nav-label">다음 →</span>
                    <span className="guide-detail__nav-title">{next.title}</span>
                  </Link>
                ) : <div />}
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

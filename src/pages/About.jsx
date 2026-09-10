import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';

const values = [
  {
    icon: 'bi-clock-history',
    title: 'History of Life safe',
    description: 'We support clinical teams and the people they care for.',
  },
  {
    icon: 'bi-bullseye',
    title: 'Mission',
    description: 'We deliver reliable solutions that make healthcare simpler and more effective.',
  },
  {
    icon: 'bi-eye',
    title: 'Vision',
    description: 'We aim to build a healthier future through trusted healthcare solutions.',
  },
];

export default function About() {
  return (
    <ContentPage
      pageId={2}
      title="About Life Safe"
      eyebrow="YOUR MEDICAL TECHNOLOGY PARTNER"
    >
      {(apiContent) => (
        <div className="about-showcase">
          <div className="about-showcase__hero">
            <div>
              <span className="about-showcase__eyebrow">LIFE SAFE MEDICAL</span>
              <h2>We are technology with optimal <span>Human Resources Services.</span></h2>
              <p>
                We bring together medical equipment, practical expertise and
                dependable support for healthcare facilities.
              </p>
            </div>
            <div className="about-showcase__mark" aria-hidden="true">
              <i className="bi bi-heart-pulse-fill" />
            </div>
          </div>

          {apiContent && (
            <div
              className="about-showcase__content"
              dangerouslySetInnerHTML={{ __html: apiContent }}
            />
          )}

          <div className="about-showcase__values">
            {values.map((value) => (
              <article className="about-value-card" key={value.title}>
                <i className={`bi ${value.icon}`} />
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>

          <div className="about-showcase__cta">
            <div>
              <span>LET’S WORK TOGETHER</span>
              <h3>Looking for the right medical technology partner?</h3>
            </div>
            <Link to="/contact" className="btn btn-primary">
              Contact us <i className="bi bi-arrow-up-right" />
            </Link>
          </div>
        </div>
      )}
    </ContentPage>
  );
}

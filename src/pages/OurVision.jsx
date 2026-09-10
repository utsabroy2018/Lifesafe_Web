import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';

const visionFocuses = [
  ['bi-lightbulb', 'Meaningful Innovation', 'Advancing healthcare with practical technology that creates real value for facilities.'],
  ['bi-hospital', 'Stronger Healthcare', 'Helping hospitals and clinical teams build capability for the care they provide.'],
  ['bi-graph-up-arrow', 'Sustainable Progress', 'Growing through long-term relationships, consistent quality and dependable support.'],
];

export default function OurVision() {
  return (
    <ContentPage
      pageId={166}
      title="Our Vision"
      eyebrow="ADVANCING HEALTHCARE THROUGH INNOVATION"
    >
      {(apiContent) => (
        <div className="mission-showcase vision-showcase">
          <div className="mission-showcase__statement">
            <div className="mission-showcase__symbol" aria-hidden="true">
              <i className="bi bi-eye" />
            </div>
            <div>
              <span>LOOKING AHEAD</span>
              <h2>Enabling a healthier future through <em>better technology.</em></h2>
            </div>
          </div>

          <div className="mission-showcase__content">
            {apiContent ? (
              <div dangerouslySetInnerHTML={{ __html: apiContent }} />
            ) : (
              <p>
                Our vision is to be a trusted medical technology partner that
                helps healthcare providers deliver better outcomes with confidence.
              </p>
            )}
          </div>

          <div className="mission-showcase__commitments">
            {visionFocuses.map(([icon, title, description]) => (
              <article className="mission-commitment" key={title}>
                <i className={`bi ${icon}`} />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>

          {/* <div className="mission-showcase__footer">
            <p>Reliable medical solutions, thoughtfully supported.</p>
            <Link to="/services">Explore our services <i className="bi bi-arrow-right" /></Link>
          </div> */}

          <div className="about-showcase__cta">
            <div>
              <span>LET’S WORK TOGETHER</span>
              <h3>Better technology. More confident care.</h3>
            </div>
            <Link to="/products" className="btn btn-primary">
              Explore products <i className="bi bi-arrow-up-right" />
            </Link>
          </div>

        </div>
      )}
    </ContentPage>
  );
}

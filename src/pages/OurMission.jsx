import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';

const commitments = [
  ['bi-clipboard2-pulse', 'Reliable solutions', 'Equipment and support chosen for the practical demands of healthcare facilities.'],
  ['bi-person-check', 'Clinical confidence', 'Clear guidance that helps teams make informed decisions with confidence.'],
  ['bi-arrow-repeat', 'Ongoing care', 'Responsive support that continues beyond installation and commissioning.'],
];

export default function OurMission() {
  return (
    <ContentPage
      pageId={168}
      title="Our Mission"
      eyebrow="PROVIDING RELIABLE MEDICAL SOLUTIONS"
    >
      {(apiContent) => (
        <div className="mission-showcase">
          <div className="mission-showcase__statement">
            <div className="mission-showcase__symbol" aria-hidden="true">
              <i className="bi bi-bullseye" />
            </div>
            <div>
              <span>OUR PURPOSE</span>
              <h2>Helping healthcare teams deliver <em>confident care.</em></h2>
            </div>
          </div>

          <div className="mission-showcase__content">
            {apiContent ? (
              <div dangerouslySetInnerHTML={{ __html: apiContent }} />
            ) : (
              <p>
                We are committed to providing reliable medical technology and
                practical support for the people who depend on it every day.
              </p>
            )}
          </div>

          <div className="mission-showcase__commitments">
            {commitments.map(([icon, title, description]) => (
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
              <h3>Reliable medical solutions, thoughtfully supported.</h3>
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

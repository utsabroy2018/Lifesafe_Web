import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';

const engineeringServices = [
  {
    icon: 'bi-clipboard2-pulse',
    title: 'Preventive Maintenance',
    description:
      'Planned maintenance programmes that help equipment remain reliable, safe, and ready for use.',
  },
  {
    icon: 'bi-tools',
    title: 'Breakdown Support',
    description:
      'Responsive troubleshooting and repair support to reduce equipment downtime.',
  },
  {
    icon: 'bi-journal-check',
    title: 'Equipment Inspection',
    description:
      'Routine inspection and performance checks to help maintain quality and compliance.',
  },
  {
    icon: 'bi-gear-wide-connected',
    title: 'Asset Management',
    description:
      'Clear equipment records, lifecycle tracking, and service planning for informed decisions.',
  },
  {
    icon: 'bi-person-workspace',
    title: 'Clinical User Training',
    description:
      'Practical guidance that helps clinical teams use equipment safely and confidently.',
  },
  {
    icon: 'bi-patch-check',
    title: 'Quality & Safety Support',
    description:
      'Support for safety checks, documentation, and dependable medical-device performance.',
  },
  {
    icon: 'bi-diagram-3',
    title: 'Installation & Commissioning',
    description:
      'Professional coordination from equipment installation through acceptance and handover.',
  },
];

export default function BME() {
  return (
    <ContentPage
      pageId={375}
      title="Biomedical Engineering"
      eyebrow="DEPENDABLE SUPPORT"
    >
      {(apiContent) => (
      <div className="services-showcase">
        <div className="services-showcase__intro">
          <span className="services-showcase__eyebrow">BIOMEDICAL ENGINEERING</span>
          <h2>Keeping vital equipment <span>ready for care.</span></h2>
          <p>
            Our biomedical engineering team helps healthcare facilities manage,
            maintain, and optimise their medical equipment throughout its
            lifecycle.
          </p>
        </div>

        {apiContent && (
          <div className="services-showcase__intro_full">
            <div
              className="services-showcase__dynamic-content"
              dangerouslySetInnerHTML={{ __html: apiContent }}
            />
          </div>
        )}

        {/* <div className="services-showcase__intro">
          <span className="services-showcase__eyebrow">OUR SERVICES</span>
          <h2>Engineering support you can <span>count on.</span></h2>
        </div> */}
        
        <div className="services-showcase__grid">
          {engineeringServices.map((service, index) => (
            <article className="service-feature-card" key={service.title}>
              <span className="service-feature-card__number">0{index + 1}</span>
              <div className="service-feature-card__icon">
                <i className={`bi ${service.icon}`} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>

        <div className="services-showcase__cta">
          <div>
            <span>NEED ASSISTANCE?</span>
            <h3>Let’s find the right support for your facility.</h3>
          </div>
          <Link to="/contact" className="btn btn-primary">
            Contact us  <i className="bi bi-arrow-up-right" />
          </Link>
        </div>
      </div>
      )}
    </ContentPage>
  );
}

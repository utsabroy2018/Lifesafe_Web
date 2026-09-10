import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';

const services = [
  {
    icon: 'bi-heart-pulse',
    title: 'Cardiology & CTVS Solutions',
    description:
      'End-to-end solutions for Interventional Cardiology and Cardio-Thoracic & Vascular Surgery.',
  },
  {
    icon: 'bi-hospital',
    title: 'Operating Room & ICU Solutions',
    description:
      'Complete project management and technology solutions for critical care environments.',
  },
  {
    icon: 'bi-person-hearts',
    title: 'ICU & Neonatal Care',
    description:
      'Advanced solutions supporting intensive and neonatal care facilities.',
  },
  {
    icon: 'bi-gear-wide-connected',
    title: 'Biomedical Engineering Services',
    description:
      'Professional support to ensure the safety, reliability, and optimum performance of medical equipment.',
  },
  {
    icon: 'bi-shield-check',
    title: 'Infection Control & Sterilization',
    description:
      'Advanced infection-control and CSSD solutions for healthcare facilities.',
  },
  {
    icon: 'bi-droplet-half',
    title: 'IVF Lab Setup',
    description:
      'Technology and infrastructure solutions for IVF laboratory setup.',
  },
  {
    icon: 'bi-building-check',
    title: 'Healthcare Projects & Partnerships',
    description:
      'Joint Venture solutions in Cardiology, CTVS, and Critical Care Services.',
  },
];

export default function Services() {
  return (
    <ContentPage
      pageId={140}
      title="Services"
      eyebrow="DEPENDABLE SUPPORT"
    >
      {(apiContent) => (
      <div className="services-showcase">
        <div className="services-showcase__intro">
          <span className="services-showcase__eyebrow">HOW WE HELP</span>
          <h2>Support that keeps <span>care moving.</span></h2>
          {/* <p>
            From choosing the right equipment to maintaining it over time, our
            team helps your facility stay prepared.
          </p>
          {apiContent && (
            <div
              className="services-showcase__dynamic-content"
              dangerouslySetInnerHTML={{ __html: apiContent }}
            />
          )} */}
        </div>

        <div className="services-showcase__intro_full">
          
          {apiContent && (
            <div
              className="services-showcase__dynamic-content"
              dangerouslySetInnerHTML={{ __html: apiContent }}
            />
          )}
        </div>

        <div className="services-showcase__grid">
          {services.map((service, index) => (
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

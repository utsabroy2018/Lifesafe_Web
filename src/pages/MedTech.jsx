import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';

const solutionAreas = [
  {
    icon: 'bi-heart-pulse',
    title: 'Cardiology & CTVS',
    description:
      'Technology solutions for interventional cardiology and cardio-thoracic vascular surgery.',
  },
  {
    icon: 'bi-activity',
    title: 'Critical & Intensive Care',
    description:
      'Reliable equipment and clinical infrastructure for ICU, HDU, and emergency care.',
  },
  {
    icon: 'bi-person-hearts',
    title: 'Neonatal & Paediatric Care',
    description:
      'Specialised technology to support safe, attentive care for newborns and children.',
  },
  {
    icon: 'bi-hospital',
    title: 'Operating Room Solutions',
    description:
      'Integrated operating-room technology designed around clinical workflows.',
  },
  {
    icon: 'bi-shield-check',
    title: 'Infection Control & CSSD',
    description:
      'Sterilisation and infection-control solutions that support safer care environments.',
  },
  {
    icon: 'bi-droplet-half',
    title: 'IVF & Fertility Labs',
    description:
      'Purpose-built technology and infrastructure for IVF laboratory setup.',
  },
  {
    icon: 'bi-building-check',
    title: 'Healthcare Projects',
    description:
      'Project planning and technology integration for modern healthcare facilities.',
  },
];

export default function MedTech() {
  return (
    <ContentPage
      pageId={373}
      title="Modern Medical Technology Solutions."
      eyebrow="DEPENDABLE SUPPORT"
    >
      {(apiContent) => (
      <div className="services-showcase">
        <div className="services-showcase__intro">
          <span className="services-showcase__eyebrow">SOLUTION AREAS</span>
          <h2>Built around <span>your clinical needs.</span></h2>
          <p>
            We bring together clinical insight, dependable medical technology,
            and practical project support to create solutions that fit your
            facility and the people it serves.
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
          <span className="services-showcase__eyebrow">SOLUTION AREAS</span>
          <h2>Built around <span>your clinical needs.</span></h2>
        </div> */}


        <div className="services-showcase__grid">
          {solutionAreas.map((service, index) => (
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

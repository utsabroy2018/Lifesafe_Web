import { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import useAsync from '../hooks/useAsync';
import { getCategories } from '../services/catalogApi';
import { submitContactForm } from '../services/wordpressApi';

const featuredCategoryValues = [
  'or-solution',
  'heart-failure',
  'icu-critical-care',
];

const normalizeCategoryValue = (value = '') =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const matchesFeaturedCategory = (category, requestedValues) => {
  const categoryValues = [category.slug, category.name]
    .map(normalizeCategoryValue)
    .filter(Boolean);

  return categoryValues.some((value) =>
    requestedValues.some((requested) => {
      if (!requested) return false;
      return value === requested || value.includes(requested) || requested.includes(value);
    })
  );
};

export default function Home() {
  const { loading, error, data: categories = [] } = useAsync(
    () =>
      getCategories().then((items) => {
        const requestedValues = featuredCategoryValues.map(normalizeCategoryValue);

        const selected = items.filter((category) =>
          matchesFeaturedCategory(category, requestedValues)
        );

        return selected.length >= 6
          ? selected.slice(0, 6)
          : items.slice(0, 6);
      }),
    []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  const contactFormId = import.meta.env.VITE_WP_CF7_FORM_ID || '261';

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const formData = new FormData(event.target);
      const result = await submitContactForm(contactFormId, formData);

      if (result.status === 'mail_sent') {
        setFormStatus({
          type: 'success',
          message: 'Thank you! Your enquiry has been sent successfully.',
        });
        event.target.reset();
      } else {
        setFormStatus({
          type: 'error',
          message: result.message || 'Unable to send enquiry. Please try again later.',
        });
      }
    } catch (submitError) {
      setFormStatus({
        type: 'error',
        message:
          submitError?.message || 'Unable to send enquiry. Please check your connection.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
       <section class="hero">
      <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5500">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="hero-image hero-one"></div>
            {/* <div class="container hero-copy">
              <p class="eyebrow light"><span></span> COMPLETE HOSPITAL SOLUTIONS</p>
              <h1>Technology that keeps <em>care</em> moving.</h1>
              <p>Precision medical equipment, seamless installation and specialist support for modern healthcare teams.
              </p>
              <div class="d-flex flex-wrap gap-3"><a class="btn btn-primary btn-lg" href="#products">Explore Products <i
                    class="bi bi-arrow-right"></i></a><a class="btn btn-outline-light btn-lg" href="#contact">Talk to an
                  Expert</a></div>
            </div> */}
          </div>
          {/* <div class="carousel-item">
            <div class="hero-image hero-two"></div>
            <div class="container hero-copy">
              <p class="eyebrow light"><span></span> OPERATION THEATRE EXPERTISE</p>
              <h1>Built for every critical <em>moment.</em></h1>
              <p>Dependable OT systems designed around the exact needs of surgical teams and patient safety.</p>
              <div class="d-flex flex-wrap gap-3"><a class="btn btn-primary btn-lg" href="#products">View OT Solutions
                  <i class="bi bi-arrow-right"></i></a><a class="btn btn-outline-light btn-lg" href="#contact">Contact
                  Us</a></div>
            </div>
          </div>
          <div class="carousel-item">
            <div class="hero-image hero-three"></div>
            <div class="container hero-copy">
              <p class="eyebrow light"><span></span> BIOMEDICAL ENGINEERING</p>
              <h1>Support that stands <em>behind</em> every device.</h1>
              <p>From commissioning to maintenance, our engineers keep your hospital ready for what matters.</p>
              <div class="d-flex flex-wrap gap-3"><a class="btn btn-primary btn-lg" href="/services">Our Services <i
                    class="bi bi-arrow-right"></i></a><a class="btn btn-outline-light btn-lg" href="#contact">Request
                  Support</a></div>
            </div>
          </div> */}
        </div>
        
        {/* <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev"><i
            class="bi bi-arrow-left"></i></button><button class="carousel-control-next" type="button"
          data-bs-target="#heroCarousel" data-bs-slide="next"><i class="bi bi-arrow-right"></i></button> */}

      </div>
      <div class="hero-shape"></div>
    </section>

      <section class="service-orbits">
      <div class="container">
        <div class="row g-4 justify-content-center">
          <div class="col-md-4" data-aos="fade-up">
            <article class="orbit-card">
              <div class="orbit-icon"><i class="bi bi-cpu"></i></div>
              <div>
                <h3>MedTech</h3>
                <p>Modern medical technology solutions.</p>
              </div><a href="/modern-medical-technology"><i class="bi bi-arrow-up-right orbit-arrow"></i></a>
            </article>
          </div>
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
            <article class="orbit-card">
              <div class="orbit-icon purple"><i class="bi bi-activity"></i></div>
              <div>
                <h3>BME</h3>
                <p>Biomedical engineering.</p>
              </div><a href="/biomedical-engineering"><i class="bi bi-arrow-up-right orbit-arrow"></i></a>
            </article>
          </div>
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
            <article class="orbit-card">
              <div class="orbit-icon red"><i class="bi bi-tools"></i></div>
              <div>
                <h3>Services</h3>
                <p>Installation, AMC &amp; maintenance.</p>
              </div><a href="/services"><i class="bi bi-arrow-up-right orbit-arrow"></i></a>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="section about">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6" data-aos="fade-right">
            <div class="about-media">
                <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1100&q=85"
                alt="Modern hospital corridor" loading="lazy" />
              <div class="experience-pill"><b>Since 2017</b><span>Serving healthcare</span></div>
              <div class="plus-mark">+</div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <p class="eyebrow">ABOUT LIFE SAFE</p>
            <h2>Your trusted partner in <span>better healthcare.</span></h2>
            <p class="lead">Life Safe Medical is a technology-driven healthcare partner providing advanced medical 
              equipment, biomedical engineering and healthcare solutions for hospitals and healthcare 
              institutions.</p>
            <p> We combine reliable technology with professional expertise to deliver 
              comprehensive, cost-effective and patient-focused solutions across cardiology, CTVS 
              and critical care.
</p>
            
        </div>
      </div>
      </div>
    </section>

    <section class="section pt-0">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-6" data-aos="zoom-in">
            <article class="purpose-card mission"><i class="bi bi-bullseye"></i>
              <div>
                <p class="eyebrow">OUR MISSION</p>
                <h3>Making quality care more capable.</h3>
                <p>To equip medical teams with trusted technology and responsive engineering support.</p>
                <a href="/our-mission" class="text-link">View details <i class="bi bi-arrow-up-right"></i></a>
              </div>
            </article>
          </div>
          <div class="col-md-6" data-aos="zoom-in" data-aos-delay="100">
            <article class="purpose-card vision"><i class="bi bi-eye"></i>
              <div>
                <p class="eyebrow">OUR VISION</p>
                <h3>Be the partner hospitals count on.</h3>
                <p>To set a higher standard for service, reliability and long-term clinical value.</p>
                <a href="/our-vision" class="text-link">View details <i class="bi bi-arrow-up-right"></i></a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="container">
        <div class="section-heading text-center" data-aos="fade-up">
          <p class="eyebrow">SOLUTIONS WE PROVIDE</p>
          <h2>Purpose-built for <span>hospital teams.</span></h2>
          <p>Practical expertise and an uncompromising focus on your operational confidence.</p>
        </div>
        <div class="row g-4">
  <div class="col-sm-6 col-lg-4" data-aos="fade-up">
    <article class="why-card">
      <span>01</span><i class="bi bi-activity"></i>
      <h3>End to end Comprehensive Cardiology & Cardio-Thoracic Vascular Surgery (CTVS) Solutions</h3>
      <p>Advanced solutions for exceptional cardiac care.</p>
    </article>
  </div>

  <div class="col-sm-6 col-lg-4" data-aos="fade-up" data-aos-delay="50">
    <article class="why-card">
      <span>02</span><i class="bi bi-hospital"></i>
      <h3>Operating Room & Intensive Care Solutions through project management.</h3>
      <p>Integrated solutions for surgical and critical care.</p>
    </article>
  </div>

  <div class="col-sm-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
    <article class="why-card">
      <span>03</span><i class="bi bi-heart-pulse"></i>
      <h3>ICU & Neonatal Care Solution</h3>
      <p>Reliable care for critical and newborn patients.</p>
    </article>
  </div>

  <div class="col-sm-6 col-lg-4" data-aos="fade-up">
    <article class="why-card">
      <span>04</span><i class="bi bi-shield-check"></i>
      <h3>Advanced solutions for Infection Control & Sterilization Solution (CSSD)</h3>
      <p>Ensuring safe, sterile, and compliant healthcare.</p>
    </article>
  </div>

  <div class="col-sm-6 col-lg-4" data-aos="fade-up" data-aos-delay="50">
    <article class="why-card">
      <span>05</span><i class="bi bi-clipboard2-pulse"></i>
      <h3>IVF Lab Setup</h3>
      <p>Complete IVF laboratory planning and setup.</p>
    </article>
  </div>

  <div class="col-sm-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
    <article class="why-card">
      <span>06</span><i class="bi bi-people"></i>
      <h3>PPP Model or Joint Venture in the field of Cardiology, Cardio Thoracic Surgery and Critical Care Services</h3>
      <p>Strategic partnerships for advanced healthcare delivery.</p>
    </article>
  </div>
</div>
      </div>
    </section>

      {/* Product Categories */}
      <section className="section products" id="products">
        <div className="container">
          <div className="section-heading text-center">
            <p className="eyebrow">PRODUCT CATEGORIES</p>

            <h2>
              Solutions for every <span>clinical need.</span>
            </h2>
          </div>

          {loading ? (
            <div className="col-12">
              <LoadingState />
            </div>
          ) : error ? (
            <div className="col-12">
              <ErrorState message={error} />
            </div>
          ) : (
            <div className="row g-4">
              {categories.map((category) => (
                <div className="col-md-4" key={category.id}>
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link
              className="btn btn-primary"
              to="/products"
            >
              View all categories
            </Link>
          </div>
        </div>
      </section>

      <section class="stats">
      <div class="container">
        <div class="row g-4 text-center" id="statsGrid">
          <div class="col-6 col-lg-3"><strong>10+</strong><span>Years of experience</span></div>
          <div class="col-6 col-lg-3"><strong>250+</strong><span>Healthcare clients</span></div>
          <div class="col-6 col-lg-3"><strong>1200+</strong><span>Products installed</span></div>
          <div class="col-6 col-lg-3"><strong>24+</strong><span>Hour support mindset</span></div>
        </div>
      </div>
    </section>

    <section id="clients" class="section clients">
      <div class="container">
        <div class="section-heading text-center">
          <p class="eyebrow">TRUSTED RELATIONSHIPS</p>
          <h2>Partnering with leaders in <span>medical technology.</span></h2>
          <p>Our trusted network brings proven global and Indian healthcare innovations to hospitals across Eastern India.</p>
        </div>
        <div class="partner-groups">
          <article class="partner-group" data-aos="fade-up">
            <div class="partner-group-heading">
              <span class="partner-group-icon"><i class="bi bi-globe2"></i></span>
              <div>
                <p>GLOBAL EXPERTISE</p>
                <h3>MNC Partners</h3>
              </div>
            </div>
            <ul class="partner-list">
              <li>BPL India Ltd.</li>
              <li>Getinge Medical</li>
              <li>Teleflex Medical</li>
              <li>Integra Lifesciences</li>
              <li>LivaNova</li>
              <li>Peters Surgicals</li>
              <li>Abbott India Pvt. Ltd.</li>
              <li>Hemonart</li>
              <li>Helmier Private Limited <small>(Smith Medical)</small></li>
            </ul>
          </article>
          <article class="partner-group partner-group--indian" data-aos="fade-up" data-aos-delay="120">
            <div class="partner-group-heading">
              <span class="partner-group-icon"><i class="bi bi-heart-pulse"></i></span>
              <div>
                <p>MADE IN INDIA</p>
                <h3>Indian Partners</h3>
              </div>
            </div>
            <ul class="partner-list">
              <li>Allengers Medical Systems Limited</li>
              <li>Zydus Medtech Pvt. Ltd.</li>
              <li>Hebbar Surgical Instruments</li>
              <li>Ace Cath Tech</li>
              <li>Synkromax Biotech</li>
              <li>Invent Biomed</li>
              <li>Ayka Medical Inc.</li>
              <li>Advanced Medtech Solutions</li>
              <li>Kamal Medtech</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <div>
          <p class="eyebrow light">READY WHEN YOU ARE</p>
          <h2>Need medical equipment?<br/><span>Let’s make a plan.</span></h2>
        </div>
        <div class="d-flex flex-wrap gap-3"><a class="btn btn-light btn-lg" href="tel:+919831865644"><i
              class="bi bi-telephone"></i> Call Now</a><a class="btn btn-outline-light btn-lg" href="#contact">Send an
            enquiry</a></div>
      </div>
    </section>

    <section id="contact" class="section contact">
      <div class="container">
        <div class="row g-5">
          <div class="col-lg-5" data-aos="fade-right">
            <p class="eyebrow">CONTACT LIFE SAFE</p>
            <h2>Let’s start a <span>useful conversation.</span></h2>
            <p>Tell us about your equipment or service requirement. Our team will get back to you promptly.</p>
            <div class="contact-detail"><i class="bi bi-telephone"></i>
              <div><span>Call us</span><a href="tel:+919831865644">+91-9831865644</a></div>
            </div>
            <div class="contact-detail"><i class="bi bi-envelope"></i>
              <div><span>Email us</span><a href="mailto:lifesafemedical2017@gmail.com">lifesafemedical2017@gmail.com</a>
              </div>
            </div>
            <div class="map-placeholder"><i class="bi bi-geo-alt-fill"></i><b>1211, East Santoshpur, Mukundapur, Purba Jadavpur,
</b><span>Kolkata - 700099, West Bengal</span></div>
          </div>
          <div className="col-lg-7" data-aos="fade-left">
            <form className="contact-form" id="enquiryForm" onSubmit={handleContactSubmit}>
              <div className="row g-3">
                <input type="hidden" name="_wpcf7" value={contactFormId} />
                <div className="col-md-6">
                  <label htmlFor="name">Your name</label>
                  <input
                    id="name"
                    name="name_"
                    type="text"
                    required
                    placeholder="Name"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone">Phone number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Phone"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="message">How can we help?</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    placeholder="Tell us about your requirement"
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-primary btn-lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send enquiry'} <i className="bi bi-arrow-right"></i>
                  </button>
                  <p
                    id="formMessage"
                    className={`form-message ${formStatus.type === 'error' ? 'text-danger' : ''}`}
                    role="status"
                  >
                    {formStatus.message}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>


    </>
  );
}
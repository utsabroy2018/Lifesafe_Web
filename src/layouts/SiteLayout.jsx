import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { getCategories, getProducts } from '../services/catalogApi';

const nav = [
  ['/', 'Home'],
  ['/about', 'About Life Safe'],
  ['/products', 'Products'],
  ['/services', 'Services'],
  ['/branch', 'Branch'],
  ['/customer-list', 'Customer List'],
  // ['/contact', 'Contact Us'],
  ['https://lsmadmin.opentech4u.co.in/', 'Employee Login'],
];

export default function SiteLayout() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([getCategories(), getProducts()])
      .then(([categoryData, productData]) => {
        if (!active) return;
        setCategories(categoryData || []);
        setProducts(productData || []);
      })
      .catch(() => {
        if (!active) return;
        setCategories([]);
        setProducts([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const megaMenuGroups = useMemo(() => {
    return categories
      .filter((category) => category.slug !== 'uncategorized')
      .map((category) => ({
        ...category,
        products: products
          .filter((product) => product.category === category.slug)
          .slice(0, 12),
      }))
      .filter((category) => category.products.length > 0)
      .slice(0, 12);
  }, [categories, products]);

  return (
    <>
      {/* Top Bar */}
      <div className="emergency-bar">
        <div className="container d-flex justify-content-between">
          <span>
            <i className="bi bi-heart-pulse-fill" /> 24/7 Biomedical Engineering
            Support
          </span>

          <span className="d-none d-md-block">
            +91-9831865644 · lifesafemedical2017@gmail.com
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="site-header">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <span className="brand_logo">
                <img
                  src="/assets/images/logo-lsm.png"
                  alt="Life Safe Medical"
                />
              </span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav"
            >
              <i className="bi bi-list" />
            </button>

            <div
              className="collapse navbar-collapse"
              id="mainNav"
            >
              <ul className="navbar-nav ms-auto align-items-lg-center">
                {nav.map(([to, label]) => {

                  if (label === 'About Life Safe') {
                    return (
                      <li className="nav-item category-nav-item" key={to}>
                        <button
                          type="button"
                          className="nav-link category-nav-item__trigger"
                          aria-expanded={isAboutMenuOpen}
                          aria-controls="about-menu"
                          onClick={() => {
                            setIsAboutMenuOpen((isOpen) => !isOpen);
                          }}
                        >
                          {label}
                          <i className={`bi bi-chevron-${isAboutMenuOpen ? 'up' : 'down'}`} />
                        </button>

                        <div
                          className={`category-dropdown category-dropdown--simple${isAboutMenuOpen ? ' is-open' : ''}`}
                          id="about-menu"
                        >

                          <Link to="/about" onClick={() => setIsAboutMenuOpen(false)}>
                            About Life Safe
                          </Link>

                          <Link to="/our-mission" onClick={() => setIsAboutMenuOpen(false)}>
                            Our Mission
                          </Link>
                          <Link to="/our-vision" onClick={() => setIsAboutMenuOpen(false)}>
                            Our Vision
                          </Link>
                        </div>
                      </li>
                    );
                  }

                  if (label === 'Services') {
                    return (
                      <li className="nav-item category-nav-item" key={to}>
                        <button
                          type="button"
                          className="nav-link category-nav-item__trigger"
                          aria-expanded={isServicesMenuOpen}
                          aria-controls="services-menu"
                          onClick={() => {
                            setIsServicesMenuOpen((isOpen) => !isOpen);
                            setIsAboutMenuOpen(false);
                          }}
                        >
                          {label}
                          <i className={`bi bi-chevron-${isServicesMenuOpen ? 'up' : 'down'}`} />
                        </button>

                        <div
                          className={`category-dropdown category-dropdown--simple${isServicesMenuOpen ? ' is-open' : ''}`}
                          id="services-menu"
                        >

                          <Link to="/services" onClick={() => setIsServicesMenuOpen(false)}>
                            Services
                          </Link>

                          <Link to="/modern-medical-technology" onClick={() => setIsServicesMenuOpen(false)}>
                            Modern Medical Technology Solutions.
                          </Link>
                          <Link to="/biomedical-engineering" onClick={() => setIsServicesMenuOpen(false)}>
                            Biomedical Engineering
                          </Link>
                        </div>
                      </li>
                    );
                  }

                  if (label === 'Products') {
                    return (
                      <li className="nav-item mega-nav-item" key={to}>
                        <NavLink end={to === '/'} className="nav-link" to={to}>
                          {label}
                        </NavLink>

                        <div className="mega-menu">
                          <div className="container">
                            <div className="mega-menu__grid">
                              <Link className="mega-menu__all" to="/products">
                                All Products <i className="bi bi-arrow-right" />
                              </Link>

                              {megaMenuGroups.map((category) => (
                                <div className="mega-menu__column" key={category.id}>
                                  <Link className="mega-menu__heading" to={`/products/${category.slug}`}>
                                    {category.name}
                                  </Link>

                                  <div className="mega-menu__links">
                                    {category.products.map((product) => (
                                      <Link key={product.id} to={`/product/${product.slug}`}>
                                        {product.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }

                  if (to.startsWith('http')) {
                    return (
                      <li className="nav-item" key={to}>
                        <a
                          className="nav-link"
                          href={to}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {label}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li className="nav-item" key={to}>
                      <NavLink end={to === '/'} className="nav-link" to={to}>
                        {label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              <Link
                className="btn btn-primary ms-lg-3"
                to="/contact"
              >
                Request Quote <i className="bi bi-arrow-up-right" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="row g-4 pb-5">
            <div className="col-lg-4">
              <img
                className="footer-logo"
                src="/assets/images/logo-lsm_footer.png"
                alt="Life Safe Medical"
              />

              <p>
                Medical technology solutions, hospital equipment and dependable
                biomedical engineering support.
              </p>

              <div class="footer-social"><a href="#"><i class="bi bi-facebook"></i></a><a href="#"><i
                class="bi bi-instagram"></i></a><a href="#"><i class="bi bi-linkedin"></i></a><a href="#"><i
                class="bi bi-youtube"></i></a></div>
                
            </div>

            <div className="col-6 col-lg-2">
              <h3>Explore</h3>

              <Link to="/about">About us</Link>
              <Link to="/products">Products</Link>
              <Link to="/services">Services</Link>
              <Link to="/customer-list">Customers</Link>
            </div>

            <div className="col-6 col-lg-3">
              <h3>Contact</h3>

              <a href="tel:+919831865644">
                +91-9831865644
              </a>

              <a href="mailto:lifesafemedical2017@gmail.com">
                lifesafemedical2017@gmail.com
              </a>

              <span>Kolkata, West Bengal, India</span>
            </div>

            <div class="col-6 col-lg-3">
          <h3>Branch offices</h3>
          <span>Kolkata (Head Quarter)</span>
          <span>Raipur</span>
          <span>Bhubaneswar</span>
          <span>Siliguri</span>
          <span>Guwahati</span>
        </div>

          </div>

          <div class="footer-bottom"><span>© 2026 Life Safe Medical. All rights reserved.</span><span><a href="#">Privacy
            policy</a><a href="#">Terms of use</a></span></div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        className="whatsapp"
        href="https://wa.me/919831865644"
        aria-label="Chat on WhatsApp"
      >
        <i className="bi bi-whatsapp" />
      </a>
    </>
  );
}

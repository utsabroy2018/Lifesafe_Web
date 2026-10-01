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
  // ['https://lsmadmin.opentech4u.co.in/', 'Employee Login'],
];

export default function SiteLayout() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState('');

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
          .filter((product) =>
            (product.categories || []).some(
              (productCategory) => productCategory.slug === category.slug,
            ) || product.category === category.slug,
          ),
      }))
      .filter((category) => category.products.length > 0)
  }, [categories, products]);

  // Keep each category card in a dedicated column. This avoids grid rows taking
  // the height of the tallest card and leaving empty space below short lists.
  const megaMenuColumns = useMemo(() => {
    const columnCount = 4;
    return Array.from({ length: columnCount }, (_, columnIndex) =>
      megaMenuGroups.filter((_, categoryIndex) => categoryIndex % columnCount === columnIndex),
    );
  }, [megaMenuGroups]);

  const catalogResults = useMemo(() => {
    const query = catalogQuery.trim().toLocaleLowerCase();
    if (query.length < 2) return [];
    const matchingCategories = categories
      .filter((category) => category.slug !== 'uncategorized' && category.name.toLocaleLowerCase().includes(query))
      .slice(0, 5)
      .map((category) => ({ ...category, type: 'Category', to: `/products/${category.slug}` }));
    const matchingProducts = products
      .filter((product) => product.name.toLocaleLowerCase().includes(query))
      .slice(0, 7)
      .map((product) => ({ ...product, type: 'Product', to: `/product/${product.slug}` }));
    return [...matchingCategories, ...matchingProducts];
  }, [catalogQuery, categories, products]);

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
            {/* {JSON.stringify(megaMenuGroups, null, 2)} */}
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
              aria-expanded={isNavOpen}
              aria-controls="mainNav"
              aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => setIsNavOpen((isOpen) => !isOpen)}
            >
              <i className={`bi bi-${isNavOpen ? 'x-lg' : 'list'}`} />
            </button>

            <div
              className={`navbar-collapse${isNavOpen ? ' show' : ''}`}
              id="mainNav"
            >
              <ul className="navbar-nav ms-auto align-items-lg-center">
                {nav.map(([to, label]) => {

                  if (label === 'About Life Safe') {
                    return (
                      <li className="nav-item category-nav-item" key={to}>
                        <button
                          type="button"
                          className="nav-link"
                          aria-expanded={isAboutMenuOpen}
                          aria-controls="about-menu"
                          onClick={() => { setIsAboutMenuOpen((isOpen) => !isOpen); setIsServicesMenuOpen(false); }}
                        >
                          {label}
                          <i className={`bi bi-chevron-${isAboutMenuOpen ? 'up' : 'down'}`} />
                        </button>

                        <div
                          className={`category-dropdown category-dropdown--simple${isAboutMenuOpen ? ' is-open' : ''}`}
                          id="about-menu"
                        >

                          <Link to="/about" onClick={() => { setIsAboutMenuOpen(false); setIsNavOpen(false); }}>
                            About Life Safe
                          </Link>

                          <Link to="/our-mission" onClick={() => { setIsAboutMenuOpen(false); setIsNavOpen(false); }}>
                            Our Mission
                          </Link>
                          <Link to="/our-vision" onClick={() => { setIsAboutMenuOpen(false); setIsNavOpen(false); }}>
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
                          className="nav-link"
                          aria-expanded={isServicesMenuOpen}
                          aria-controls="services-menu"
                          onClick={() => { setIsServicesMenuOpen((isOpen) => !isOpen); setIsAboutMenuOpen(false); }}
                        >
                          {label}
                          <i className={`bi bi-chevron-${isServicesMenuOpen ? 'up' : 'down'}`} />
                        </button>

                        <div
                          className={`category-dropdown category-dropdown--simple${isServicesMenuOpen ? ' is-open' : ''}`}
                          id="services-menu"
                        >

                          <Link to="/services" onClick={() => { setIsServicesMenuOpen(false); setIsNavOpen(false); }}>
                            Services
                          </Link>

                          <Link to="/disposables-implants" onClick={() => { setIsServicesMenuOpen(false); setIsNavOpen(false); }}>
                            Disposables & Implants
                          </Link>

                          <Link to="/modern-medical-technology" onClick={() => { setIsServicesMenuOpen(false); setIsNavOpen(false); }}>
                            Modern Medical Technology Solutions.
                          </Link>
                          <Link to="/biomedical-engineering" onClick={() => { setIsServicesMenuOpen(false); setIsNavOpen(false); }}>
                            Biomedical Engineering
                          </Link>
                        </div>
                      </li>
                    );
                  }

                  if (label === 'Products') {
                    return (
                      <li className="nav-item mega-nav-item category-nav-item__trigger" key={to} 
                      aria-expanded={setIsProductsMenuOpen}
                      onClick={() => { setIsProductsMenuOpen((isOpen) => !isOpen); setIsServicesMenuOpen(false); setIsAboutMenuOpen(false); }}
                      >
                      <NavLink end={to === '/'} className="nav-link" to={to} onClick={() => { setIsNavOpen(false); setIsProductsMenuOpen(false); }}>
                          {label}
                          <i className={`bi bi-chevron-${isProductsMenuOpen ? 'up' : 'down'}`} />
                        </NavLink>

                        <div className="mega-menu">
                          <div className="container">
                            <div className="mega-menu__grid">
                              <Link className="mega-menu__all" to="/products">
                                All Products <i className="bi bi-arrow-right" />
                                
                              </Link>

                              {megaMenuColumns.map((column, columnIndex) => (
                                <div className="mega-menu__category-column" key={columnIndex}>
                                  {column.map((category) => (
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
                      <NavLink end={to === '/'} className="nav-link" to={to} onClick={() => setIsNavOpen(false)}>
                        {label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              
              <div className="catalog-search">
                <label className="visually-hidden" htmlFor="catalog-search-input">Search categories and products</label>
                <div className="catalog-search__field">
                  <i className="bi bi-search" aria-hidden="true" />
                  <input
                    id="catalog-search-input"
                    type="search"
                    value={catalogQuery}
                    onChange={(event) => setCatalogQuery(event.target.value)}
                    onKeyDown={(event) => { if (event.key === 'Escape') setCatalogQuery(''); }}
                    placeholder="Search Products or categories"
                    autoComplete="off"
                    aria-controls="catalog-search-results"
                    aria-expanded={catalogQuery.trim().length >= 2}
                  />
                </div>
                {catalogQuery.trim().length >= 2 && (
                  <div className="catalog-search__results" id="catalog-search-results" role="listbox">
                    {catalogResults.length ? catalogResults.map((result) => (
                      <Link key={`${result.type}-${result.id}`} to={result.to} role="option" onClick={() => setCatalogQuery('')}>
                        <span>{result.name}</span><small>{result.type}</small>
                      </Link>
                    )) : <p>No matching categories or products.</p>}
                  </div>
                )}
              </div>

              <Link
                className="btn btn_cus btn-primary ms-lg-3 custom_request_quote_btn"
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

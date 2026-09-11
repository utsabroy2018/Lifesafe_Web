import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';

import PageBanner from '../components/PageBanner';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ProductCard from '../components/ProductCard';

import useAsync from '../hooks/useAsync';
import {
  getProduct,
  getProducts,
} from '../services/catalogApi';

export default function ProductDetails() {
  const { productSlug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  const state = useAsync(
    () => getProduct(productSlug),
    [productSlug]
  );

  const related = useAsync(
    getProducts,
    []
  );

  if (state.loading) {
    return <LoadingState fullPage />;
  }

  if (state.error || !state.data) {
    return (
      <ErrorState
        message={
          state.error || 'Product not found.'
        }
      />
    );
  }

  const product = state.data;
  const productFeatures = product.features || [];
  const productSpecifications = product.specifications || {};
  const viewSiteUrl = /^https?:\/\//i.test(product.viewSiteUrl || '')
    ? product.viewSiteUrl
    : '';

  const renderSpecValue = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => (item && typeof item === 'object' ? item.name || JSON.stringify(item) : item))
        .join(', ');
    }
    if (value && typeof value === 'object') {
      return value.name || JSON.stringify(value);
    }
    return value ?? '-';
  };

  const escapeHtml = (str = '') =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const getShortDescriptionHtml = () => {
    const raw = product.short_description || product.description || '';
    // If it already contains HTML tags, trust and return as-is.
    if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
    // Otherwise escape and convert paragraphs/newlines to HTML
    const paragraphs = String(raw)
      .split(/\r?\n\r?\n/)
      .map((p) => `<p>${escapeHtml(p).replace(/\r?\n/g, '<br/>')}</p>`)
      .join('');
    return paragraphs || '';
  };


  
  const getShortDescriptionHtml_Top = () => {
    const raw = product.description || product.description || '';
    // If it already contains HTML tags, trust and return as-is.
    if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
    // Otherwise escape and convert paragraphs/newlines to HTML
    const paragraphs = String(raw)
      .split(/\r?\n\r?\n/)
      .map((p) => `<p>${escapeHtml(p).replace(/\r?\n/g, '<br/>')}</p>`)
      .join('');
    return paragraphs || '';
  };

  return (
    <>
      <PageBanner
        title={product.name}
        eyebrow="MEDICAL EQUIPMENT"
      />

      <section className="section">
        <div className="container">
          <div className="row g-5">
            {/* Product Image */}
            <div className="col-lg-6">
            <div className="detail-gallery">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                <img
                  src={typeof product.images?.[selectedImage] === 'string' ? product.images[selectedImage] : product.images?.[selectedImage]?.src || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {product.images?.length > 1 && (
                <div className="mt-4 d-flex gap-3 overflow-auto pb-2 thumbnail-scrollbar">
                  {product.images.map((img, idx) => {
                    const src = typeof img === 'string' ? img : img.src;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${selectedImage === idx ? 'border-primary' : 'border-transparent'}`}
                        style={{ minWidth: '5rem' }}
                      >
                        <img src={src} alt={`${product.name} thumbnail ${idx + 1}`} className="w-100 h-100 object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

            {/* Product Details */}
            <div className="col-lg-6">
              <span className="tag">
                Product catalogue
              </span>

              <h2 className="mt-3">
                {product.name}
              </h2>

              
                {/* {product.description?.replace(
                  /<[^>]*>/g,
                  ''
                )} */}
                <div
                      className="product-short-description mt-2"
                      dangerouslySetInnerHTML={{ __html: getShortDescriptionHtml_Top() }}
                    />

                {viewSiteUrl && (
                  <a
                    className="btn btn-primary mt-4"
                    href={viewSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Site <i className="bi bi-arrow-up-right" />
                  </a>
                )}

                {/* Here want to display Product tags */}
                {product.tags?.length > 0 && (
                  <div className="mt-3 d-flex flex-wrap align-items-center gap-2">
                    <span className="fw-semibold manufacture">Manufacture By:</span>
                    {product.tags.map((tag) => (
                      <span key={tag.id} className="badge bg-secondary badge_cus">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
             

              {/* <h3 className="h5 mt-4">
                Key features
              </h3>

              <ul className="product-description-list">
                {productFeatures.map((feature) => (
                  <li key={feature}>
                    {feature}
                  </li>
                ))}
              </ul> */}

              {/* <Link
                className="btn btn-primary mt-4"
                to="/contact"
              >
                Send an enquiry{' '}
                <i className="bi bi-arrow-up-right" />
              </Link> */}
            </div>
          </div>

          {/* Description + Specifications Tabs */}
          <div className="row mt-5 g-5">
            <div className="col-lg-12 mt-0" id="specifications">
              <div className="product-tabs">
                <ul className="nav product-tab-nav" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="description-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#description-pane"
                      type="button"
                      role="tab"
                      aria-controls="description-pane"
                      aria-selected="true"
                    >
                      Description
                    </button>
                  </li>
                  {/* <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="specification-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#specification-pane"
                      type="button"
                      role="tab"
                      aria-controls="specification-pane"
                      aria-selected="false"
                    >
                      Specification
                    </button>
                  </li> */}
                </ul>

                <div className="tab-content product-tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="description-pane"
                    role="tabpanel"
                    aria-labelledby="description-tab"
                    tabIndex={0}
                  >
                    {/* <h3>{product.name}</h3> */}
                    <div
                      className="product-short-description mt-2"
                      dangerouslySetInnerHTML={{ __html: getShortDescriptionHtml() }}
                    />
                  </div>

                  <div
                    className="tab-pane fade"
                    id="specification-pane"
                    role="tabpanel"
                    aria-labelledby="specification-tab"
                    tabIndex={0}
                  >
                    <h3>Technical specifications</h3>

                    <table className="table spec-table mt-3">
                      <tbody>
                        {Object.entries(productSpecifications).length ? (
                          Object.entries(productSpecifications).map(([key, value]) => (
                            <tr key={key}>
                              <th>{key}</th>
                              <td>{renderSpecValue(value)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2">No technical specifications available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Carousel */}
          {related.data && related.data.length > 0 && (() => {
            const items = related.data.filter((item) => item.slug !== product.slug);
            if (!items.length) return null;
            const chunkSize = 4;
            const slides = [];
            for (let i = 0; i < items.length; i += chunkSize) slides.push(items.slice(i, i + chunkSize));
            return (
              <section className="related-products" aria-labelledby="related-products-title">
                <div className="d-flex align-items-end justify-content-between gap-3 mb-4">
                  <div>
                    <p className="eyebrow">EXPLORE MORE</p>
                    <h3 id="related-products-title">Related products</h3>
                  </div>
                  <div className="related-carousel-controls">
                    <button type="button" data-bs-target="#relatedProductsCarousel" data-bs-slide="prev" aria-label="Previous related product"><i className="bi bi-arrow-left" /></button>
                    <button type="button" data-bs-target="#relatedProductsCarousel" data-bs-slide="next" aria-label="Next related product"><i className="bi bi-arrow-right" /></button>
                  </div>
                </div>

                <div id="relatedProductsCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {slides.map((slideItems, idx) => (
                      <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={idx}>
                        <div className="row g-3">
                          {slideItems.map((item) => (
                            <div className="col-6 col-lg-3" key={item.id}>
                              <ProductCard product={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })()}
        </div>
      </section>
    </>
  );
}

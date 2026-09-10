import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import PageBanner from '../components/PageBanner';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

import useAsync from '../hooks/useAsync';
import {
  getCategories,
  getProducts,
} from '../services/catalogApi';

export default function ProductListing() {
  const { categorySlug } = useParams();
  const [expandedCategoryIds, setExpandedCategoryIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug]);

  const categoryState = useAsync(
    getCategories,
    []
  );

  // Find the current category
  const currentCategory = categoryState.data?.find(
    (category) => category.slug === categorySlug
  );

  // Get sub-categories if current category is a main category
  const subCategories = categoryState.data?.filter(
    (category) => category.parent_id === currentCategory?.id
  ) || [];

  // Get products for current category and all its sub-categories
  const productState = useAsync(
    async () => {
      if (!categorySlug) {
        // Get all products if no category is selected
        return categoryState.data ? await getProducts() : [];
      }

      const products = await getProducts(categorySlug);

      // If this is a main category, also get products from sub-categories
      if (subCategories.length > 0) {
        let allProducts = [...products];
        for (const subCat of subCategories) {
          const subProducts = await getProducts(subCat.slug);
          allProducts = [...allProducts, ...subProducts];
        }
        return allProducts;
      }

      return products;
    },
    [categorySlug, subCategories.length]
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = productState.data?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil((productState.data?.length || 0) / ITEMS_PER_PAGE);

  const title =
    currentCategory?.name || 'Products';

  const toggleCategory = (categoryId) => {
    setExpandedCategoryIds((expandedIds) => (
      expandedIds.includes(categoryId)
        ? expandedIds.filter((id) => id !== categoryId)
        : [...expandedIds, categoryId]
    ));
  };

  return (
    <>
      <PageBanner
        title={title}
        eyebrow="MEDICAL EQUIPMENT CATALOGUE"
      />

      <section className="section">
        <div className="container">
          <div className="row g-4">
            {/* Categories Sidebar */}
            <aside className="col-lg-3">
              <div className="category-filter">
                <div className="category-filter__heading">
                  <i className="bi bi-funnel" />
                  <h3>Categories</h3>
                </div>

                <Link to="/products">
                  All Products
                </Link>

                {categoryState.data
                  ?.filter((category) => category.parent_id === 0)
                  .map((category) => {
                    const children = categoryState.data.filter(
                      (child) => child.parent_id === category.id
                    );
                    const hasChildren = children.length > 0;
                    const containsActiveChild = children.some(
                      (child) => child.slug === categorySlug
                    );
                    const isExpanded = expandedCategoryIds.includes(category.id);
                    const isActive = category.slug === categorySlug
                      || containsActiveChild;

                    if (!hasChildren) {
                      return (
                        <Link
                          key={category.id}
                          to={`/products/${category.slug}`}
                          className={isActive ? 'active' : ''}
                        >
                          {category.name}
                          <span>{category.count ?? ''}</span>
                        </Link>
                      );
                    }

                    return (
                      <div className="category-filter__group" key={category.id}>
                        <button
                          type="button"
                          className={`category-filter__toggle${isActive ? ' active' : ''}`}
                          onClick={() => toggleCategory(category.id)}
                          aria-expanded={isExpanded}
                        >
                          {category.name}
                          <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} />
                        </button>

                        {isExpanded && (
                          <div className="category-filter__children">
                            {children.map((child) => (
                              <Link
                                key={child.id}
                                to={`/products/${child.slug}`}
                                className={child.slug === categorySlug ? 'active' : ''}
                              >
                                {child.name}
                                {child.count > 0 && (
                                  <span>{child.count}</span>
                                )}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </aside>

            {/* Product Listing */}
            <div className="col-lg-9">
              {/* Sub-categories Section */}
              {/* <p>Description</p> */}
              {currentCategory?.description && (
                <p>{currentCategory.description}</p>
              )}

              {subCategories.length > 0 && (
                <div className="subcategories-section mb-5">
                  <h3 className="mb-4">Sub-Categories</h3>
                  <div className="row g-4 mb-5">
                    {subCategories.map((category) => (
                      <div
                        className="col-sm-6 col-lg-4"
                        key={category.id}
                      >
                        <CategoryCard
                          category={category}
                        />
                      </div>
                    ))}
                  </div>
                  <hr />
                </div>
              )}

              {/* Products Section */}
              <div className="products-section">
                <div className="product-listing-header">
                  <p>
                    Showing{' '}
                    <strong>
                      {productState.data?.length ? `${startIndex + 1}-${Math.min(endIndex, productState.data.length)} of ${productState.data.length}` : 0}
                    </strong>{' '}
                    products
                  </p>
                </div>

                {productState.loading ? (
                  <LoadingState />
                ) : productState.error ? (
                  <ErrorState
                    message={productState.error}
                  />
                ) : productState.data.length ? (
                  <>
                    <div className="row g-4">
                      {paginatedProducts.map((product) => (
                        <div
                          className="col-sm-6 col-xl-4"
                          key={product.id}
                        >
                          <ProductCard
                            product={product}
                          />
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center mt-5">
                        <nav aria-label="Product pagination">
                          <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                              >
                                Previous
                              </button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => setCurrentPage(i + 1)}
                                >
                                  {i + 1}
                                </button>
                              </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-state">
                    No products are currently
                    listed in this category.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

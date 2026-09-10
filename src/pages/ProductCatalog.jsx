import PageBanner from '../components/PageBanner';
import CategoryCard from '../components/CategoryCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import useAsync from '../hooks/useAsync';
import { getCategories } from '../services/catalogApi';

export default function ProductCatalog() {
  const { loading, error, data } = useAsync(
    getCategories,
    []
  );

  // Filter to show only main categories (parent_id === 0)
  const mainCategories = data?.filter(
    (category) => category.parent_id === 0
  ) || [];

  return (
    <>
      <PageBanner
        title="Products"
        eyebrow="MEDICAL EQUIPMENT CATALOGUE"
      />

      <section className="section">
        <div className="container">
          <div className="section-heading text-center">
            <p className="eyebrow">
              FIND THE RIGHT SOLUTION
            </p>

            <h2>
              Explore our <span>product categories.</span>
            </h2>

            <p>
              Choose a category to view equipment for your
              facility.
            </p>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : (
            <div className="row g-4">
              {mainCategories.map((category) => (
                <div
                  className="col-sm-6 col-lg-4"
                  key={category.id}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
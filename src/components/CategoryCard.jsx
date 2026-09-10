import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <article className="product-card">
      <Link
        to={`/products/${category.slug}`}
        aria-label={`View ${category.name} products`}
      >
        <div className="product-image">
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
          />

          <span>Product category</span>
        </div>
      </Link>

      <div className="product-content">
        <h3>{category.name}</h3>

        {/* <p>
          {category.description ||
            'Explore our medical equipment range.'}
        </p> */}

        <Link to={`/products/${category.slug}`}>
          View products <i className="bi bi-arrow-up-right" />
        </Link>
      </div>
    </article>
  );
}
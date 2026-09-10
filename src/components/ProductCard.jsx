import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        <span>
          {product.category?.replaceAll("-", " ")}
        </span>
      </div>

      <div className="product-content">
        <h3>{product.name}</h3>

        {/* <p>{product.short_description}</p> */}

        <Link to={`/product/${product.slug}`}>
          View details <i className="bi bi-arrow-up-right" />
        </Link>
      </div>
    </article>
  );
}
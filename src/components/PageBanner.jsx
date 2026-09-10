import { Link } from "react-router-dom";

export default function PageBanner({
  title,
  eyebrow = "LIFE SAFE MEDICAL",
  imageUrl,
}) {
  const background = imageUrl
    ? `linear-gradient(105deg, #102b46e8, #1e88e5bd), url('${imageUrl}') center/cover`
    : "linear-gradient(105deg, #102b46e8, #1e88e5bd), url('https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1800&q=85') center/cover";

  return (
    <section
      className="page-banner"
      style={{
        background,
      }}
    >
      <div className="container">
        <p className="eyebrow light">{eyebrow}</p>

        <h1>{title}</h1>

        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>

          <li className="breadcrumb-item active">
            {title}
          </li>
        </ol>
      </div>
    </section>
  );
}
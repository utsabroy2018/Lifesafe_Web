import ContentPage from "./ContentPage";

const services = [
  "Biomedical engineering support",
  "Equipment installation and commissioning",
  "Preventive maintenance",
  "Product consultation",
];

export default function Services() {
  return (
    <ContentPage
      pageId={140}
      title="Services"
      eyebrow="DEPENDABLE SUPPORT"
    >
      {/* <h2>
        Service beyond <span>the supply.</span>
      </h2>

      <div className="row g-4 mt-3">
        {services.map((item) => (
          <div className="col-sm-6 col-lg-4" key={item}>
            <article className="inner-card">
              <i className="icon bi bi-heart-pulse" />

              <h3>{item}</h3>

              <p>
                Responsive, professional support for your clinical equipment
                and facility needs.
              </p>
            </article>
          </div>
        ))}
      </div> */}
    </ContentPage>
  );
}
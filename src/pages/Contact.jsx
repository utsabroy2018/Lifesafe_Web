import { useState } from "react";
import ContentPage from "./ContentPage";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <ContentPage
      slug="contact"
      title="Contact Us"
      eyebrow="GET IN TOUCH"
    >
      <h2>
        Let's find the right <span>solution.</span>
      </h2>

      <div className="row g-5 mt-2">
        <div className="col-lg-5">
                        {/* <p className="eyebrow">LIFE SAFE MEDICAL</p>
                        <h2>Let’s start a <span>useful conversation.</span></h2> */}
                        <p>Speak with our team about medical equipment, service support or a specific project
                            requirement.</p>
                        <div className="contact-detail"><i className="bi bi-telephone"></i>
                            <div><span>Phone</span><a href="tel:+919831865644">+91-9831865644</a></div>
                        </div>
                        <div className="contact-detail"><i className="bi bi-envelope"></i>
                            <div><span>Email</span><a
                                    href="mailto:lifesafemedical2017@gmail.com">lifesafemedical2017@gmail.com</a></div>
                        </div>
                        <div className="contact-detail"><i className="bi bi-clock"></i>
                            <div><span>Working hours</span><a href="#">Mon–Sat, 9:30 AM–6:30 PM</a></div>
                        </div>
                        <div className="map-placeholder"><i className="bi bi-geo-alt-fill"></i><b>1211, East Santoshpur, Mukundapur, Purba Jadavpur,
</b><span>Kolkata - 700099, West Bengal</span></div>
                    </div>

        <div className="col-lg-7">
                        <div className="contact-form">
                            <div className="row g-3">
  <div className="col-md-6 form-floating">
    <input
      type="text"
      className="form-control"
      id="n"
      placeholder="Name"
    />
    <label htmlFor="n">Your name</label>
  </div>

  <div className="col-md-6 form-floating">
    <input
      type="tel"
      className="form-control"
      id="p"
      placeholder="Phone"
    />
    <label htmlFor="p">Phone number</label>
  </div>

  <div className="col-12 form-floating">
    <input
      type="email"
      className="form-control"
      id="e"
      placeholder="Email"
    />
    <label htmlFor="e">Email address</label>
  </div>

  <div className="col-12 form-floating">
    <select
      className="form-select"
      id="d"
      defaultValue=""
    >
      <option value="" disabled>
        Select Department
      </option>
      <option value="Sales">Sales</option>
      <option value="Service">Service</option>
      <option value="Support">Support</option>
      <option value="Accounts">Accounts</option>
      <option value="Career">Career</option>
    </select>

    <label htmlFor="d">Department</label>
  </div>

  <div className="col-12 form-floating">
    <textarea
      className="form-control"
      id="m"
      placeholder="How can we help?"
      style={{ height: "130px" }}
    />
    <label htmlFor="m">How can we help?</label>
  </div>

  <div className="col-12">
    <button
      type="submit"
      className="btn btn-primary btn-lg"
    >
      Send enquiry <i className="bi bi-arrow-right"></i>
    </button>
  </div>
</div>
                        </div>
                    </div>
      </div>
    </ContentPage>
  );
}
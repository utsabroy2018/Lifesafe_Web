import { useEffect, useMemo, useState } from "react";
import ContentPage from "./ContentPage";
import useAsync from "../hooks/useAsync";
import { getPageById } from "../services/wordpressApi";

const CUSTOMERS_PER_PAGE = 10;
const BRANCHES = [
  { name: "Kolkata", state: "West Bengal", type: "Headquarters", x: 642, y: 510 },
  { name: "Raipur", state: "Chhattisgarh", type: "Branch office", x: 474, y: 536 },
  { name: "Bhubaneswar", state: "Odisha", type: "Branch office", x: 552, y: 565 },
  { name: "Siliguri", state: "West Bengal", type: "Branch office", x: 645, y: 380 },
  { name: "Guwahati", state: "Assam", type: "Branch office", x: 776, y: 395 },
];

export default function Branch() {
  const page = useAsync(() => getPageById(152), []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [indiaMapSvg, setIndiaMapSvg] = useState("");
  useEffect(() => {
    fetch("/assets/images/india.svg")
      .then((response) => response.text())
      .then((svg) => setIndiaMapSvg(svg.slice(svg.indexOf("<svg"))))
      .catch(() => setIndiaMapSvg(""));
  }, []);
  const customerList = useMemo(
    () => page.data?.acf?.customer_list || [],
    [page.data]
  );
  const locations = useMemo(
    () => new Set(customerList.map((item) => item.state).filter(Boolean)).size,
    [customerList]
  );
  const visibleCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = customerList.filter((item) =>
      [item.name, item.state].some((value) => String(value || "").toLowerCase().includes(query))
    );
    return [...filtered].sort((first, second) => {
      const comparison = String(first[sort.key] || "").localeCompare(String(second[sort.key] || ""), undefined, { sensitivity: "base" });
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [customerList, searchTerm, sort]);
  const totalPages = Math.ceil(visibleCustomers.length / CUSTOMERS_PER_PAGE);
  const paginatedCustomers = visibleCustomers.slice(
    (currentPage - 1) * CUSTOMERS_PER_PAGE,
    currentPage * CUSTOMERS_PER_PAGE
  );
  const changeSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };
  const updateSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  const sortIcon = (key) => sort.key === key ? (sort.direction === "asc" ? "bi-arrow-up" : "bi-arrow-down") : "bi-arrow-down-up";
  const featuredCustomers = customerList.slice(0, 8);

  return (
    <ContentPage
      pageId={366}
      title="Branch List"
      eyebrow="TRUSTED BY HEALTHCARE PROVIDERS"
    >
      <div className="customers-hero">
        <div>
          <p className="customers-kicker">Our branch network</p>
          <h2>Closer support, <span>across India.</span></h2>
          <p className="customers-lead">Our head office and branch offices help us deliver dependable medical technology, service, and support wherever you need it.</p>
        </div>
      </div>

      <section className="branch-map-section" aria-labelledby="branch-map-title">
        <div className="branch-map-heading">
          <div><p className="customers-kicker">Our locations</p><h2 id="branch-map-title">Our footprint in India</h2></div>
          {/* <p>Life Safe Medical has offices in five locations across India.</p> */}
        </div>
        <div className="branch-map-layout">
          {/* India Map */}
          <div className="india-map" role="img" aria-label="Map of India with branch office locations">
            <div className="india-map-art" dangerouslySetInnerHTML={{ __html: indiaMapSvg }} />
            <svg className="branch-map-markers" viewBox="0 0 1000 1000" aria-hidden="true">{BRANCHES.map((branch) => <g key={branch.name}><circle cx={branch.x} cy={branch.y} r="13" /><circle cx={branch.x} cy={branch.y} r="5" /><text x={branch.x + 16} y={branch.y - 13}>{branch.name}</text></g>)}</svg>
          </div>
          <aside className="branch-map-card" aria-label="Branch office locations"><span className="branch-card-icon"><i className="bi bi-geo-alt-fill" /></span><p>Branch locations</p><h3>Our offices</h3><div className="branch-location-list">{BRANCHES.map((branch) => <div key={branch.name}><strong>{branch.name}</strong><span>{branch.state} · {branch.type}</span></div>)}</div></aside>
        </div>
      </section>

      {/* {featuredCustomers.length > 0 && <div className="customer-marquee" aria-label="Featured healthcare partners">
        <span className="customer-marquee-label"><i className="bi bi-stars" /> Our partners</span>
        <div className="customer-marquee-window"><div className="customer-marquee-track">
          {[...featuredCustomers, ...featuredCustomers].map((item, index) => <span className="customer-marquee-item" key={`${item.name}-${index}`}><i className="bi bi-hospital" /> {item.name}</span>)}
        </div></div>
      </div>} */}

      {/* <section className="customer-directory" aria-labelledby="customer-directory-title">
        <div className="customer-directory-header">
          <div><p className="customers-kicker">Partner directory</p><h3 id="customer-directory-title">Find a healthcare partner</h3></div>
          <span className="customer-result-count">{visibleCustomers.length} {visibleCustomers.length === 1 ? "partner" : "partners"}</span>
        </div>
        <div className="customer-controls">
          <label className="customer-search"><i className="bi bi-search" /><input type="search" value={searchTerm} onChange={(event) => updateSearch(event.target.value)} placeholder="Search hospital or location..." aria-label="Search hospitals and locations" />{searchTerm && <button type="button" onClick={() => updateSearch("")} aria-label="Clear search"><i className="bi bi-x-lg" /></button>}</label>
          <p>Click a column heading to sort the directory.</p>
        </div>
        <div className="table-responsive customers-table-wrapper">
          <table className="table customers-table">
          <thead>
            <tr>
              <th scope="col" className="customer-serial">No.</th>
              <th scope="col" aria-sort={sort.key === "name" ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}><button type="button" className="customer-sort-button" onClick={() => changeSort("name")}>Hospital name <i className={`bi ${sortIcon("name")}`} /></button></th>
              <th scope="col" aria-sort={sort.key === "state" ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}><button type="button" className="customer-sort-button" onClick={() => changeSort("state")}>Location <i className={`bi ${sortIcon("state")}`} /></button></th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.length ? (
              paginatedCustomers.map((item, idx) => (
                <tr key={`${item.name}-${item.state}-${idx}`}>
                  <td className="customer-serial">{String((currentPage - 1) * CUSTOMERS_PER_PAGE + idx + 1).padStart(2, "0")}</td>
                  <td><span className="customer-hospital-icon"><i className="bi bi-hospital" /></span>{item.name}</td>
                  <td><span className="customer-location"><i className="bi bi-geo-alt" />{item.state}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="customer-empty"><i className="bi bi-search" /><strong>No matching partner found</strong><span>Try another hospital name or location.</span></td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        {totalPages > 1 && (
          <nav className="customer-pagination" aria-label="Customer directory pages">
            <span>Showing {(currentPage - 1) * CUSTOMERS_PER_PAGE + 1}–{Math.min(currentPage * CUSTOMERS_PER_PAGE, visibleCustomers.length)} of {visibleCustomers.length}</span>
            <div className="pagination-actions">
              <button type="button" onClick={() => setCurrentPage((value) => value - 1)} disabled={currentPage === 1} aria-label="Previous page"><i className="bi bi-chevron-left" /></button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button type="button" key={pageNumber} onClick={() => setCurrentPage(pageNumber)} className={pageNumber === currentPage ? "active" : ""} aria-label={`Page ${pageNumber}`} aria-current={pageNumber === currentPage ? "page" : undefined}>{pageNumber}</button>
              ))}
              <button type="button" onClick={() => setCurrentPage((value) => value + 1)} disabled={currentPage === totalPages} aria-label="Next page"><i className="bi bi-chevron-right" /></button>
            </div>
          </nav>
        )}
      </section> */}
    </ContentPage>
  );
}

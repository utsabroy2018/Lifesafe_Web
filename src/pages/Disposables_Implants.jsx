import { useMemo, useState } from "react";
import ContentPage from "./ContentPage";
import useAsync from "../hooks/useAsync";
import { getPageById } from "../services/wordpressApi";

const CUSTOMERS_PER_PAGE = 10;

const fieldText = (value) => {
  if (Array.isArray(value)) return value.map(fieldText).filter(Boolean).join(", ");
  if (value && typeof value === "object") {
    return fieldText(value.name ?? value.title ?? value.label ?? value.value ?? "");
  }
  return String(value ?? "").trim();
};

export default function Disposables_Implants() {
  const page = useAsync(() => getPageById(576), []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState({ key: "catagories", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const customerList = useMemo(
    () => {
      const acf = page.data?.acf;
      const rows = acf?.disposables_and_implants_data ?? acf?.customer_list;
      return Array.isArray(rows) ? rows : [];
    },
    [page.data]
  );
  const visibleCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = customerList.filter((item) => [
      fieldText(item.catagories ?? item.categories),
      fieldText(item.materials),
      fieldText(item.manufacturer_by),
    ].some((value) => value.toLowerCase().includes(query)));
    return [...filtered].sort((first, second) => {
      const firstValue = fieldText(first[sort.key] ?? (sort.key === "catagories" ? first.categories : ""));
      const secondValue = fieldText(second[sort.key] ?? (sort.key === "catagories" ? second.categories : ""));
      const comparison = firstValue.localeCompare(secondValue, undefined, { sensitivity: "base" });
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
      pageId={576}
      title="Disposables And Implants"
      eyebrow="DISPOSABLES AND IMPLANTS"
    >
      {/* <div className="customers-hero">
        <div>
          <p className="customers-kicker">Our healthcare network</p>
          <h2>Trusted care, <span>across every location.</span></h2>
          <p className="customers-lead">We are proud to support hospitals and healthcare providers with dependable medical technology and service.</p>
        </div>
        <div className="customers-stats" aria-label="Customer network statistics">
          <div><strong>{customerList.length + '+' || "—"}</strong><span>Healthcare partners</span></div>
          <div><strong>
            {customerList.length + '+' || "—"}
            </strong><span>Locations served</span></div>
        </div>
      </div> */}

      {featuredCustomers.length > 0 && <div className="customer-marquee" aria-label="Featured healthcare partners">
        <span className="customer-marquee-label"><i className="bi bi-stars" /> Manufacturers</span>
        <div className="customer-marquee-window"><div className="customer-marquee-track">
          {[...featuredCustomers, ...featuredCustomers].map((item, index) => <span className="customer-marquee-item" key={`${fieldText(item.manufacturer_by)}-${index}`}><i className="bi bi-building" /> {fieldText(item.manufacturer_by) || "Manufacturer"}</span>)}
        </div></div>
      </div>}

      <section className="customer-directory" aria-labelledby="customer-directory-title">
        <div className="customer-directory-header">
          <div><p className="customers-kicker">Product directory</p><h3 id="customer-directory-title">Disposables and implants</h3></div>
          <span className="customer-result-count">{visibleCustomers.length} {visibleCustomers.length === 1 ? "item" : "items"}</span>
        </div>
        <div className="customer-controls">
          <label className="customer-search"><i className="bi bi-search" /><input type="search" value={searchTerm} onChange={(event) => updateSearch(event.target.value)} placeholder="Search categories, materials or manufacturers..." aria-label="Search categories, materials and manufacturers" />{searchTerm && <button type="button" onClick={() => updateSearch("")} aria-label="Clear search"><i className="bi bi-x-lg" /></button>}</label>
          <p>Click a column heading to sort the directory.</p>
        </div>
        <div className="table-responsive customers-table-wrapper">
          <table className="table customers-table">
          <thead>
            <tr>
              <th scope="col" className="customer-serial">No.</th>
              <th scope="col" aria-sort={sort.key === "catagories" ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}><button type="button" className="customer-sort-button" onClick={() => changeSort("catagories")}>Categories <i className={`bi ${sortIcon("catagories")}`} /></button></th>
              <th scope="col" aria-sort={sort.key === "materials" ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}><button type="button" className="customer-sort-button" onClick={() => changeSort("materials")}>Materials <i className={`bi ${sortIcon("materials")}`} /></button></th>
              <th scope="col" aria-sort={sort.key === "manufacturer_by" ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}><button type="button" className="customer-sort-button" onClick={() => changeSort("manufacturer_by")}>Manufacturer <i className={`bi ${sortIcon("manufacturer_by")}`} /></button></th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.length ? (
              paginatedCustomers.map((item, idx) => (
                <tr key={`${idx}-${fieldText(item.catagories ?? item.categories)}-${fieldText(item.materials)}`}>
                  <td className="customer-serial">{String((currentPage - 1) * CUSTOMERS_PER_PAGE + idx + 1).padStart(2, "0")}</td>
                  <td>{fieldText(item.catagories ?? item.categories)}</td>
                  <td>{fieldText(item.materials)}</td>
                  <td>{fieldText(item.manufacturer_by)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="customer-empty"><i className="bi bi-search" /><strong>No matching items found</strong><span>Try another category, material or manufacturer.</span></td>
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
      </section>
    </ContentPage>
  );
}

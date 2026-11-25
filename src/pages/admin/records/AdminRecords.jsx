import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminLayout from "../../../components/admin/AdminLayout";
import { getApplicants } from "../../../api";
import { capitalize } from "../../../utils";
import "./AdminRecords.css";

const AVATARS = ["av-blue", "av-violet", "av-teal", "av-orange"];

function getInitials(name = "") {
  const words = name.replace(/^(Dr|Prof)\.\s*/i, "").trim().split(/\s+/);
  if (!words[0]) return "?";
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

export default function AdminRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Category");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getApplicants({ status: "approved" })
      .then(setRecords)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const rows = records.filter((a) => {
    const matchesName = a.name.toLowerCase().includes(q);
    const matchesType = category === "Category" || capitalize(a.affiliation) === category;
    return matchesName && matchesType;
  });

  const isFiltered = records.length > 0 && rows.length === 0;

  return (
    <AdminLayout pageClass="page-records">
      <header className="page-head">
        <h1>Records</h1>
        <p>Approved applicants cleared for campus entry</p>
      </header>

      <section className="records-card">
        <div className="toolbar">
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="text"
              placeholder="Search records"
              aria-label="Search records"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="category-wrap">
            <svg className="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            <select
              className="category"
              aria-label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Category</option>
              <option>Student</option>
              <option>Faculty</option>
            </select>
            <svg className="icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {error && <p className="status-msg error">{error}</p>}

        <div className="table-scroll">
          <div className="table">
            <div className="tr head">
              <span>Applicant</span>
              <span>Type</span>
              <span>Status</span>
              <span className="end">Details</span>
            </div>

            {loading && <p className="status-msg">Loading…</p>}

            {rows.map((a, i) => (
              <div className="tr record" key={a._id}>
                <div className="who">
                  <span className={`avatar ${AVATARS[i % AVATARS.length]}`}>{getInitials(a.name)}</span>
                  <span className="name">{a.name}</span>
                </div>
                <div>
                  <span className={`pill ${String(a.affiliation).toLowerCase() === "faculty" ? "faculty" : "student"}`}>
                    {capitalize(a.affiliation)}
                  </span>
                </div>
                <div>
                  <span className="pill cleared">Cleared</span>
                </div>
                <div className="end">
                  <button className="view" aria-label={`View ${a.name}`} onClick={() => navigate(`/admin/records/${a._id}`)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                  </button>
                </div>
              </div>
            ))}

            {!loading && rows.length === 0 && (
              <div className="empty">
                <span className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 3h8l5 5v13H6z" />
                    <path d="M14 3v5h5M9 13h7M9 17h4" />
                  </svg>
                </span>
                <strong>{isFiltered ? "No matching records" : "No approved applicants yet"}</strong>
                <span>
                  {isFiltered
                    ? "Try a different name or category."
                    : "Approved gate pass applicants will show up here as soon as they are cleared."}
                </span>
              </div>
            )}
          </div>
        </div>

        {!loading && records.length > 0 && (
          <div className="foot">
            <span>Showing {rows.length} of {records.length} records</span>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
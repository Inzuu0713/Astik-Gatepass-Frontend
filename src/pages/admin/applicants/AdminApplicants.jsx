import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useAuth } from "../../../context/AuthContext";
import { getApplicants, updateApplicantStatus } from "../../../api";
import { capitalize } from "../../../utils";
import "./AdminApplicants.css";

const FILTERS = ["All", "Student", "Faculty"];
const AVATAR_TONES = ["blue", "purple", "green", "orange"];

const Svg = ({ children, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const SearchIcon = () => <Svg size={17}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Svg>;
const CheckIcon = () => <Svg><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>;
const XIcon = () => <Svg><path d="M6 6l12 12M18 6L6 18" /></Svg>;
const EyeIcon = () => <Svg><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Svg>;
const UserIcon = () => <Svg size={20}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></Svg>;

function initials(name = "") {
  const parts = name
    .replace(/\b(dr|prof|engr|atty|mr|mrs|ms)\.?\s/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toneFor(name = "") {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return AVATAR_TONES[sum % AVATAR_TONES.length];
}

function splitDateTime(value) {
  if (!value) return { date: "—", time: "" };
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };
    }
  }
  const [date, ...rest] = String(value).split(",");
  const time = rest.join(",").trim().replace(/(\d)(am|pm)$/i, (_, n, p) => `${n} ${p.toUpperCase()}`);
  return { date: date.trim(), time };
}

export default function AdminApplicants() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    getApplicants()
      .then(setApplicants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function decide(id, status) {
    setBusyId(id);
    setError("");
    try {
      const updated = await updateApplicantStatus(id, status);
      setApplicants((list) => list.map((a) => (a._id === id ? { ...a, ...updated } : a)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const counts = {
    All: applicants.length,
    Student: applicants.filter((a) => capitalize(a.affiliation) === "Student").length,
    Faculty: applicants.filter((a) => capitalize(a.affiliation) === "Faculty").length,
  };

  const q = query.trim().toLowerCase();
  const visible = applicants.filter((a) => {
    const matchesName = (a.name || "").toLowerCase().includes(q);
    const matchesType = filter === "All" || capitalize(a.affiliation) === filter;
    return matchesName && matchesType;
  });
  const awaiting = applicants.filter((a) => a.status === "pending").length;

  return (
    <AdminLayout pageClass="page-applicants">
      <header className="topbar">
        <div>
          <h1>Applicants</h1>
          <p className="subtitle">Review and manage gate pass applications</p>
        </div>

        <div className="profile">
          <div className="profile-text">
            <strong>{user?.name || "Name"}</strong>
            <span>Administrator</span>
          </div>
          <div className="avatar"><UserIcon /></div>
        </div>
      </header>

      {error && <p className="status-msg error">{error}</p>}

      <section className="table-card">
        <div className="toolbar">
          <div className="search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search applicants"
              aria-label="Search applicants"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="filters" role="tablist" aria-label="Filter by type">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={`filter ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
                <span className="count">{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="table-scroll">
          <div className="row head">
            <div>APPLICANT</div>
            <div>SUBMITTED</div>
            <div>TYPE</div>
            <div>STATUS</div>
            <div className="right">ACTIONS</div>
          </div>

          {loading && <p className="status-msg">Loading…</p>}
          {!loading && visible.length === 0 && (
            <p className="empty">No applicants found.</p>
          )}

          {visible.map((a) => {
            const locked = a.status !== "pending" || busyId === a._id;
            const { date, time } = splitDateTime(a.appliedAt || a.createdAt);
            const type = capitalize(a.affiliation);
            return (
              <div className="row body" key={a._id}>
                <div className="person">
                  <span className={`initials ${toneFor(a.name)}`}>{initials(a.name)}</span>
                  <span className="person-name">{a.name}</span>
                </div>

                <div className="submitted">
                  <span>{date}</span>
                  <small>{time}</small>
                </div>

                <div><span className={`pill type-${type.toLowerCase()}`}>{type}</span></div>
                <div><span className={`pill status-${a.status}`}>{capitalize(a.status)}</span></div>

                <div className="actions">
                  <button type="button" className="btn approve" disabled={locked} onClick={() => decide(a._id, "approved")}>
                    <CheckIcon />Approve
                  </button>
                  <button type="button" className="btn reject" disabled={locked} onClick={() => decide(a._id, "rejected")}>
                    <XIcon />Reject
                  </button>
                  <button type="button" className="btn view" onClick={() => navigate(`/admin/applicants/${a._id}`)}>
                    <EyeIcon />View
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="table-foot">
          <span>Showing {visible.length} of {applicants.length} applicants</span>
          <span className="awaiting"><i />{awaiting} awaiting review</span>
        </footer>
      </section>
    </AdminLayout>
  );
}
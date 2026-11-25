import { useEffect, useState } from "react";
import { Link } from "react-router";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useAuth } from "../../../context/AuthContext";
import { getApplicants } from "../../../api";
import { formatDateTime } from "../../../utils";
import "./AdminDashboard.css";

const Svg = ({ children }) => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const ClockIcon = () => <Svg><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
const CheckIcon = () => <Svg><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></Svg>;
const UsersIcon = () => <Svg><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.5a3.5 3.5 0 010 7M18.5 14.3c1.9.8 3 2.7 3 5.7" /></Svg>;
const PulseIcon = () => <Svg><path d="M3 12h4l2-6 4 12 2-6h6" /></Svg>;
const UserIcon = () => <Svg><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></Svg>;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getApplicants()
      .then(setApplicants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const total = applicants.length;
  const approved = applicants.filter((a) => a.status === "approved").length;
  const pending = applicants.filter((a) => a.status === "pending").length;
  const activity = applicants
    .filter((a) => a.status !== "pending" && a.decidedAt)
    .sort((a, b) => new Date(b.decidedAt) - new Date(a.decidedAt))
    .slice(0, 10);

  return (
    <AdminLayout pageClass="page-dashboard">
      <header className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Overview of gate pass applications</p>
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

      <section className="stats">
        <div className="stat">
          <div className="stat-head">
            <span>Pending</span>
            <div className="stat-icon pending"><ClockIcon /></div>
          </div>
          <p className="stat-value">{pending}</p>
          <p className="stat-note">Awaiting review</p>
        </div>

        <div className="stat">
          <div className="stat-head">
            <span>Approved</span>
            <div className="stat-icon approved"><CheckIcon /></div>
          </div>
          <p className="stat-value">{approved}</p>
          <p className="stat-note">Cleared for entry</p>
        </div>

        <div className="stat stat-total">
          <div className="stat-head">
            <span>Total Applicants</span>
            <div className="stat-icon total"><UsersIcon /></div>
          </div>
          <p className="stat-value">{total}</p>
          <p className="stat-note">All registrations</p>
        </div>
      </section>

      <section className="activity">
        <div className="activity-head">
          <h3>Recent Activity</h3>
          <Link to="/admin/applicants" className="view-all">View all</Link>
        </div>

        {!loading && activity.length === 0 ? (
          <div className="activity-empty">
            <div className="empty-icon"><PulseIcon /></div>
            <strong>No activity yet</strong>
            <span>New applications and approvals will show up here as they happen.</span>
          </div>
        ) : (
          <ul className="activity-list">
            {activity.map((a) => (
              <li className="activity-item" key={a._id}>
                <span className="activity-text">
                  <span className={`badge ${a.status}`}>
                    {a.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                  {a.name}
                </span>
                <span className="activity-time">{formatDateTime(a.decidedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminLayout>
  );
}
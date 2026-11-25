import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import sealImg from "../../assets/seal.png";
import "./AdminLayout.css";

const icon = (children) => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const DashboardIcon = () => icon(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
const ApplicantsIcon = () => icon(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.5a3.5 3.5 0 010 7M18.5 14.3c1.9.8 3 2.7 3 5.7" /></>);
const RecordsIcon = () => icon(<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>);
const ParkingIcon = () => icon(<><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M10 16V8h3a2.5 2.5 0 010 5h-3" /></>);
const SignOutIcon = () => icon(<><path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4" /><path d="M16 8l4 4-4 4M20 12H9" /></>);

export default function AdminLayout({ pageClass = "", children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleSignout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="layout">
      <aside className="admin-sidebar">
        <div className="brand">
          <img src={sealImg} alt="Ateneo de Naga University seal" />
          <div className="brand-text">
            <strong>Astik GatePass</strong>
            <span>Campus access</span>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/admin/dashboard" className="nav-btn"><DashboardIcon />Dashboard</NavLink>
          <NavLink to="/admin/applicants" className="nav-btn"><ApplicantsIcon />Applicants</NavLink>
          <NavLink to="/admin/records" className="nav-btn"><RecordsIcon />Records</NavLink>
          <NavLink to="/admin/parking" className="nav-btn"><ParkingIcon />Campus Parking</NavLink>
        </nav>

        <button type="button" className="signout" onClick={handleSignout}>
          <SignOutIcon />Sign out
        </button>
      </aside>

      <main className={`main ${pageClass}`}>{children}</main>
    </div>
  );
}
import AdminLayout from "../../../components/admin/AdminLayout";
import "./AdminCampusParking.css";

export default function AdminCampusParking() {
  return (
    <AdminLayout pageClass="page-parking">
      <header className="parking-header">
        <h1>Campus Parking</h1>
        <p>real-time parking map</p>
      </header>
    </AdminLayout>
  );
}
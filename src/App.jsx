import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLogin from "./pages/admin/login/AdminLogin";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminApplicants from "./pages/admin/applicants/AdminApplicants";
import AdminApplicantDetails from "./pages/admin/applicants/AdminApplicantDetails";
import AdminRecords from "./pages/admin/records/AdminRecords";
import AdminRecordDetails from "./pages/admin/records/AdminRecordDetails";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/applicants" element={<AdminApplicants />} />
            <Route path="/admin/applicants/:id" element={<AdminApplicantDetails />} />
            <Route path="/admin/records" element={<AdminRecords />} />
            <Route path="/admin/records/:id" element={<AdminRecordDetails />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
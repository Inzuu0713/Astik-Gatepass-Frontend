import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import AdminLogin from "./pages/admin/login/AdminLogin";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
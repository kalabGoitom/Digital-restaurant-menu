import { Routes, Route, Navigate } from "react-router-dom";
import PlatformSignup from "./pages/PlatformSignup.jsx";
import PlatformLogin from "./pages/PlatformAdminLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Platform admin authentication */}
      <Route path="/platform/signup" element={<PlatformSignup />} />
      <Route path="/platform/login" element={<PlatformLogin />} />
      <Route
        path="/platform/verify-email"
        element={<div>Platform Admin Email Verification</div>}
      />

      {/* Restaurant admin authentication */}
      <Route
        path="/restaurant/signup"
        element={<div>Restaurant Admin Signup</div>}
      />
      <Route
        path="/restaurant/login"
        element={<div>Restaurant Admin Login</div>}
      />
      <Route
        path="/restaurant/verify-email"
        element={<div>Restaurant Admin Email Verification</div>}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/platform/dashboard"
          element={<div>Platform Admin Dashboard — Coming Soon</div>}
        />
      </Route>

      {/* Unknown URLs */}
      <Route path="*" element={<Navigate to="/platform/login" replace />} />
    </Routes>
  );
}

export default App;

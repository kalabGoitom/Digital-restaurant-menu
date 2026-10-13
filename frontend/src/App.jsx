import { Routes, Route, Navigate } from "react-router-dom";
import PlatformSignup from "./pages/PlatformSignup";

function App() {
  return (
    <Routes>
      {/* Platform admin authentication */}
      <Route path="/platform/signup" element={<PlatformSignup />} />
      <Route path="/platform/login" element={<div>Platform Admin Login</div>} />
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

      {/* Unknown URLs */}
      <Route path="*" element={<Navigate to="/platform/login" replace />} />
    </Routes>
  );
}

export default App;

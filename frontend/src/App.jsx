import { Routes, Route, Navigate } from "react-router-dom";
import PlatformSignup from "./pages/PlatformSignup.jsx";
import PlatformLogin from "./pages/PlatformAdminLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PlatformDashboard from "./pages/platformDashboard.jsx";
import PlatformRestaurants from "./pages/PlatformRestaurants.jsx";
import PlatformSettings from "./pages/PlatformSettings.jsx";
import PlatformRestaurantDetails from "./pages/PlatformRestaurantDetails.jsx";

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
        <Route path="/platform/dashboard" element={<PlatformDashboard />} />
        <Route path="/platform/restaurants" element={<PlatformRestaurants />} />
        <Route path="/platform/settings" element={<PlatformSettings />} />
        <Route
          path="/platform/restaurants/:id"
          element={<PlatformRestaurantDetails />}
        />
      </Route>

      {/* Unknown URLs */}
      <Route path="*" element={<Navigate to="/platform/login" replace />} />
    </Routes>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import PlatformSignup from "./pages/PlatformSignup.jsx";
import PlatformLogin from "./pages/PlatformAdminLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PlatformDashboard from "./pages/platformDashboard.jsx";
import PlatformRestaurants from "./pages/PlatformRestaurants.jsx";
import PlatformSettings from "./pages/PlatformSettings.jsx";
import PlatformRestaurantDetails from "./pages/PlatformRestaurantDetails.jsx";
import RestaurantAdminSignup from "./pages/RestaurantAdminSignup.jsx";
import RestaurantAdminLogin from "./pages/RestaurantAdminLogin.jsx";
import VerifyRestaurantEmail from "./pages/VerifyRestaurantEmail.jsx";
import RestaurantProtectedRoute from "./components/RestaurantProtectedRoute.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";
import MenuItems from "./pages/MenuItems.jsx";
import DailyMenu from "./pages/DailyMenu.jsx";
import PublicRestaurantMenu from "./pages/PublicRestaurantMenu.jsx";

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
      <Route path="/restaurant/signup" element={<RestaurantAdminSignup />} />

      <Route path="/restaurant/login" element={<RestaurantAdminLogin />} />

      <Route
        path="/restaurant/verify-email"
        element={<VerifyRestaurantEmail />}
      />
      {/* platform admin protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/platform/dashboard" element={<PlatformDashboard />} />
        <Route path="/platform/restaurants" element={<PlatformRestaurants />} />
        <Route path="/platform/settings" element={<PlatformSettings />} />
        <Route
          path="/platform/restaurants/:id"
          element={<PlatformRestaurantDetails />}
        />
      </Route>

      {/* Restaurant admin protected routes */}
      <Route element={<RestaurantProtectedRoute />}>
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/menu-items" element={<MenuItems />} />
        <Route path="/restaurant/daily-menu" element={<DailyMenu />} />
      </Route>

      <Route path="/menu/:slug" element={<PublicRestaurantMenu />} />

      {/* Unknown URLs */}
      <Route path="*" element={<Navigate to="/platform/login" replace />} />
    </Routes>
  );
}

export default App;

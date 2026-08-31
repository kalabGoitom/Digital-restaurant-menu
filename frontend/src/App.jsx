import { AuthProvider } from "./context/AuthContext.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import ManageDailyMenu from "./pages/ManageDailyMenu";
import ManageMenu from "./pages/ManageMenu";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const path = window.location.pathname;

  const routes = {
    "/": <Home />,
    "/admin/login": <AdminLogin />,
    "/admin/signup": <AdminSignup />,
    "/admin/verify-email": <VerifyEmail />,
    "/admin/dashboard": <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
    "/admin/menu-items": <ProtectedRoute><ManageMenu /></ProtectedRoute>,
    "/admin/today-menu": <ProtectedRoute><ManageDailyMenu /></ProtectedRoute>,
  };

  const page = routes[path] || <NotFound path={path} />;

  return <AuthProvider>{page}</AuthProvider>;
}

export default App;

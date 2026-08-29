import { AuthProvider } from "./context/AuthContext.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import ManageDailyMenu from "./pages/ManageDailyMenu";
import ManageMenu from "./pages/ManageMenu";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const path = window.location.pathname;

  let page = <Home />;
  if (path === "/admin/login") page = <AdminLogin />;
  if (path === "/admin/signup") page = <AdminSignup />;
  if (path === "/admin/verify-email") page = <VerifyEmail />;
  if (path === "/admin/dashboard") page = <ProtectedRoute><AdminDashboard /></ProtectedRoute>;
  if (path === "/admin/menu-items") page = <ProtectedRoute><ManageMenu /></ProtectedRoute>;
  if (path === "/admin/today-menu") page = <ProtectedRoute><ManageDailyMenu /></ProtectedRoute>;

  return <AuthProvider>{page}</AuthProvider>;
}

export default App;

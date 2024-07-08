import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard"; // Import the AdminDashboard component

function App() {
  const isLoggedIn = localStorage.getItem("token");

  const PrivateRoute = ({ element, isLoggedIn }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };
  const AdminRoute = ({ element, isLoggedIn, role }) => {
    return isLoggedIn && role === "admin" ? element : <Navigate to="/" />;
  };

  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Private route for the user dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute element={<Dashboard />} isLoggedIn={isLoggedIn} />
          }
        />

        {/* Private route for the admin dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute
              element={<AdminDashboard />}
              isLoggedIn={isLoggedIn}
              role="admin"
            />
          }
        />

        {/* Redirect to login if route does not match */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

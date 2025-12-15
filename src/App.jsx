import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-100">
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

              <div className="flex-1 flex flex-col">
                <Navbar toggleSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

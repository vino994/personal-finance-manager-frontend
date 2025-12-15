import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiPieChart,
  FiList,
  FiTarget,
  FiFileText,
  FiDollarSign,
  FiUser,
  FiX,
} from "react-icons/fi";

export default function Sidebar({ open, setOpen }) {
  const { pathname } = useLocation();

  const links = [
    { path: "/", label: "Dashboard", icon: <FiHome /> },
    { path: "/profile", label: "Profile", icon: <FiUser /> },
    { path: "/income", label: "Income", icon: <FiDollarSign /> },
    { path: "/expenses", label: "Expenses", icon: <FiList /> },
    { path: "/budgets", label: "Budgets", icon: <FiPieChart /> },
    { path: "/goals", label: "Goals", icon: <FiTarget /> },
    { path: "/reports", label: "Reports", icon: <FiFileText /> },
  ];

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed z-50 lg:static inset-y-0 left-0 w-64 bg-white shadow-xl p-5
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-indigo-600">
            Finance Manager
          </h1>
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <FiX size={22} />
          </button>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl
                ${
                  pathname === link.path
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-100"
                }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

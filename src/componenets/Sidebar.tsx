import { NavLink } from "react-router-dom";
import { Users, Package } from "lucide-react";
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span className="nav-icon">
            <Package size={18} />
          </span>
          Dashboard
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span className="nav-icon">
            <Users size={18} />
          </span>
          Users
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

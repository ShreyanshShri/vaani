import {
  Heart,
  Home as HomeIcon,
  Calendar,
  History as HistoryIcon,
  User,
  LogOut,
  HeartHandshake,
} from "lucide-react";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { signOut } = useContext(AuthContext);

  const links = [
    {
      name: "Home",
      path: "/app/home",
      icon: HomeIcon,
    },
    {
      name: "My Health",
      path: "/app/health",
      icon: Heart,
    },
    {
      name: "Reminders",
      path: "/app/reminders",
      icon: Calendar,
    },
    {
      name: "History",
      path: "/app/history",
      icon: HistoryIcon,
    },
    {
      name: "Profile",
      path: "/app/profile",
      icon: User,
    },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <HeartHandshake size={22} />
          <strong>Vaani</strong>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <Icon size={19} />
              {name}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        className="logout-button"
        onClick={async () => {
          await signOut();
          navigate("/login");
        }}
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;

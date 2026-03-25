import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Inbox, Users, Settings, LogOut,
  Menu, Plane, TrendingUp, X, Map, ChevronRight, Bell,LayoutTemplate, MessageSquareQuote
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/adminAuthSlice";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Inbox, label: "Contact Messages", path: "/admin/contact" },
  { icon: Users, label: "Experiences", path: "/admin/experience" },
  { icon: Plane, label: "About", path: "/admin/about" },
  { icon: Map, label: "Journey", path: "/admin/journey" },
  { icon: TrendingUp, label: "Journal", path: "/admin/journal" },
  { icon: Settings, label: "Explore", path: "/admin/explore-kerala" },
  { icon: LayoutTemplate, label: "Landing", path: "/admin/landing" },
   { icon: MessageSquareQuote, label: "Review", path: "/admin/review" }
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen overflow-hidden flex bg-green-50" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <div
        className="flex-1 h-screen overflow-y-auto transition-all duration-300"
        style={{ marginLeft: collapsed ? 72 : 260, width: `calc(100% - ${collapsed ? 72 : 260}px)` }}
      >
        <Outlet />
      </div>
    </div>
  );
}

function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout({ isLoggedIn: false }));
    navigate("/admin/login");
  };

  const isActive = (path) =>
    path === "/admin/dashboard"
      ? pathname === "/admin/" || pathname === "/admin/dashboard"
      : pathname === path || pathname.startsWith(path + "/");

  return (
    <aside
      className="fixed top-0 left-0 h-full flex flex-col z-40 bg-white/98 backdrop-blur-xl border-r border-green-100 shadow-sm transition-all duration-300"
      style={{ width: collapsed ? 72 : 260, boxShadow: "4px 0 24px #16a34a08" }}
    >
      {/* Header */}
      <div className={`flex items-center border-b border-green-100 p-[18px_14px] ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg shadow-green-500/30 flex items-center justify-center flex-shrink-0">
            <Plane size={14} color="white" className="-rotate-45" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-green-900 tracking-tight leading-tight m-0">TravelAdmin</p>
              <p className="text-[9.5px] text-green-600 font-medium tracking-wide m-0 mt-0.5">Management Portal</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-[10px] bg-green-50 border border-green-100 cursor-pointer flex items-center justify-center hover:bg-green-100 hover:border-green-300 transition-colors"
            aria-label="Collapse sidebar"
          >
            <X size={14} color="#6b7280" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="flex items-center justify-center py-3.5 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Expand sidebar"
        >
          <Menu size={16} />
        </button>
      )}

      {/* Section label */}
      {!collapsed && (
        <p className="text-[9px] font-bold text-green-300 tracking-[1.5px] uppercase px-[18px] pt-[18px] pb-1.5 m-0">
          Main Menu
        </p>
      )}

      {/* Nav */}
      <nav className={`flex-1 flex flex-col gap-0.5 overflow-y-auto ${collapsed ? "px-2.5 py-2" : "px-2.5 py-1"}`}>
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              title={collapsed ? label : undefined}
              className={`
                group relative overflow-hidden w-full flex items-center gap-2.5 rounded-xl border-none cursor-pointer transition-all duration-150
                ${collapsed ? "justify-center px-0 py-2.5" : "justify-start px-3 py-[9px]"}
                ${active
                  ? "bg-gradient-to-br from-green-600 to-emerald-600 shadow-md shadow-green-500/20"
                  : "bg-transparent hover:bg-green-50"}
              `}
            >
              {/* hover bg for inactive */}
              {!active && (
                <span className="absolute inset-0 rounded-xl bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-0" />
              )}

              <Icon
                size={16}
                color={active ? "white" : "#6b7280"}
                className="flex-shrink-0 relative z-10"
              />

              {!collapsed && (
                <span className={`text-[13px] flex-1 text-left relative z-10 ${active ? "font-semibold text-white" : "font-medium text-gray-700"}`}>
                  {label}
                </span>
              )}

              {!collapsed && active && (
                <ChevronRight size={13} color="rgba(255,255,255,0.65)" className="relative z-10" />
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-green-900 text-green-100 px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`border-t border-green-100 p-3 flex items-center gap-2.5 ${collapsed ? "justify-center" : "justify-start"}`}>
        <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-md shadow-green-500/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          A
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-green-900 m-0">Admin</p>
              <p className="text-[11px] text-gray-400 m-0 mt-0.5">admin@travel.com</p>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-[9px] bg-green-50 border border-green-100 cursor-pointer flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                aria-label="Logout"
              >
                <LogOut size={13} color="#6b7280" />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
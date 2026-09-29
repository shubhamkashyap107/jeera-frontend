import { NavLink } from "react-router-dom";
import { ChevronRight, LogOut, X } from "lucide-react";
import useLogout from "../../Utils/useLogout";

const SidebarContent = ({ links, onNavigate }) => {
  const logout = useLogout();

  return (
    <div className="flex h-full flex-col p-4">
      <div>
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Management
        </p>

        <nav className="mt-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} strokeWidth={1.8} />

                    <span>{link.label}</span>

                    <ChevronRight
                      size={15}
                      className={`ml-auto transition ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}

      <div className="mt-auto border-t border-slate-100 pt-4">
        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} strokeWidth={1.8} className="transition" />

          <span>Logout</span>

          <ChevronRight
            size={15}
            className="ml-auto opacity-0 transition group-hover:opacity-100"
          />
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ links, mobileOpen, onClose }) => {
  return (
    <>
      {/* Desktop */}

      <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <SidebarContent links={links} />
      </aside>

      {/* Mobile drawer */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />

          <aside className="relative h-full w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-xl">
            <div className="flex h-[73px] items-center justify-between border-b border-slate-200 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
                  <div className="h-4 w-4 rounded-md bg-white" />
                </div>

                <p className="text-sm font-bold tracking-tight text-slate-950">TeamFlow</p>
              </div>

              <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close menu">
                <X size={19} />
              </button>
            </div>

            <div className="h-[calc(100%-73px)]">
              <SidebarContent links={links} onNavigate={onClose} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;

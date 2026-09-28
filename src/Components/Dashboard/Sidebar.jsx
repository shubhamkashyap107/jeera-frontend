import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  LogOut,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = ({ links }) => {
    const nav = useNavigate()
  return (
    <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
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
            onClick={() => {
                axios.post(import.meta.env.VITE_BACKEND_URL + "/api/auth/logout", {}, {withCredentials : true})
                .then(() => {
                    toast.success("User logged out")
                    nav("/login")
                })
            }}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut
              size={18}
              strokeWidth={1.8}
              className="transition"
            />

            <span>Logout</span>

            <ChevronRight
              size={15}
              className="ml-auto opacity-0 transition group-hover:opacity-100"
            />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


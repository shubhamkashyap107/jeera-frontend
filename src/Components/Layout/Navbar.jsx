import { useEffect, useRef, useState } from "react";
import { Building2, ChevronDown, LogOut, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { workspaceLabel } from "./navLinks";
import { initials } from "../../Utils/helpers";
import useLogout from "../../Utils/useLogout";

const Navbar = ({ onMenuClick }) => {
  const user = useSelector((store) => store.user);
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 h-[73px] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-5 lg:px-8">
        {/* Left */}

        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
              <div className="h-4 w-4 rounded-md bg-white" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold tracking-tight text-slate-950">
                TeamFlow
              </p>

              <p className="text-[11px] text-slate-400">
                {workspaceLabel[user.role]}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-2">
          {user.organization && (
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
              <Building2 size={15} className="text-slate-400" />

              <span className="text-sm font-medium text-slate-700">
                {user.organization.name}
              </span>

              {user.team && (
                <span className="text-sm text-slate-400">/ {user.team.name}</span>
              )}
            </div>
          )}

          <div className="mx-2 hidden h-7 w-px bg-slate-200 sm:block" />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                {initials(user.name)}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-950">
                  {user.name}
                </p>

                <p className="text-xs capitalize text-slate-400">
                  {user.role}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-slate-400 transition sm:block ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="text-sm font-semibold text-slate-950">{user.name}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{user.email}</p>
                </div>

                <button
                  onClick={logout}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={17} strokeWidth={1.8} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

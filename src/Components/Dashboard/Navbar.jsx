import React from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {

    const user = useSelector(store => store.user)

  return (
    <header className="sticky top-0 z-40 h-[73px] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-5 lg:px-8">
        {/* Left */}

        <div className="flex items-center gap-4">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
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
                Owner Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Search */}

        {["owner", "admin"].includes(user.role) && <div className="mx-8 hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder={user.role == "owner" ? "search organizations.." : "search employees.."}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
            
          </div>
        </div>}

        {/* Right */}

        <div className="flex items-center gap-2">
          <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">
            <Bell size={19} strokeWidth={1.8} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </button>

          <div className="mx-2 hidden h-7 w-px bg-slate-200 sm:block" />

          <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
              {user.name.slice(0,1)}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-950">
                {user.name}
              </p>

              <p className="text-xs text-slate-400">
                {user.role}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-slate-400 sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import {
  Users,
  CheckSquare,
  BriefcaseBusiness,
  MessageSquare,
  ArrowUpRight,
  MoreHorizontal,
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Clock3,
} from "lucide-react";

const links = 
[
    {
        label : "Dashboard",
        icon : LayoutDashboard,
        path : "/dashboard"
    },
    {
        label : "Teams",
        icon : Building2,
        path : "/teams"
    },
    {
        label : "Employees",
        icon : ShieldCheck,
        path : "/employees"
    },
]


const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar links={links} />

        <main className="min-w-0 flex-1 p-6 lg:p-8">
          {/* Header */}

          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-slate-500">
              Organization Overview
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your teams, employees and tasks from one place.
            </p>
          </div>

          {/* Stats */}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Teams
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-slate-950">
                    8
                  </h2>
                </div>

                <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                  <BriefcaseBusiness size={19} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Active teams
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Employees
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-slate-950">
                    64
                  </h2>
                </div>

                <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                  <Users size={19} />
                </div>
              </div>

              <p className="mt-3 text-xs text-emerald-600">
                58 currently active
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Tasks
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-slate-950">
                    186
                  </h2>
                </div>

                <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                  <CheckSquare size={19} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Across all teams
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Completed
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-slate-950">
                    124
                  </h2>
                </div>

                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                  <CheckSquare size={19} />
                </div>
              </div>

              <p className="mt-3 text-xs text-emerald-600">
                67% completion rate
              </p>
            </div>
          </div>

          {/* Main Dashboard Sections */}

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Task Overview */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Task Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Current task distribution
                  </p>
                </div>

                <button className="text-sm font-semibold text-slate-950 hover:text-slate-600">
                  View tasks
                </button>
              </div>

              <div className="mt-7 space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      To Do
                    </span>

                    <span className="text-sm font-semibold text-slate-950">
                      28
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[30%] rounded-full bg-slate-400" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      In Progress
                    </span>

                    <span className="text-sm font-semibold text-slate-950">
                      34
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[38%] rounded-full bg-slate-700" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      Completed
                    </span>

                    <span className="text-sm font-semibold text-slate-950">
                      124
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[67%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Teams */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Your Teams
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Team overview
                  </p>
                </div>

                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                  <MoreHorizontal size={19} />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  ["Engineering", "18 employees"],
                  ["Frontend", "12 employees"],
                  ["Backend", "10 employees"],
                  ["Design", "8 employees"],
                ].map(([name, employees]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                        {name.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {employees}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-slate-400"
                    />
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                View all teams
              </button>
            </div>
          </div>

          {/* Recent Activity */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest activity across your organization
                </p>
              </div>

              <button className="text-sm font-semibold text-slate-950 hover:text-slate-600">
                View all
              </button>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {[
                ["Rahul Sharma", "completed a task", "5 min ago"],
                ["Ankit Verma", "joined Engineering team", "24 min ago"],
                ["Priya Singh", "created a new task", "1 hour ago"],
                ["Aman Gupta", "updated task status", "2 hours ago"],
              ].map(([name, action, time]) => (
                <div
                  key={name}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </div>

                    <div>
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-950">
                          {name}
                        </span>{" "}
                        {action}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock3 size={12} />
                        {time}
                      </div>
                    </div>
                  </div>

                  <button className="hidden text-slate-400 hover:text-slate-700 sm:block">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;


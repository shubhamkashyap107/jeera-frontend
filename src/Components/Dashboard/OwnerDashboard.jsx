import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import {
  LayoutDashboard,
  Building2,
  UsersRound,
  Loader,
} from "lucide-react";
import axios from "axios";

const links = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Organizations",
    icon: Building2,
    path: "/organizations",
  },
  {
    label: "Administrators",
    icon: UsersRound,
    path: "/administrators",
  },
];

const OwnerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [allOrgs, setAllOrgs] = useState(null)

  console.log(analytics);

  useEffect(() => {

    const p = Promise.all([
      axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/analytics",
        {
          withCredentials: true,
        }
      ),
      axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/analytics/get-all-orgs-data",
        {
          withCredentials : true
        }
      )
    ])

    p.then((arr) => {
      setAnalytics(arr[0].data.data)
      setAllOrgs(arr[1].data.data)
    })

    
     
  }, []);



  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar links={links} />

        {analytics ? (
          <main className="min-w-0 flex-1 p-6 lg:p-8">
            {/* Dashboard content */}

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-slate-500">
                Overview
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Owner Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage your organizations and administrators from one place.
              </p>
            </div>

            {/* Stats */}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Organizations
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-950">
                  {analytics.totalOrganizations}
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  Total organizations
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Administrators
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-950">
                  {analytics.totalAdmins}
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  Across all organizations
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Active Organizations
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-950">
                  {analytics.activeOrganizations}
                </h2>

                <p className="mt-2 text-xs text-emerald-600">
                  {Math.floor((analytics.activeOrganizations / analytics.totalOrganizations) * 100)}% active
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  System Status
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <span className="text-sm font-semibold text-slate-950">
                    All systems operational
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Everything is running normally
                </p>
              </div>
            </div>

            {/* Bottom section */}

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">
                      Recent Organizations
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Recently created organizations
                    </p>
                  </div>

                  <button className="text-sm font-semibold text-slate-950 hover:text-slate-600">
                    View all
                  </button>
                </div>

                <div className="mt-6 divide-y divide-slate-100">
                  {allOrgs.map((item) => (
                    <div
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                          {item.name.slice(0,1)}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {item.adminCount} administrators
                          </p>
                        </div>
                      </div>

                      <span className={"rounded-full bg-emerald-50 px-3 py-1 text-white text-xs font-medium " + (item.isActive ? "bg-emerald-400" : "bg-red-400")}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
                <p className="text-sm font-medium text-slate-400">
                  Quick action
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  Create a new organization
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Set up a new organization and assign its administrator.
                </p>

                <button className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Create Organization
                </button>
              </div>
            </div>
          </main>
        ) : (
          <main className="flex min-h-[calc(100vh-73px)] min-w-0 flex-1 items-center justify-center">
            <Loader
              size={32}
              strokeWidth={1.8}
              className="animate-spin text-slate-700"
            />
          </main>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Building2, CircleCheck, CircleOff, UsersRound } from "lucide-react";
import api from "../../Utils/api";
import PageHeader from "../UI/PageHeader";
import PageLoader from "../UI/PageLoader";
import StatCard from "../UI/StatCard";
import EmptyState from "../UI/EmptyState";
import { ActiveBadge } from "../UI/Badges";
import { getErrorMessage } from "../../Utils/helpers";

const OwnerDashboard = () => {
  const nav = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [recentOrgs, setRecentOrgs] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/api/analytics"),
      api.get("/api/analytics/get-all-orgs-data"),
    ])
      .then(([analyticsRes, orgsRes]) => {
        setAnalytics(analyticsRes.data.data);
        setRecentOrgs(orgsRes.data.data);
      })
      .catch((error) => toast.error(getErrorMessage(error, "Could not load dashboard")));
  }, []);

  if (!analytics) return <PageLoader />;

  // aggregate returns nothing when there are no organizations yet
  const total = analytics.totalOrganizations || 0;
  const active = analytics.activeOrganizations || 0;
  const activePercent = total ? Math.floor((active / total) * 100) : 0;

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Owner Dashboard"
        description="Manage your organizations and administrators from one place."
      />

      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Organizations" value={total} hint="Total organizations" icon={Building2} />

        <StatCard label="Administrators" value={analytics.totalAdmins || 0} hint="Across all organizations" icon={UsersRound} />

        <StatCard
          label="Active Organizations"
          value={active}
          hint={`${activePercent}% active`}
          hintClass="text-emerald-600"
          icon={CircleCheck}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          label="Inactive Organizations"
          value={total - active}
          hint="Access currently blocked"
          icon={CircleOff}
          iconClass="bg-red-50 text-red-500"
        />
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

            <Link to="/organizations" className="text-sm font-semibold text-slate-950 hover:text-slate-600">
              View all
            </Link>
          </div>

          {recentOrgs.length == 0 ? (
            <EmptyState icon={Building2} title="No organizations yet" description="Create your first organization to get started." />
          ) : (
            <div className="mt-6 divide-y divide-slate-100">
              {recentOrgs.map((item) => (
                <Link
                  key={item._id}
                  to={`/organizations/${item._id}`}
                  className="-mx-3 flex items-center justify-between rounded-xl px-3 py-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                      {item.name.slice(0, 1).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.adminCount} administrator{item.adminCount == 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <ActiveBadge active={item.isActive} />
                </Link>
              ))}
            </div>
          )}
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

          <button
            onClick={() => nav("/organizations", { state: { openCreate: true } })}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Create Organization
          </button>

          <button
            onClick={() => nav("/administrators")}
            className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Manage Administrators
          </button>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;

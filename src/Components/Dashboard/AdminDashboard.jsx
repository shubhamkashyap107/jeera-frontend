import { Link } from "react-router-dom";
import {
  Users,
  CheckSquare,
  BriefcaseBusiness,
  ArrowUpRight,
  ListChecks,
  Clock3,
} from "lucide-react";
import PageHeader from "../UI/PageHeader";
import PageLoader from "../UI/PageLoader";
import StatCard from "../UI/StatCard";
import EmptyState from "../UI/EmptyState";
import { PriorityBadge, StatusBadge } from "../UI/Badges";
import useAdminWorkspace from "../../Utils/useAdminWorkspace";
import { TASK_STATUSES, formatDate, isOverdue } from "../../Utils/helpers";

const barColors = {
  "todo": "bg-slate-400",
  "in-progress": "bg-slate-700",
  "completed": "bg-emerald-500",
};

const AdminDashboard = () => {
  const { data } = useAdminWorkspace();

  if (!data) return <PageLoader />;

  const { teams, employees, tasks } = data;
  const activeTeams = teams.filter((team) => team.isActive);
  const activeEmployees = employees.filter((emp) => emp.isActive).length;
  const completed = tasks.filter((task) => task.status == "completed").length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const overdue = tasks.filter(isOverdue).length;
  const recentTasks = [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  return (
    <>
      <PageHeader
        eyebrow="Organization Overview"
        title="Admin Dashboard"
        description="Manage your teams, employees and tasks from one place."
      />

      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Teams" value={activeTeams.length} hint={`${teams.length - activeTeams.length} inactive`} icon={BriefcaseBusiness} />

        <StatCard
          label="Employees"
          value={employees.length}
          hint={`${activeEmployees} currently active`}
          hintClass="text-emerald-600"
          icon={Users}
        />

        <StatCard
          label="Total Tasks"
          value={tasks.length}
          hint={overdue ? `${overdue} overdue` : "Across all teams"}
          hintClass={overdue ? "text-red-600" : "text-slate-400"}
          icon={ListChecks}
        />

        <StatCard
          label="Completed"
          value={completed}
          hint={`${completionRate}% completion rate`}
          hintClass="text-emerald-600"
          icon={CheckSquare}
          iconClass="bg-emerald-50 text-emerald-600"
        />
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

            <Link to="/tasks" className="text-sm font-semibold text-slate-950 hover:text-slate-600">
              View tasks
            </Link>
          </div>

          <div className="mt-7 space-y-6">
            {TASK_STATUSES.map((status) => {
              const count = tasks.filter((task) => task.status == status.value).length;
              const percent = tasks.length ? Math.round((count / tasks.length) * 100) : 0;

              return (
                <Link key={status.value} to={`/tasks?status=${status.value}`} className="block">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      {status.label}
                    </span>

                    <span className="text-sm font-semibold text-slate-950">
                      {count}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${barColors[status.value]}`} style={{ width: `${percent}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Teams */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Your Teams
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Team overview
            </p>
          </div>

          {activeTeams.length == 0 ? (
            <p className="mt-6 text-sm text-slate-400">No active teams yet.</p>
          ) : (
            <div className="mt-5 space-y-2">
              {activeTeams.slice(0, 4).map((team) => {
                const count = employees.filter((emp) => emp.teamdId == team._id && emp.isActive).length;

                return (
                  <Link
                    key={team._id}
                    to={`/teams/${team._id}`}
                    className="-mx-2 flex items-center justify-between rounded-xl px-2 py-2 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                        {team.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {team.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {count} employee{count == 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight size={16} className="text-slate-400" />
                  </Link>
                );
              })}
            </div>
          )}

          <Link to="/teams" className="mt-5 flex w-full justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            View all teams
          </Link>
        </div>
      </div>

      {/* Recent Tasks */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Most recently updated tasks in your organization
            </p>
          </div>

          <Link to="/tasks" className="text-sm font-semibold text-slate-950 hover:text-slate-600">
            View all
          </Link>
        </div>

        {recentTasks.length == 0 ? (
          <EmptyState icon={ListChecks} title="No tasks yet" description="Tasks you create will show up here." />
        ) : (
          <div className="mt-5 divide-y divide-slate-100">
            {recentTasks.map((task) => (
              <div key={task._id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {(task.assignedTo?.name || "?").slice(0, 1).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-700">
                      <span className="font-semibold text-slate-950">{task.title}</span>
                      {" · "}
                      {task.assignedTo?.name || "Unassigned"}
                      {task.teamId?.name && <span className="text-slate-400"> in {task.teamId.name}</span>}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock3 size={12} />
                      Updated {formatDate(task.updatedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;

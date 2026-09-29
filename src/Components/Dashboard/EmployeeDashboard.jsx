import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertTriangle, CheckSquare, Clock3, ListChecks } from "lucide-react";
import PageHeader from "../UI/PageHeader";
import PageLoader from "../UI/PageLoader";
import StatCard from "../UI/StatCard";
import EmptyState from "../UI/EmptyState";
import { PriorityBadge, StatusBadge } from "../UI/Badges";
import TaskDetailsModal from "../Employee/TaskDetailsModal";
import useMyTasks from "../../Utils/useMyTasks";
import { formatDate, isOverdue } from "../../Utils/helpers";

const EmployeeDashboard = () => {
  const user = useSelector((store) => store.user);
  const { tasks, updateStatus } = useMyTasks();
  const [openTaskId, setOpenTaskId] = useState(null);

  if (!tasks) return <PageLoader />;

  const count = (status) => tasks.filter((task) => task.status == status).length;
  const completed = count("completed");
  const overdue = tasks.filter(isOverdue).length;

  // open tasks, soonest due first (tasks without a due date last)
  const upNext = tasks
    .filter((task) => task.status != "completed")
    .sort((a, b) => new Date(a.dueDate || 8.64e15) - new Date(b.dueDate || 8.64e15))
    .slice(0, 5);

  const openTask = tasks.find((task) => task._id == openTaskId);

  return (
    <>
      <PageHeader
        eyebrow={user.team ? `${user.team.name} team` : "Overview"}
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here's a snapshot of the work assigned to you."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned" value={tasks.length} hint="Total tasks" icon={ListChecks} />
        <StatCard label="In Progress" value={count("in-progress")} hint={`${count("todo")} still to do`} icon={Clock3} iconClass="bg-amber-50 text-amber-600" />
        <StatCard
          label="Completed"
          value={completed}
          hint={`${tasks.length ? Math.round((completed / tasks.length) * 100) : 0}% completion rate`}
          hintClass="text-emerald-600"
          icon={CheckSquare}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Overdue"
          value={overdue}
          hint={overdue ? "Needs your attention" : "You're on track"}
          hintClass={overdue ? "text-red-600" : "text-emerald-600"}
          icon={AlertTriangle}
          iconClass={overdue ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-700"}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Up Next</h2>
            <p className="mt-1 text-sm text-slate-500">Open tasks ordered by due date</p>
          </div>

          <Link to="/my-tasks" className="text-sm font-semibold text-slate-950 hover:text-slate-600">
            View all
          </Link>
        </div>

        {upNext.length == 0 ? (
          <EmptyState icon={CheckSquare} title="All caught up" description="You have no open tasks right now." />
        ) : (
          <div className="mt-5 divide-y divide-slate-100">
            {upNext.map((task) => (
              <button
                key={task._id}
                onClick={() => setOpenTaskId(task._id)}
                className="-mx-3 flex w-[calc(100%+1.5rem)] flex-col gap-3 rounded-xl px-3 py-4 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{task.title}</p>
                  <p className={`mt-1 flex items-center gap-1.5 text-xs ${isOverdue(task) ? "font-semibold text-red-600" : "text-slate-400"}`}>
                    <Clock3 size={12} />
                    {task.dueDate ? `Due ${formatDate(task.dueDate)}` : "No due date"}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <TaskDetailsModal
        key={openTaskId || "none"}
        task={openTask}
        onClose={() => setOpenTaskId(null)}
        onStatusChange={updateStatus}
      />
    </>
  );
};

export default EmployeeDashboard;

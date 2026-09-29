import { useState } from "react";
import { CalendarDays, UserRound, BriefcaseBusiness } from "lucide-react";
import Modal from "../UI/Modal";
import { PriorityBadge, StatusBadge } from "../UI/Badges";
import { TASK_STATUSES, formatDate, isOverdue } from "../../Utils/helpers";

const TaskDetailsModal = ({ task, onClose, onStatusChange }) => {
  const [saving, setSaving] = useState(false);

  if (!task) return null;

  const changeStatus = (status) => {
    setSaving(true);
    onStatusChange(task._id, status)
      .catch(() => {})
      .finally(() => setSaving(false));
  };

  return (
    <Modal open onClose={onClose} title={task.title} size="max-w-xl">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      <p className="mt-5 whitespace-pre-line text-sm leading-6 text-slate-600">{task.description}</p>

      <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400"><BriefcaseBusiness size={13} /> Team</p>
          <p className="mt-1 font-medium text-slate-700">{task.teamId?.name || "—"}</p>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400"><UserRound size={13} /> Assigned by</p>
          <p className="mt-1 font-medium text-slate-700">{task.createdBy?.name || "—"}</p>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400"><CalendarDays size={13} /> Due</p>
          <p className={`mt-1 font-medium ${isOverdue(task) ? "text-red-600" : "text-slate-700"}`}>
            {formatDate(task.dueDate)}{isOverdue(task) && " · Overdue"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-slate-700">Update status</p>

        <div className="grid grid-cols-3 gap-2">
          {TASK_STATUSES.map((status) => (
            <button
              key={status.value}
              disabled={saving || task.status == status.value}
              onClick={() => changeStatus(status.value)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed ${
                task.status == status.value
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Created {formatDate(task.createdAt)} · Last updated {formatDate(task.updatedAt)}
      </p>
    </Modal>
  );
};

export default TaskDetailsModal;

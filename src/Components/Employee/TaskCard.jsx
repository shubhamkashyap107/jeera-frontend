import { CalendarDays } from "lucide-react";
import { PriorityBadge } from "../UI/Badges";
import { formatDate, isOverdue } from "../../Utils/helpers";

const TaskCard = ({ task, onOpen }) => {
  return (
    <button
      onClick={() => onOpen(task)}
      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-950">{task.title}</p>
        <PriorityBadge priority={task.priority} />
      </div>

      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-400">{task.teamId?.name}</span>

        <span className={`inline-flex items-center gap-1.5 ${isOverdue(task) ? "font-semibold text-red-600" : "text-slate-400"}`}>
          <CalendarDays size={13} />
          {formatDate(task.dueDate)}
        </span>
      </div>
    </button>
  );
};

export default TaskCard;

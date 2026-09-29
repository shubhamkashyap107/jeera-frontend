import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../UI/Modal";
import Field from "../UI/Field";
import api from "../../Utils/api";
import { TASK_PRIORITIES, TASK_STATUSES, getErrorMessage, toDateInput } from "../../Utils/helpers";
import { inputClass, primaryButton, secondaryButton, textareaClass } from "../../Utils/styles";

// Render with a `key` so the form resets per open. Tasks inherit the assignee's team.
const TaskFormModal = ({ open, onClose, task, teams, employees, defaultTeamId, onSaved }) => {
  const isEdit = Boolean(task);
  const activeTeams = teams.filter((team) => team.isActive);

  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    dueDate: toDateInput(task?.dueDate),
    teamId: task?.teamId?._id || (activeTeams.some((team) => team._id == defaultTeamId) && defaultTeamId) || activeTeams[0]?._id || "",
    assignedTo: task?.assignedTo?._id || "",
  });
  const [saving, setSaving] = useState(false);

  const teamEmployees = employees.filter((emp) => emp.isActive && emp.teamdId == form.teamId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // switching team clears an assignee that isn't part of it
      ...(name == "teamId" ? { assignedTo: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
    };

    const request = isEdit
      ? api.patch(`/api/admin/tasks/${task._id}`, { ...body, assignedTo: form.assignedTo })
      : api.post(`/api/admin/tasks/employee/${form.assignedTo}`, body);

    request
      .then((res) => {
        toast.success(res.data.message);
        onSaved(res.data.data);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="max-w-2xl"
      title={isEdit ? "Edit task" : "Create task"}
      description={isEdit ? "Update the task details or reassign it." : "Assign a new task to an employee."}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" htmlFor="task-title">
          <input id="task-title" name="title" value={form.title} onChange={handleChange} maxLength={100} required autoFocus placeholder="Build the login page" className={inputClass} />
        </Field>

        <Field label="Description" htmlFor="task-description" hint={`${form.description.length}/300`}>
          <textarea id="task-description" name="description" value={form.description} onChange={handleChange} maxLength={300} required placeholder="What needs to be done?" className={textareaClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Team" htmlFor="task-team">
            <select id="task-team" name="teamId" value={form.teamId} onChange={handleChange} required className={inputClass}>
              {!activeTeams.some((team) => team._id == form.teamId) && <option value="" disabled>Select a team</option>}
              {activeTeams.map((team) => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Assignee" htmlFor="task-assignee" hint={form.teamId && teamEmployees.length == 0 ? "No active employees in this team" : null}>
            <select id="task-assignee" name="assignedTo" value={form.assignedTo} onChange={handleChange} required className={inputClass}>
              <option value="" disabled>Select an employee</option>
              {teamEmployees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Status" htmlFor="task-status">
            <select id="task-status" name="status" value={form.status} onChange={handleChange} className={inputClass}>
              {TASK_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>

          <Field label="Priority" htmlFor="task-priority">
            <select id="task-priority" name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
              {TASK_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>

          <Field label="Due date" htmlFor="task-due" hint="Optional">
            <input id="task-due" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className={inputClass} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={secondaryButton}>Cancel</button>
          <button type="submit" disabled={saving || !form.assignedTo} className={primaryButton}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;

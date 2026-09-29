import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Modal from "../UI/Modal";
import Field from "../UI/Field";
import api from "../../Utils/api";
import { PASSWORD_HINT, getErrorMessage } from "../../Utils/helpers";
import { inputClass, primaryButton, secondaryButton } from "../../Utils/styles";

// Render with a `key` so the form resets per open
const EmployeeFormModal = ({ open, onClose, teams, defaultTeamId, onCreated }) => {
  const activeTeams = teams.filter((team) => team.isActive);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    teamId: (activeTeams.some((team) => team._id == defaultTeamId) && defaultTeamId) || activeTeams[0]?._id || "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const { teamId, ...body } = form;

    api
      .post(`/api/admin/teams/${teamId}/employees`, { ...body, name: body.name.trim() })
      .then((res) => {
        toast.success(res.data.message);
        onCreated(res.data.data);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  return (
    <Modal open={open} onClose={onClose} title="Add employee" description="Create an account for a new team member.">
      {activeTeams.length == 0 ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Create an active team first — every employee must belong to a team.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Team" htmlFor="emp-team">
            <select id="emp-team" name="teamId" value={form.teamId} onChange={handleChange} required className={inputClass}>
              {activeTeams.map((team) => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Full name" htmlFor="emp-name" hint="2–20 characters. Cannot be changed later.">
            <input id="emp-name" name="name" value={form.name} onChange={handleChange} minLength={2} maxLength={20} required autoFocus placeholder="Priya Singh" className={inputClass} />
          </Field>

          <Field label="Email address" htmlFor="emp-email">
            <input id="emp-email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="priya@company.com" className={inputClass} />
          </Field>

          <Field label="Temporary password" htmlFor="emp-password" hint={PASSWORD_HINT}>
            <div className="relative">
              <input
                id="emp-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`${inputClass} pr-12`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={secondaryButton}>Cancel</button>
            <button type="submit" disabled={saving} className={primaryButton}>
              {saving ? "Creating..." : "Create employee"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EmployeeFormModal;

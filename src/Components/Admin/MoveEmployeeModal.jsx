import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../UI/Modal";
import Field from "../UI/Field";
import api from "../../Utils/api";
import { getErrorMessage } from "../../Utils/helpers";
import { inputClass, primaryButton, secondaryButton } from "../../Utils/styles";

// Render with a `key` so the selection resets per employee
const MoveEmployeeModal = ({ open, onClose, employee, teams, onMoved }) => {
  const activeTeams = teams.filter((team) => team.isActive);
  const [teamId, setTeamId] = useState(employee?.teamdId || "");
  const [saving, setSaving] = useState(false);

  if (!employee) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    api
      .patch(`/api/admin/employees/${employee._id}`, { teamId })
      .then((res) => {
        toast.success(`${employee.name} moved`);
        onMoved(res.data.data);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Change team"
      description={`Move ${employee.name} to another team. Their tasks move with them.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Team" htmlFor="move-team">
          <select id="move-team" value={teamId} onChange={(e) => setTeamId(e.target.value)} required className={inputClass}>
            {!activeTeams.some((team) => team._id == teamId) && <option value="" disabled>Select a team</option>}

            {activeTeams.map((team) => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={secondaryButton}>Cancel</button>
          <button type="submit" disabled={saving || !teamId || teamId == employee.teamdId} className={primaryButton}>
            {saving ? "Saving..." : "Move employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MoveEmployeeModal;

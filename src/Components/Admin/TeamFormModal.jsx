import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../UI/Modal";
import Field from "../UI/Field";
import api from "../../Utils/api";
import { getErrorMessage } from "../../Utils/helpers";
import { inputClass, primaryButton, secondaryButton } from "../../Utils/styles";

// Render with a `key` so the form resets per open
const TeamFormModal = ({ open, onClose, team, onSaved }) => {
  const isEdit = Boolean(team);
  const [name, setName] = useState(team?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const request = isEdit
      ? api.patch(`/api/admin/teams/${team._id}`, { name: name.trim() })
      : api.post("/api/admin/teams", { name: name.trim() });

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
      title={isEdit ? "Rename team" : "Create team"}
      description={isEdit ? "Update the team name." : "Teams group employees and their tasks."}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Team name" htmlFor="team-name" hint="Must be unique within your organization.">
          <input
            id="team-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            required
            autoFocus
            placeholder="Frontend"
            className={inputClass}
          />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={secondaryButton}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryButton}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create team"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamFormModal;

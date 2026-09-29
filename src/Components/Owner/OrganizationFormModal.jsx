import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../UI/Modal";
import Field from "../UI/Field";
import api from "../../Utils/api";
import { getErrorMessage } from "../../Utils/helpers";
import { inputClass, primaryButton, secondaryButton } from "../../Utils/styles";

// Render with a `key` so the form resets whenever the target organization changes
const OrganizationFormModal = ({ open, onClose, organization, onSaved }) => {
  const isEdit = Boolean(organization);
  const [name, setName] = useState(organization?.name || "");
  const [isActive, setIsActive] = useState(organization ? organization.isActive : true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const request = isEdit
      ? api.patch(`/api/owner/${organization._id}`, { name: name.trim(), isActive })
      : api.post("/api/owner", { name: name.trim(), isActive });

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
      title={isEdit ? "Edit organization" : "Create organization"}
      description={isEdit ? "Update the organization details." : "Set up a new organization. You can add administrators next."}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Organization name" htmlFor="org-name">
          <input
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Inc."
            maxLength={100}
            required
            autoFocus
            className={inputClass}
          />
        </Field>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Active</p>
            <p className="text-xs text-slate-400">Inactive organizations block their admins and employees.</p>
          </div>

          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 accent-slate-950"
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={secondaryButton}>
            Cancel
          </button>

          <button type="submit" disabled={saving} className={primaryButton}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create organization"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default OrganizationFormModal;

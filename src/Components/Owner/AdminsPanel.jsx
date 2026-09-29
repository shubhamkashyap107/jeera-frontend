import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Plus, Power, PowerOff, UsersRound } from "lucide-react";
import api from "../../Utils/api";
import Modal from "../UI/Modal";
import Field from "../UI/Field";
import EmptyState from "../UI/EmptyState";
import ConfirmDialog from "../UI/ConfirmDialog";
import SearchInput from "../UI/SearchInput";
import { ActiveBadge } from "../UI/Badges";
import { Table, Td } from "../UI/Table";
import { PASSWORD_HINT, formatDate, getErrorMessage, initials } from "../../Utils/helpers";
import { cardClass, iconButton, inputClass, primaryButton, secondaryButton } from "../../Utils/styles";

const emptyForm = { name: "", email: "", password: "" };

const CreateAdminModal = ({ open, onClose, organization, onCreated }) => {
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    api
      .post(`/api/owner/organization/${organization._id}/admin`, { ...form, name: form.name.trim() })
      .then((res) => {
        toast.success(res.data.message);
        onCreated(res.data.data);
        setForm(emptyForm);
        onClose();
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setSaving(false));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add administrator"
      description={`The administrator will manage teams inside ${organization.name}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Full name" htmlFor="admin-name" hint="2–20 characters. Cannot be changed later.">
          <input id="admin-name" name="name" value={form.name} onChange={handleChange} minLength={2} maxLength={20} required autoFocus placeholder="Rahul Sharma" className={inputClass} />
        </Field>

        <Field label="Email address" htmlFor="admin-email">
          <input id="admin-email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="rahul@company.com" className={inputClass} />
        </Field>

        <Field label="Temporary password" htmlFor="admin-password" hint={PASSWORD_HINT}>
          <div className="relative">
            <input
              id="admin-password"
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
            {saving ? "Creating..." : "Create administrator"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Lists and manages the administrators of a single organization
const AdminsPanel = ({ organization }) => {
  const [admins, setAdmins] = useState(null);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  // parents key this panel by organization, so it only loads once per mount
  useEffect(() => {
    api
      .get(`/api/owner/organization/${organization._id}/admin`)
      .then((res) => setAdmins(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error, "Could not load administrators"));
        setAdmins([]);
      });
  }, [organization._id]);

  const toggleAdmin = (admin) => {
    const request = admin.isActive
      ? api.delete(`/api/owner/admin/${admin._id}`)
      : api.patch(`/api/owner/admin/${admin._id}`);

    return request
      .then((res) => {
        toast.success(res.data.message);
        setAdmins((prev) => prev.map((item) => (item._id == admin._id ? res.data.data : item)));
      })
      .catch((error) => {
        toast.error(getErrorMessage(error));
        throw error;
      });
  };

  const filtered = (admins || []).filter((admin) =>
    `${admin.name} ${admin.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cardClass}>
      <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Administrators</h2>
          <p className="mt-1 text-sm text-slate-500">
            {admins ? `${admins.length} administrator${admins.length == 1 ? "" : "s"} in ${organization.name}` : "Loading..."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search administrators..." />

          <button onClick={() => setCreateOpen(true)} className={primaryButton}>
            <Plus size={17} />
            Add admin
          </button>
        </div>
      </div>

      {!organization.isActive && (
        <div className="mx-6 mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          This organization is inactive. Its administrators cannot sign in until it is reactivated.
        </div>
      )}

      {admins == null ? (
        <p className="px-6 py-10 text-center text-sm text-slate-400">Loading administrators...</p>
      ) : filtered.length == 0 ? (
        <EmptyState
          icon={UsersRound}
          title={search ? "No matching administrators" : "No administrators yet"}
          description={search ? "Try a different search term." : "Add an administrator to start managing teams in this organization."}
        />
      ) : (
        <Table headers={["Administrator", "Status", "Added", "Actions"]}>
          {filtered.map((admin) => (
            <tr key={admin._id} className="transition hover:bg-slate-50/60">
              <Td>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {initials(admin.name)}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-950">{admin.name}</p>
                    <p className="text-xs text-slate-400">{admin.email}</p>
                  </div>
                </div>
              </Td>
              <Td><ActiveBadge active={admin.isActive} /></Td>
              <Td className="text-slate-500">{formatDate(admin.createdAt)}</Td>
              <Td className="text-right">
                <button
                  onClick={() => setConfirmTarget(admin)}
                  title={admin.isActive ? "Deactivate" : "Activate"}
                  className={admin.isActive ? `${iconButton} hover:bg-red-50 hover:text-red-600` : `${iconButton} hover:bg-emerald-50 hover:text-emerald-600`}
                >
                  {admin.isActive ? <PowerOff size={17} /> : <Power size={17} />}
                </button>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <CreateAdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        organization={organization}
        onCreated={(admin) => setAdmins((prev) => [admin, ...(prev || [])])}
      />

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => toggleAdmin(confirmTarget)}
        title={confirmTarget?.isActive ? "Deactivate administrator?" : "Activate administrator?"}
        message={
          confirmTarget?.isActive
            ? `${confirmTarget?.name} will be signed out and won't be able to access the workspace.`
            : `${confirmTarget?.name} will regain access to the workspace.`
        }
        confirmLabel={confirmTarget?.isActive ? "Deactivate" : "Activate"}
        danger={confirmTarget?.isActive}
      />
    </div>
  );
};

export default AdminsPanel;

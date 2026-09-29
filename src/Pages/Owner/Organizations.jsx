import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Building2, ChevronLeft, ChevronRight, Pencil, Plus, Power, PowerOff } from "lucide-react";
import api from "../../Utils/api";
import PageHeader from "../../Components/UI/PageHeader";
import EmptyState from "../../Components/UI/EmptyState";
import ConfirmDialog from "../../Components/UI/ConfirmDialog";
import SearchInput from "../../Components/UI/SearchInput";
import FilterSelect from "../../Components/UI/FilterSelect";
import { ActiveBadge } from "../../Components/UI/Badges";
import { Table, Td } from "../../Components/UI/Table";
import OrganizationFormModal from "../../Components/Owner/OrganizationFormModal";
import { toggleOrganization } from "../../Utils/organizations";
import { formatDate, getErrorMessage } from "../../Utils/helpers";
import { cardClass, iconButton, primaryButton, secondaryButton } from "../../Utils/styles";

const PAGE_SIZE = 10;

const Organizations = () => {
  const nav = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [orgs, setOrgs] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Dashboard "Create Organization" button navigates here with openCreate
  const [formState, setFormState] = useState(
    location.state?.openCreate ? { open: true, organization: null } : { open: false, organization: null }
  );
  const [confirmTarget, setConfirmTarget] = useState(null);

  const loadOrgs = useCallback(() => {
    api
      .get("/api/owner", { params: { skip: page, limit: PAGE_SIZE } })
      .then((res) => setOrgs(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error, "Could not load organizations"));
        setOrgs([]);
      });
  }, [page]);

  useEffect(() => {
    loadOrgs();
  }, [loadOrgs]);

  const replaceOrg = (updated) => {
    setOrgs((prev) => prev.map((org) => (org._id == updated._id ? updated : org)));
  };

  const filtered = (orgs || []).filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || String(org.isActive) == statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Organizations"
        description="Create, update and deactivate the organizations on your platform."
        actions={
          <button onClick={() => setFormState({ open: true, organization: null })} className={primaryButton}>
            <Plus size={17} />
            New organization
          </button>
        }
      />

      <div className={cardClass}>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search this page..." />

          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            allLabel="All statuses"
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
          />
        </div>

        {orgs == null ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">Loading organizations...</p>
        ) : filtered.length == 0 ? (
          <EmptyState
            icon={Building2}
            title={orgs.length == 0 && page == 0 ? "No organizations yet" : "No organizations found"}
            description={orgs.length == 0 && page == 0 ? "Create your first organization to get started." : "Try changing your search or filters."}
            action={
              orgs.length == 0 && page == 0 && (
                <button onClick={() => setFormState({ open: true, organization: null })} className={primaryButton}>
                  <Plus size={17} />
                  New organization
                </button>
              )
            }
          />
        ) : (
          <Table headers={["Organization", "Status", "Created", "Actions"]}>
            {filtered.map((org) => (
              <tr
                key={org._id}
                onClick={() => nav(`/organizations/${org._id}`)}
                className="cursor-pointer transition hover:bg-slate-50/60"
              >
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                      {org.name.slice(0, 1).toUpperCase()}
                    </div>

                    <p className="font-semibold text-slate-950">{org.name}</p>
                  </div>
                </Td>
                <Td><ActiveBadge active={org.isActive} /></Td>
                <Td className="text-slate-500">{formatDate(org.createdAt)}</Td>
                <Td className="text-right">
                  <div className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button title="Edit" onClick={() => setFormState({ open: true, organization: org })} className={iconButton}>
                      <Pencil size={16} />
                    </button>

                    <button
                      title={org.isActive ? "Deactivate" : "Reactivate"}
                      onClick={() => setConfirmTarget(org)}
                      className={org.isActive ? `${iconButton} hover:bg-red-50 hover:text-red-600` : `${iconButton} hover:bg-emerald-50 hover:text-emerald-600`}
                    >
                      {org.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}

        {/* Pagination — backend returns no total, so "next" is enabled while pages are full */}

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">Page {page + 1}</p>

          <div className="flex gap-2">
            <button disabled={page == 0} onClick={() => setPage((p) => p - 1)} className={`${secondaryButton} px-3 py-2`}>
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              disabled={!orgs || orgs.length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
              className={`${secondaryButton} px-3 py-2`}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <OrganizationFormModal
        key={formState.open ? formState.organization?._id || "new" : "closed"}
        open={formState.open}
        organization={formState.organization}
        onClose={() => setFormState({ open: false, organization: null })}
        onSaved={(saved) => {
          if (formState.organization) replaceOrg(saved);
          else if (page == 0) setOrgs((prev) => [saved, ...(prev || [])].slice(0, PAGE_SIZE));
          else setPage(0);
        }}
      />

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => toggleOrganization(confirmTarget).then(replaceOrg)}
        title={confirmTarget?.isActive ? "Deactivate organization?" : "Reactivate organization?"}
        message={
          confirmTarget?.isActive
            ? `Admins and employees of ${confirmTarget?.name} will lose access until it is reactivated.`
            : `Admins and employees of ${confirmTarget?.name} will regain access.`
        }
        confirmLabel={confirmTarget?.isActive ? "Deactivate" : "Reactivate"}
        danger={confirmTarget?.isActive}
      />
    </>
  );
};

export default Organizations;

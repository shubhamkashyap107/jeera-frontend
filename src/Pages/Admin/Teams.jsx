import { useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, CheckSquare, Pencil, Plus, Power, PowerOff, Users } from "lucide-react";
import PageHeader from "../../Components/UI/PageHeader";
import PageLoader from "../../Components/UI/PageLoader";
import EmptyState from "../../Components/UI/EmptyState";
import ConfirmDialog from "../../Components/UI/ConfirmDialog";
import SearchInput from "../../Components/UI/SearchInput";
import FilterSelect from "../../Components/UI/FilterSelect";
import { ActiveBadge } from "../../Components/UI/Badges";
import TeamFormModal from "../../Components/Admin/TeamFormModal";
import useAdminWorkspace from "../../Utils/useAdminWorkspace";
import { toggleTeam } from "../../Utils/teams";
import { formatDate } from "../../Utils/helpers";
import { cardClass, iconButton, primaryButton } from "../../Utils/styles";

const Teams = () => {
  const { data, upsert } = useAdminWorkspace();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formState, setFormState] = useState({ open: false, team: null });
  const [confirmTarget, setConfirmTarget] = useState(null);

  if (!data) return <PageLoader />;

  const filtered = data.teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || String(team.isActive) == statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <PageHeader
        eyebrow="Management"
        title="Teams"
        description="Create teams and organize your employees."
        actions={
          <button onClick={() => setFormState({ open: true, team: null })} className={primaryButton}>
            <Plus size={17} />
            New team
          </button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Search teams..." />

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

      {filtered.length == 0 ? (
        <div className={cardClass}>
          <EmptyState
            icon={BriefcaseBusiness}
            title={data.teams.length == 0 ? "No teams yet" : "No teams found"}
            description={data.teams.length == 0 ? "Create a team to start adding employees and tasks." : "Try changing your search or filters."}
            action={
              data.teams.length == 0 && (
                <button onClick={() => setFormState({ open: true, team: null })} className={primaryButton}>
                  <Plus size={17} />
                  New team
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((team) => {
            const members = data.employees.filter((emp) => emp.teamdId == team._id);
            const teamTasks = data.tasks.filter((task) => task.teamId?._id == team._id);
            const done = teamTasks.filter((task) => task.status == "completed").length;

            return (
              <div key={team._id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/teams/${team._id}`} className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                      {team.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950 hover:underline">{team.name}</p>
                      <p className="text-xs text-slate-400">Created {formatDate(team.createdAt)}</p>
                    </div>
                  </Link>

                  <ActiveBadge active={team.isActive} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs text-slate-500"><Users size={13} /> Employees</p>
                    <p className="mt-1 text-lg font-bold text-slate-950">{members.filter((emp) => emp.isActive).length}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs text-slate-500"><CheckSquare size={13} /> Tasks</p>
                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {done}<span className="text-sm font-medium text-slate-400">/{teamTasks.length}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <Link to={`/teams/${team._id}`} className="text-sm font-semibold text-slate-950 hover:text-slate-600">
                    View team
                  </Link>

                  <div className="flex gap-1">
                    <button title="Rename" onClick={() => setFormState({ open: true, team })} className={iconButton}>
                      <Pencil size={16} />
                    </button>

                    <button
                      title={team.isActive ? "Deactivate" : "Reactivate"}
                      onClick={() => setConfirmTarget(team)}
                      className={team.isActive ? `${iconButton} hover:bg-red-50 hover:text-red-600` : `${iconButton} hover:bg-emerald-50 hover:text-emerald-600`}
                    >
                      {team.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TeamFormModal
        key={formState.open ? formState.team?._id || "new" : "closed"}
        open={formState.open}
        team={formState.team}
        onClose={() => setFormState({ open: false, team: null })}
        onSaved={(team) => upsert("teams", team)}
      />

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => toggleTeam(confirmTarget).then((team) => upsert("teams", team))}
        title={confirmTarget?.isActive ? "Deactivate team?" : "Reactivate team?"}
        message={
          confirmTarget?.isActive
            ? `No new employees or tasks can be added to ${confirmTarget?.name} while it is inactive.`
            : `${confirmTarget?.name} will be available for employees and tasks again.`
        }
        confirmLabel={confirmTarget?.isActive ? "Deactivate" : "Reactivate"}
        danger={confirmTarget?.isActive}
      />
    </>
  );
};

export default Teams;

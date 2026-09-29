import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRightLeft, Power, PowerOff } from "lucide-react";
import api from "../../Utils/api";
import ConfirmDialog from "../UI/ConfirmDialog";
import { ActiveBadge } from "../UI/Badges";
import { Table, Td } from "../UI/Table";
import { formatDate, getErrorMessage, initials } from "../../Utils/helpers";
import { iconButton } from "../../Utils/styles";

// Employee list with team change and activate/deactivate
const EmployeeTable = ({ employees, teams, tasks, onMove, onUpdated, showTeam = true }) => {
  const [confirmTarget, setConfirmTarget] = useState(null);

  const teamName = (id) => teams.find((team) => team._id == id)?.name || "—";
  const openTasks = (id) => tasks.filter((task) => task.assignedTo?._id == id && task.status != "completed").length;

  // DELETE deactivates; reactivation goes through PATCH
  const toggleEmployee = (employee) => {
    const request = employee.isActive
      ? api.delete(`/api/admin/employees/${employee._id}`)
      : api.patch(`/api/admin/employees/${employee._id}`, { isActive: true });

    return request
      .then((res) => {
        toast.success(employee.isActive ? `${employee.name} deactivated` : `${employee.name} reactivated`);
        onUpdated(res.data.data);
      })
      .catch((error) => {
        toast.error(getErrorMessage(error));
        throw error;
      });
  };

  const headers = ["Employee", ...(showTeam ? ["Team"] : []), "Open tasks", "Status", "Joined", "Actions"];

  return (
    <>
      <Table headers={headers}>
        {employees.map((emp) => (
          <tr key={emp._id} className="transition hover:bg-slate-50/60">
            <Td>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {initials(emp.name)}
                </div>

                <div>
                  <p className="font-semibold text-slate-950">{emp.name}</p>
                  <p className="text-xs text-slate-400">{emp.email}</p>
                </div>
              </div>
            </Td>
            {showTeam && <Td className="text-slate-500">{teamName(emp.teamdId)}</Td>}
            <Td className="font-semibold text-slate-700">{openTasks(emp._id)}</Td>
            <Td><ActiveBadge active={emp.isActive} /></Td>
            <Td className="text-slate-500">{formatDate(emp.createdAt)}</Td>
            <Td className="text-right">
              <div className="inline-flex gap-1">
                <button title="Change team" onClick={() => onMove(emp)} className={iconButton}>
                  <ArrowRightLeft size={16} />
                </button>

                <button
                  title={emp.isActive ? "Deactivate" : "Reactivate"}
                  onClick={() => setConfirmTarget(emp)}
                  className={emp.isActive ? `${iconButton} hover:bg-red-50 hover:text-red-600` : `${iconButton} hover:bg-emerald-50 hover:text-emerald-600`}
                >
                  {emp.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                </button>
              </div>
            </Td>
          </tr>
        ))}
      </Table>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => toggleEmployee(confirmTarget)}
        title={confirmTarget?.isActive ? "Deactivate employee?" : "Reactivate employee?"}
        message={
          confirmTarget?.isActive
            ? `${confirmTarget?.name} will be signed out and won't be able to access their tasks.`
            : `${confirmTarget?.name} will regain access to their tasks.`
        }
        confirmLabel={confirmTarget?.isActive ? "Deactivate" : "Reactivate"}
        danger={confirmTarget?.isActive}
      />
    </>
  );
};

export default EmployeeTable;

import {
  LayoutDashboard,
  Building2,
  UsersRound,
  BriefcaseBusiness,
  Users,
  ListChecks,
} from "lucide-react";

export const navLinks = {
  owner: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Organizations", icon: Building2, path: "/organizations" },
    { label: "Administrators", icon: UsersRound, path: "/administrators" },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Teams", icon: BriefcaseBusiness, path: "/teams" },
    { label: "Employees", icon: Users, path: "/employees" },
    { label: "Tasks", icon: ListChecks, path: "/tasks" },
  ],
  employee: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Tasks", icon: ListChecks, path: "/my-tasks" },
  ],
};

export const workspaceLabel = {
  owner: "Owner Workspace",
  admin: "Admin Workspace",
  employee: "Employee Workspace",
};

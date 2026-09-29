import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { navLinks } from "./navLinks";

const DashboardLayout = () => {
  const user = useSelector((store) => store.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex">
        <Sidebar
          links={navLinks[user.role] || []}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <main className="min-w-0 flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

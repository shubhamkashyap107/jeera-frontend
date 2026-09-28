import React from "react";
import { useSelector } from "react-redux";
import OwnerDashboard from "../Components/Dashboard/OwnerDashboard";
import AdminDashboard from "../Components/Dashboard/AdminDashboard";

const Dashboard = () => {
  const user = useSelector((store) => store.user);

  if(user.role == "owner")
  {
    return <OwnerDashboard />
  }
  else if(user.role == "admin")
  {
    return <AdminDashboard />
  }



  return null

};

export default Dashboard;

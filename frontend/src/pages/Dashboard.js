import React, { use } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <nav>
        <Link to="/profile">Profile</Link>
        <Link to="/chat">Chat</Link>
        <Link onClick={handleLogout}>Logout</Link>
      </nav>
    </div>
  );
};

export default Dashboard;

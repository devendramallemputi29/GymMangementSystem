import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

import TestFirestore from "./pages/TestFirestore";

import CreateAdminAccount from "./pages/CreateAdminAccount";

import AddMember from "./pages/AddMember";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/create-admin" element={<CreateAdminAccount />} />
        <Route path="/test" element={<TestFirestore />} />
        <Route path="/add-member" element={<AddMember />} />
      </Routes>
    </Router>
  );
}

export default App;

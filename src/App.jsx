import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from "./Pages/Users";
import Subscriptions from "./Pages/Subscriptions";
import Settings from "./Pages/Settings";
import Sidebar from "./components/SideBar";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        <div className="flex-grow p-6 bg-gray-100">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<h2>Logout</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

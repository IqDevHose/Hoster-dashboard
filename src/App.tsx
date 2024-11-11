// src/App.tsx

import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import ProductsPage from "./pages/plans/Plans";
import OrdersPage from "./pages/orders/Orders";
import Settings from "./pages/settings/Settings";

import AddPlan from "./pages/plans/AddPlan";

import AddOrder from "./pages/orders/AddOrder";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import Auctions from "./pages/auctions/Auctions";
import AddAuction from "./pages/auctions/AddAuction";
import EditAuction from "./pages/auctions/EditAuction";

import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import EditPlan from "./pages/plans/EditPlan";
import Plans from "./pages/plans/Plans";
import AddSubscription from "./pages/subs/AddSubscription";
import Subscriptions from "./pages/subs/Subscriptions";
import EditSubscription from "./pages/subs/EditSubscription";
import Otp from "./pages/auth/Otp";
import Admins from "./pages/admins/Admins";
import AddAdmin from "./pages/admins/AddAdmin";
import EditAdmin from "./pages/admins/EditAdmin";
import Leads from "./pages/leads/Leads";
import AddLead from "./pages/leads/AddLead";
import EditLead from "./pages/leads/EditLead";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />

        <Route path="/users" element={<Users />} />
        <Route path="/new-user" element={<AddUser />} />
        <Route path="/edit-user/:id" element={<EditUser />} />

        <Route path="/admins" element={<Admins />} />
        <Route path="/new-admin" element={<AddAdmin />} />
        <Route path="/edit-admin/:id" element={<EditAdmin />} />

        <Route path="/leads" element={<Leads />} />
        <Route path="/new-lead" element={<AddLead />} />
        <Route path="/edit-lead/:id" element={<EditLead />} />

        <Route path="/plans" element={<Plans />} />
        <Route path="/new-plan" element={<AddPlan />} />
        <Route path="/edit-plan/:id" element={<EditPlan />} />

        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/new-subscription" element={<AddSubscription />} />
        <Route path="/edit-subscription/:id" element={<EditSubscription />} />

        {/* <Route path="/settings" element={<Settings />} /> */}

        {/* <Route path="/auctions" element={<Auctions />} /> */}
        {/* <Route path="/new-auction" element={<AddAuction />} />
        <Route path="/edit-auction/:id" element={<EditAuction />} /> */}
      </Route>

      {/* Optional: Catch-all route for unmatched paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

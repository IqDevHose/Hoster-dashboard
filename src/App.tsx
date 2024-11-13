// src/App.tsx

import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import AddPlan from "./pages/plans/AddPlan";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import EditPlan from "./pages/plans/EditPlan";
import Products from "./pages/plans/Plans";
import AddSubscription from "./pages/subs/AddSubscription";
import Subscriptions from "./pages/subs/Subscriptions";
import EditSubscription from "./pages/subs/EditSubscription";
import Otp from "./pages/auth/Otp";
import Admins from "./pages/admins/Admins";
import AddAdmin from "./pages/admins/AddAdmin";
import EditAdmin from "./pages/admins/EditAdmin";
import Sales from "./pages/leads/Sales";
import AddSale from "./pages/leads/AddSale";
import EditSale from "./pages/leads/EditSale";

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

        <Route path="/sales" element={<Sales />} />
        <Route path="/new-sale" element={<AddSale />} />
        <Route path="/edit-sale/:id" element={<EditSale />} />

        <Route path="/products" element={<Products />} />
        <Route path="/new-product" element={<AddPlan />} />
        <Route path="/edit-product/:id" element={<EditPlan />} />

        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/new-subscription" element={<AddSubscription />} />
        <Route path="/edit-subscription/:id" element={<EditSubscription />} />
      </Route>

      {/* Optional: Catch-all route for unmatched paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

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

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />

        <Route path="/users" element={<Users />} />
        <Route path="/new-user" element={<AddUser />} />
        <Route path="/edit-user/:id" element={<EditUser />} />

        <Route path="/plans" element={<Plans />} />
        <Route path="/new-plan" element={<AddPlan />} />
        <Route path="/edit-plan/:id" element={<EditPlan />} />

        <Route path="/subscriptions" element={<OrdersPage />} />
        <Route path="/new-subscription" element={<AddOrder />} />
      </Route>

      {/* Optional: Catch-all route for unmatched paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

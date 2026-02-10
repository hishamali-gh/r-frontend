import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SignUp from "./Pages/SignUp.jsx";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import Wishlist from "./Pages/Wishlist.jsx";
import Cart from "./Pages/Cart.jsx";
import Men from "./Pages/Men.jsx";
import Women from "./Pages/Women.jsx";
import Kids from "./Pages/Kids.jsx";
import Details from "./Pages/Details.jsx";
import Profile from "./Pages/Profile.jsx";

import Admin from "./Admin/Admin.jsx";
import Dashboard from "./Admin/Dashboard.jsx";
import Users from "./Admin/Users.jsx";
import Products from "./Admin/Products.jsx";
import Orders from "./Admin/Orders.jsx";

import ProtectedRoute from "./Components/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/:category/:id" element={<Details />} />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
}

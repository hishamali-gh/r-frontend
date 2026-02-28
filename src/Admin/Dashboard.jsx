import { useEffect, useState, useContext } from "react";
import API from "../api.jsx";
import BarChart from "../Components/BarChart";
import { AuthContext } from "../Components/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("acc/users/");
      const filtered = res.data.filter(u => !u.is_superuser);

      setTotalUsers(filtered.length);

      const ordersCount = filtered.reduce(
        (acc, u) => acc + (u.orders?.length || 0),
        0
      );

      setTotalOrders(ordersCount);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2
        className="text-6xl"
        style={{ fontFamily: "Playfair Display" }}
      >
        Hi, {user?.name}.<br />Welcome back.
      </h2>

      <div
        className="mt-10 space-y-4 text-gray-800"
        style={{ fontFamily: "SUSE Mono" }}
      >
        <p className="text-2xl">
          Total Users: <span className="font-semibold">{totalUsers}</span>
        </p>

        <p className="text-2xl">
          Total Orders: <span className="font-semibold">{totalOrders}</span>
        </p>

        <BarChart />
      </div>
    </div>
  );
}
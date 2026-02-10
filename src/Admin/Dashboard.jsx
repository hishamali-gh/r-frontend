import { useEffect, useState } from "react";
import axios from "axios";
import BarChart from '../Components/BarChart';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:3001/user");
      const users = res.data;

      setTotalUsers(users.length);

      const ordersCount = users.reduce((acc, u) => acc + (u.orders?.length || 0), 0);
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

      <div className="mt-10 space-y-4 text-gray-800" style={{ fontFamily: "SUSE Mono" }}>
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

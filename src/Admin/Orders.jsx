import { useEffect, useState } from "react";
import API from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.patch(`orders/${orderId}/`, {
        status: newStatus,
      });

      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  return (
    <div className="pb-10">
      <h2
        className="text-6xl mb-12 text-gray-900 text-left"
        style={{ fontFamily: "Playfair Display" }}
      >
        ORDERS
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No orders yet.</p>
      ) : (
        <div className="space-y-12">
          {orders.map((order) => (
            <div key={order.id}>
              <h3
                className="text-2xl font-semibold mb-4 text-gray-800"
                style={{ fontFamily: "SUSE Mono" }}
              >
                {order.name} ({order.user_email})
              </h3>

              <p
                className="text-gray-700 mb-2 text-sm"
                style={{ fontFamily: "SUSE Mono" }}
              >
                Ordered on:{" "}
                {new Date(order.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b border-gray-200"
                  style={{ fontFamily: "SUSE Mono" }}
                >
                  <div className="flex items-center gap-4">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}

                    <div>
                      <h4 className="text-gray-900 font-semibold uppercase">
                        {item.product_name}
                      </h4>

                      <p className="text-gray-800 font-semibold mt-1">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="text-sm font-medium border border-gray-300 rounded-md px-3 py-1.5 bg-white hover:border-gray-400 focus:outline-none transition"
                    style={{ fontFamily: "SUSE Mono" }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="OTW">OTW</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
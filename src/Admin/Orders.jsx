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
    <div className="pb-10 px-4 max-w-6xl mx-auto">

      {/* Heading */}
      <h1
        className="text-5xl mb-16 text-gray-900"
        style={{ fontFamily: "Playfair Display" }}
      >
        Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-sm uppercase tracking-wide">
          No orders found.
        </p>
      ) : (
        <div className="space-y-20">
          {orders.map((order) => (
            <div key={order.id} className="border-t border-gray-200 pt-8">

              {/* Top section */}
              <div className="flex justify-between items-start mb-6">
                <div style={{ fontFamily: "SUSE Mono" }}>
                  <h3 className="text-base uppercase tracking-tight text-gray-900">
                    #{order.id} — {order.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {order.user_email}
                  </p>

                  <p className="text-xs text-gray-400 mt-2 uppercase">
                    Ordered: {new Date(order.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>

                {/* Status */}
                <div className="text-right" style={{ fontFamily: "SUSE Mono" }}>
                  <p className="text-xs uppercase text-gray-400 mb-1">
                    Status
                  </p>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="text-xs uppercase text-gray-700 bg-transparent border-b border-transparent hover:border-gray-400 focus:border-black outline-none cursor-pointer transition-colors"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="OTW">OTW</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-4 border-b border-gray-100"
                    style={{ fontFamily: "SUSE Mono" }}
                  >
                    <div className="flex items-center gap-5">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-14 h-18 object-cover grayscale hover:grayscale-0 transition"
                        />
                      )}

                      <div>
                        <p className="text-sm text-gray-800 uppercase">
                          {item.product_name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-end mt-4">
                <p
                  className="text-sm uppercase text-gray-900"
                  style={{ fontFamily: "SUSE Mono" }}
                >
                  Total: ₹{order.total_price}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

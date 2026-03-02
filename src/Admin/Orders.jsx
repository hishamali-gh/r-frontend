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
      <h2
        className="text-6xl mb-16 text-gray-900 text-left mt-10"
        style={{ fontFamily: "Playfair Display" }}
      >
        ORDERS
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg uppercase tracking-widest">
          No orders found.
        </p>
      ) : (
        <div className="space-y-24">
          {orders.map((order) => (
            <div key={order.id} className="border-t border-black pt-8">
              {/* ORDER HEADER */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                <div style={{ fontFamily: "SUSE Mono" }}>
                  <h3 className="text-xl font-bold uppercase tracking-tighter">
                    #{order.id} — {order.name}
                  </h3>
                  <p className="text-gray-500 text-xs uppercase">{order.user_email}</p>
                  <p className="text-gray-700 mt-2 text-sm uppercase">
                    Ordered: {new Date(order.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs uppercase text-gray-400" style={{ fontFamily: "SUSE Mono" }}>
                    Update Status
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-xs font-bold border-b border-black py-1 bg-transparent focus:outline-none uppercase cursor-pointer"
                    style={{ fontFamily: "SUSE Mono" }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="OTW">OTW</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-4 border-b border-gray-100"
                    style={{ fontFamily: "SUSE Mono" }}
                  >
                    <div className="flex items-center gap-6">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-20 object-cover grayscale hover:grayscale-0 transition duration-500"
                        />
                      )}
                      <div>
                        <h4 className="text-sm text-gray-900 uppercase font-medium">
                          {item.product_name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 uppercase">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* ORDER FOOTER */}
              <div className="flex justify-end mt-4">
                <p className="text-lg font-bold uppercase" style={{ fontFamily: "SUSE Mono" }}>
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
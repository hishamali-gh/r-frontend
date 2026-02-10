import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [usersWithOrders, setUsersWithOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("http://localhost:3001/user")
      .then((res) => {
        const filtered = res.data.filter(
          (u) => u.orders && u.orders.length > 0
        );
        setUsersWithOrders(filtered);
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  };

  // ✅ Now this updates only a single product's status, not the entire order.
  const handleStatusChange = (userId, orderIndex, itemIndex, newStatus) => {
    const user = usersWithOrders.find((u) => u.id === userId);

    const updatedOrders = user.orders.map((order, oIdx) => {
      if (oIdx === orderIndex) {
        const updatedItems = order.items.map((item, iIdx) => {
          if (iIdx === itemIndex) {
            return { ...item, status: newStatus };
          }
          return item;
        });
        return { ...order, items: updatedItems };
      }
      return order;
    });

    axios
      .patch(`http://localhost:3001/user/${userId}`, { orders: updatedOrders })
      .then(() => {
        fetchOrders();
      })
      .catch((err) => console.error("Failed to update item status:", err));
  };

  return (
    <div className="pb-10">
      <h2
        className="text-6xl mb-12 text-gray-900 text-left"
        style={{ fontFamily: "Playfair Display" }}
      >
        ORDERS
      </h2>

      {usersWithOrders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No orders yet.</p>
      ) : (
        <div className="space-y-12">
          {usersWithOrders.map((user) => (
            <div key={user.id}>
              <h3
                className="text-2xl font-semibold mb-4 text-gray-800"
                style={{ fontFamily: "SUSE Mono" }}
              >
                {user.name} ({user.email})
              </h3>

              {user.orders.map((order, orderIndex) => (
                <div key={orderIndex} className="mb-6">
                  <p
                    className="text-gray-700 mb-2 text-sm"
                    style={{ fontFamily: "SUSE Mono" }}
                  >
                    Ordered on:{" "}
                    {new Date(order.date).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>

                  {order.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between items-center py-3 border-b border-gray-200"
                      style={{ fontFamily: "SUSE Mono" }}
                    >
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h4 className="text-gray-900 font-semibold uppercase">
                            {item.name}
                          </h4>
                          {item.size && (
                            <p className="text-gray-600 text-sm">
                              Size: {item.size}
                            </p>
                          )}
                          {item.category && (
                            <p className="text-gray-600 text-sm">
                              Category: {item.category}
                            </p>
                          )}
                          {item.type && (
                            <p className="text-gray-600 text-sm">
                              Type: {item.type}
                            </p>
                          )}
                          <p className="text-gray-800 font-semibold mt-1">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* ✅ Individual status control per product */}
                      <select
                        value={item.status || "OTW"}
                        onChange={(e) =>
                          handleStatusChange(
                            user.id,
                            orderIndex,
                            itemIndex,
                            e.target.value
                          )
                        }
                        className="text-sm font-medium border border-gray-300 rounded-md px-3 py-1.5 bg-white hover:border-gray-400 focus:outline-none transition"
                        style={{ fontFamily: "SUSE Mono" }}
                      >
                        <option value="OTW">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

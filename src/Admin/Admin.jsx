import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))
    setIsLoggedIn(loggedIn)

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "admin") {
      setUser(storedUser);
    }
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-gray-500">
        You do not have access to this page.
      </div>
    );
  }

  const tabs = [
    { name: "dashboard", path: "dashboard" },
    { name: "users", path: "users" },
    { name: "products", path: "products" },
    { name: "orders", path: "orders" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-white border-r border-r-gray-300 p-5 flex flex-col">
        <h1
          className="text-2xl mb-10 ml-1.5"
          style={{ fontFamily: "Playwrite DE SAS, cursive" }}
        >
          willow
        </h1>

        <nav
          className="flex flex-col gap-1 uppercase"
          style={{ fontFamily: "SUSE Mono" }}
        >
          {tabs.map((tab) => (
            <div key={tab.path} className="py-3 pl-2">
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `inline font-medium transition ${
                    isActive ? "text-blue-800" : "hover:text-gray-500"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            </div>
          ))}

          <div className="py-3 pl-2">
            <button
              onClick={handleLogout}
              className="inline font-medium transition hover:text-red-500 uppercase cursor-pointer"
              style={{ fontFamily: "SUSE Mono" }}
            >
              logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}

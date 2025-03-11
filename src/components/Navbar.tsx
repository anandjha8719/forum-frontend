import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 shadow-md mb-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white font-bold text-xl">
            Forum App
          </Link>

          <div className="flex space-x-4 items-center">
            <Link to="/" className="text-white hover:text-indigo-200">
              Home
            </Link>

            {isAuthenticated() ? (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:text-indigo-200"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  Logout
                </button>
                <div className="text-white">{user?.name || user?.email}</div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-indigo-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

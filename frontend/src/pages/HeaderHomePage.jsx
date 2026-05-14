import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../slice/auth.slice";
import { NavLink } from "react-router-dom";

function HeaderHome() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-6 shadow-sm">

      {/* 🔥 LEFT */}
      <div className="flex-1">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-primary cursor-pointer"
        >
          LeetCode
        </h1>
      </div>

      {/* 🔥 RIGHT */}
      <div className="flex items-center gap-3">

        {/* ✅ USER LOGIN STATE */}
        {isAuthenticated &&
          <div className="dropdown dropdown-end">

            <label
              tabIndex={0}
              className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-base-200"
            >
              {/* Avatar */}
              <div className=" rounded-full bg-primary h-10 w-10 text-white flex items-center justify-center font-semibold">
                {(user?.name || user?.firstName)?.charAt(0).toUpperCase()}
                {/* <img src={`/girl.webp`} alt="img" width="50px" className="rounded-full" /> */}
              </div>

              {/* Name */}
              <span className="font-medium">
                {user?.name || user?.firstName}
               
              </span>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-48 border border-base-300"
            >
              {/* USER INFO */}
              <li className="px-2 text-xs text-gray-400">
                Signed in as
              </li>

              <li className="px-2 font-semibold text-sm">
                {user?.name || user?.firstName}
              </li>

              <div className="divider my-1"></div>

              {/* 🔥 LOGOUT */}
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:bg-red-100 rounded-lg"
                >
                   Logout
                </button>
              </li>

              {/* 🔥 ADMIN BUTTON (Logout ke niche) */}
              {user?.role === "admin" && (
                <li>
         
                  <NavLink to="/admin" className="text-primary hover:bg-purple-200 rounded-lg font-medium">
                    Admin Panel
                   </NavLink>
                  
                
                </li>
              )}
            </ul>
          </div>
        }

      </div>
    </div>
  );
}

export default HeaderHome;
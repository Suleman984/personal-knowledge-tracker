"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { handleLogout } from "@/lib/logoutHandler";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {  isAuthenticated } = useSelector((state: RootState) => state.auth);

    const onLogout = async () => {
    await handleLogout(dispatch);
    router.push("/login"); // redirect user to login page
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between flex-shrink-0 z-50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
          PK
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          Personal Knowledge Tracker
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {/* <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div> */}

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

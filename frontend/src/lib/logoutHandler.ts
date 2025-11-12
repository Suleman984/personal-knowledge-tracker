import { AppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import api from "./api";

export const handleLogout = async (dispatch: AppDispatch) => {
  try {
    // 👇 Call backend logout endpoint to clear cookie using axios instance
    await api.post("/users/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    // 👇 Always clear client state
    dispatch(logout());
  }
};

"use client";

import { Home, FileText, Bell, Settings, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 lg:h-full`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 lg:p-6 flex-1">
            {/* Header with mobile close button */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Home size={20} className="text-gray-600" />
                <h2 className="text-lg font-bold text-gray-800">Home</h2>
              </div>
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>

            <hr className="border-gray-200 mb-4" />

            <nav className="space-y-2">
              <button
                onClick={() => {
                  setCurrentPage("summaries");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === "summaries"
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FileText size={20} />
                <span>Summaries</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage("reminders");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === "reminders"
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bell size={20} />
                <span>Reminders</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage("settings");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === "settings"
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* User info at bottom */}
          {user && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">Active User</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile bottom nav (visible when lg:hidden) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <nav className="flex justify-around p-2">
          <button
            onClick={() => {
              setCurrentPage("summaries");
              setSidebarOpen(false);
            }}
            className={`flex flex-col items-center text-xs px-3 py-2 rounded-md ${
              currentPage === "summaries" ? "bg-black text-white" : "text-gray-700"
            }`}
          >
            <FileText size={18} />
            <span>Summaries</span>
          </button>

          <button
            onClick={() => {
              setCurrentPage("reminders");
              setSidebarOpen(false);
            }}
            className={`flex flex-col items-center text-xs px-3 py-2 rounded-md ${
              currentPage === "reminders" ? "bg-black text-white" : "text-gray-700"
            }`}
          >
            <Bell size={18} />
            <span>Reminders</span>
          </button>

          <button
            onClick={() => {
              setCurrentPage("settings");
              setSidebarOpen(false);
            }}
            className={`flex flex-col items-center text-xs px-3 py-2 rounded-md ${
              currentPage === "settings" ? "bg-black text-white" : "text-gray-700"
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>
      </div>
    </>
  );
}

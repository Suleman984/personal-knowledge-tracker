"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/ui/sidebar";
import RightSideContent from "@/components/ui/rightSideContent";
import ProtectedRoute from "@/utils/protectedRoute";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setCurrentPage } from "@/store/uiSlice";

export default function DashboardPage() {
 const dispatch = useDispatch();
const currentPage = useSelector((state: RootState) => state.ui.currentPage);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            currentPage={currentPage}
            setCurrentPage={(page) => dispatch(setCurrentPage(page))}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <RightSideContent currentPage={currentPage} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

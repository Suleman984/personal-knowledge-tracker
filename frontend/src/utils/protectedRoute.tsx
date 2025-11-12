"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // 👇 Only redirect *after* loading is complete
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login.", isAuthenticated, loading);
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import Reminders from "@/app/reminders/page";
import Settings from "@/app/settings/page";
import Summaries from "@/app/summaries/page";

export default function RightSideContent({ currentPage }: { currentPage: string }) {
  useEffect(() => {
    
    // console.log("Current page:", currentPage);
  }, [currentPage]);

  switch (currentPage) {
    case "summaries":
      return <Summaries />;

    case "reminders":
      return <Reminders />;

    case "settings":
      return <Settings />;

    default:
      return <div className="text-gray-500">Page not found</div>;
  }
}

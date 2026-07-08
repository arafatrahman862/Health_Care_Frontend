"use client";

import { UserInfo } from "@/types/user.interface";

interface DashboardNavbarContentProps {
  userInfo: UserInfo | null;
}

export default function DashboardNavbarContent({ userInfo}: DashboardNavbarContentProps) {
  return (
    <div>
      <h1>This is DashboardNavbarContent component</h1>
    </div>
  );
}
"use client";

import { UserInfo } from "@/types/user.interface";

interface DashboardNavbarContentProps {
  userInfo: UserInfo | null;
}

export default function DashboardNavbarContent({ userInfo}: DashboardNavbarContentProps) {
  return <header>Dashboard Navbar</header>
}
import { getUserInfo } from "@/services/auth/getUserInfo";
import DashboardNavbarContent from "./DashboardNavbarContent";

export default async function DashboardNavbar() {
  const userInfo = await getUserInfo();
  return <DashboardNavbarContent userInfo={userInfo} />
}
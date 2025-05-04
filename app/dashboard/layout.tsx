import { redirect } from "next/navigation";
import SideNav from "../ui/dashboard/sidenav";
import { auth } from "@/auth";
export const experimental_ppr = true;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden overflow-scroll">
      <div className="w-full flex-none md:w-64">
        <SideNav user={user} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

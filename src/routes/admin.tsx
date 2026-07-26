import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminGuard } from "@/components/admin/admin-guard";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ZYVO IPTV" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] w-full bg-background">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-12 flex items-center border-b bg-card/40 backdrop-blur">
              <SidebarTrigger className="ml-2" />
              <span className="ml-3 text-sm font-semibold">Admin Dashboard</span>
            </header>
            <main className="flex-1 p-4 md:p-6"><Outlet /></main>
          </div>
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
}

import { SidebarProvider } from "@/shared/ui/sidebar"
import { AdminSidebar } from "@/shared/components/admin-sidebar"
import { AdminHeader } from "@/shared/components/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

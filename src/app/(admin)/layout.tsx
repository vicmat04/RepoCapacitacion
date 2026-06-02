import { SidebarProvider } from "@/shared/ui/sidebar"
import { AdminSidebar } from "@/shared/components/admin-sidebar"
import { AdminHeader } from "@/shared/components/admin-header"
import { createClient } from "@/shared/lib/supabase/server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userEmail = user?.email

  return (
    <SidebarProvider>
      <AdminSidebar userEmail={userEmail} />
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

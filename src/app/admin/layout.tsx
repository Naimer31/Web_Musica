import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <AdminSidebar />
      <main className="pl-64">
        {children}
      </main>
    </div>
  );
}

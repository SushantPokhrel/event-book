"use client";
import Link from "next/link";
import RouteGuard from "@/components/RouteGuard";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard role="ADMIN">
      <div className="min-h-screen bg-[#f7f5ef] text-[#18211f] lg:flex">
        <aside className="border-b border-[#d5d5cb] bg-[#18211f] px-5 py-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:px-7 lg:py-10">
          <div>
            <div>
              <p className="font-serif text-2xl italic">eventBook</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[#f6cb57]">
                Admin space
              </p>
            </div>
            <nav className="mt-6 flex flex-wrap gap-2 text-xs lg:grid lg:gap-3">
              <Link
                className="border border-white/15 px-3 py-2 transition-colors hover:border-[#f6cb57] hover:text-[#f6cb57] lg:border-0 lg:px-0 lg:py-0"
                href="/dashboard/admin"
              >
                Create event
              </Link>
              <Link
                className="border border-white/15 px-3 py-2 transition-colors hover:border-[#f6cb57] hover:text-[#f6cb57] lg:border-0 lg:px-0 lg:py-0"
                href="/dashboard/admin/manage-events"
              >
                Manage events
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </RouteGuard>
  );
}

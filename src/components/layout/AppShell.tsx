import { Home, Leaf, LogOut, ShieldCheck } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";

const userLinks = [
  { to: "/inventory", label: "Inventory", icon: Home },
  { to: "/reservations", label: "My Reservations", icon: Leaf },
];

const adminLinks = [
  { to: "/admin/inventory", label: "Manage Inventory", icon: Home },
  { to: "/admin/reservations", label: "Reservations", icon: ShieldCheck },
];

export const AppShell = () => {
  const { user, clearRole } = useAuth();
  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-700">PlantVault</p>
            <h1 className="text-sm font-semibold text-slate-900">Plant Inventory System</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-600 sm:inline">{user?.name}</span>
            <Button variant="secondary" onClick={clearRole} className="gap-1">
              <LogOut size={16} />
              Switch Role
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-4">
        <aside className="sticky top-20 hidden h-fit w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-card md:block">
          <nav className="space-y-1" aria-label="Sidebar navigation">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100",
                    isActive && "bg-brand-50 text-brand-900",
                  )
                }
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="w-full pb-20 md:pb-4">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-2 md:hidden" aria-label="Bottom navigation">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600",
                  isActive && "bg-brand-50 text-brand-900",
                )
              }
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

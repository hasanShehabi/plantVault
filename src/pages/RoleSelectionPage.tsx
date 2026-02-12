import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export const RoleSelectionPage = () => {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const chooseRole = (role: "admin" | "user") => {
    setRole(role);
    navigate(role === "admin" ? "/admin/inventory" : "/inventory");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 px-4">
      <Card className="w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome to PlantVault</h1>
        <p className="mt-2 text-sm text-slate-600">Choose a role to simulate access control. This is a local-only auth placeholder.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button className="h-11" onClick={() => chooseRole("user")}>Continue as User</Button>
          <Button className="h-11" variant="secondary" onClick={() => chooseRole("admin")}>Continue as Admin</Button>
        </div>
      </Card>
    </main>
  );
};

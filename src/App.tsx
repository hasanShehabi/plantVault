import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import type { ReactElement } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth";
import { AdminInventoryPage } from "@/pages/admin/AdminInventoryPage";
import { AdminReservationsPage } from "@/pages/admin/AdminReservationsPage";
import { InventoryListPage } from "@/pages/inventory/InventoryListPage";
import { PlantDetailsPage } from "@/pages/inventory/PlantDetailsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ReservationsPage } from "@/pages/reservations";
import { RoleSelectionPage } from "@/pages/RoleSelectionPage";

const Protected = ({ children, role }: { children: ReactElement; role?: "admin" | "user" }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "admin" ? "/admin/inventory" : "/inventory"} replace />;
  return children;
};

const AppRouter = () => {
  const router = createBrowserRouter([
    { path: "/", element: <RoleSelectionPage /> },
    {
      path: "/",
      element: (
        <Protected>
          <AppShell />
        </Protected>
      ),
      children: [
        {
          path: "inventory",
          element: (
            <Protected role="user">
              <InventoryListPage />
            </Protected>
          ),
        },
        {
          path: "plants/:plantId",
          element: (
            <Protected role="user">
              <PlantDetailsPage />
            </Protected>
          ),
        },
        {
          path: "reservations",
          element: (
            <Protected role="user">
              <ReservationsPage />
            </Protected>
          ),
        },
        {
          path: "admin/inventory",
          element: (
            <Protected role="admin">
              <AdminInventoryPage />
            </Protected>
          ),
        },
        {
          path: "admin/reservations",
          element: (
            <Protected role="admin">
              <AdminReservationsPage />
            </Protected>
          ),
        },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return <RouterProvider router={router} />;
};

export const App = () => (
  <ErrorBoundary>
    <AppRouter />
  </ErrorBoundary>
);

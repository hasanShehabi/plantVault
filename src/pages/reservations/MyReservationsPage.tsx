import { EmptyState } from "@/components/common/EmptyState";
import { ReservationStatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { useMyReservations } from "@/features/reservations/hooks";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const MyReservationsPage = () => {
  const { user } = useAuth();
  const { data = [], isLoading } = useMyReservations(user?.id ?? "");

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-slate-200" />;
  }

  if (data.length === 0) {
    return <EmptyState title="No reservations yet" description="Reserve a plant from the inventory page." />;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">My Reservations</h2>
      {data.map((reservation) => (
        <Card key={reservation.id}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">{reservation.plantName}</h3>
              <p className="text-sm text-slate-600">Qty {reservation.requestedQty} • Pickup {formatDate(reservation.requestedDate)}</p>
              <p className="text-xs font-medium text-slate-500">Reservation ID: {reservation.scanCode}</p>
            </div>
            <ReservationStatusBadge status={reservation.status} />
          </div>
        </Card>
      ))}
    </section>
  );
};

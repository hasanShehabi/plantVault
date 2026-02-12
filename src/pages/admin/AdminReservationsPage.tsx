import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ReservationStatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useAdminReservations, useUpdateReservationStatus } from "@/features/reservations/hooks";
import { useToast } from "@/lib/toast";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { ReservationStatus } from "@/types/reservation";

export const AdminReservationsPage = () => {
  const { data = [], isLoading } = useAdminReservations();
  const [confirm, setConfirm] = useState<{ id: string; status: ReservationStatus } | null>(null);
  const updateStatus = useUpdateReservationStatus();
  const { showToast } = useToast();

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-slate-200" />;
  }

  if (data.length === 0) {
    return <EmptyState title="No reservations" description="New reservation requests will appear here." />;
  }

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">Reservation Management</h2>
        <p className="text-sm text-slate-600">Pending requests are shown first.</p>
      </div>

      {data.map((reservation) => (
        <Card key={reservation.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">{reservation.plantName}</h3>
              <p className="text-sm text-slate-600">Requested by {reservation.userName}</p>
              <p className="text-sm text-slate-600">Qty {reservation.requestedQty} • Pickup {formatDate(reservation.requestedDate)}</p>
              <p className="text-xs font-medium text-slate-500">Reservation ID: {reservation.scanCode}</p>
              <p className="text-xs text-slate-500">Created {formatDateTime(reservation.createdAt)}</p>
            </div>
            <ReservationStatusBadge status={reservation.status} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" disabled={reservation.status !== "pending"} onClick={() => setConfirm({ id: reservation.id, status: "approved" })}>Approve</Button>
            <Button variant="danger" disabled={reservation.status !== "pending"} onClick={() => setConfirm({ id: reservation.id, status: "rejected" })}>Reject</Button>
            <Button variant="ghost" disabled={reservation.status !== "approved"} onClick={() => setConfirm({ id: reservation.id, status: "fulfilled" })}>Mark Fulfilled</Button>
          </div>
        </Card>
      ))}

      <Dialog open={Boolean(confirm)} onClose={() => setConfirm(null)} title="Confirm status update">
        <p className="mb-4 text-sm text-slate-700">Are you sure you want to set this reservation to {confirm?.status}?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirm(null)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (!confirm) return;
              await updateStatus.mutateAsync(confirm);
              showToast("Reservation updated", "success");
              setConfirm(null);
            }}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </section>
  );
};

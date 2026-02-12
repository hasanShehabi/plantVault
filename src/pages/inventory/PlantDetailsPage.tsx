import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { ScanCode } from "@/components/common/ScanCode";
import { PlantStatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ReservePlantForm } from "@/features/reservations/components/ReservePlantForm";
import { useCreateReservation } from "@/features/reservations/hooks";
import { usePlant } from "@/features/inventory/hooks";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { formatDateTime } from "@/lib/utils";

export const PlantDetailsPage = () => {
  const { plantId = "" } = useParams();
  const navigate = useNavigate();
  const { data: plant, isLoading } = usePlant(plantId);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const reserveMutation = useCreateReservation();

  if (isLoading) {
    return <div className="h-56 animate-pulse rounded-xl bg-slate-200" />;
  }

  if (!plant) {
    return <EmptyState title="Plant not found" description="This item may have been removed." />;
  }

  const isReservable = plant.status === "available" && plant.quantityAvailable > 0;

  return (
    <section>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">Back</Button>
      <Card className="overflow-hidden p-0">
        <img
          src={plant.imageUrl ?? "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80"}
          alt={plant.name}
          className="h-56 w-full object-cover"
        />
        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{plant.name}</h2>
              <p className="text-slate-600">{plant.species}</p>
            </div>
            <PlantStatusBadge status={plant.status} />
          </div>
          <p className="text-sm text-slate-700">Location: {plant.location}</p>
          <p className="text-sm text-slate-700">Scan ID: <span className="font-semibold">{plant.scanCode}</span></p>
          <p className="text-sm text-slate-700">Available quantity: {plant.quantityAvailable} {plant.unit}(s)</p>
          {plant.variety && <p className="text-sm text-slate-700">Variety: {plant.variety}</p>}
          {plant.ageMonths != null && <p className="text-sm text-slate-700">Age: {plant.ageMonths} months</p>}
          <p className="text-sm text-slate-700">Tags: {plant.tags.join(", ")}</p>
          {plant.notes && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{plant.notes}</p>}
          <p className="text-xs text-slate-500">Updated {formatDateTime(plant.updatedAt)}</p>
          <ScanCode code={plant.scanCode} label="Plant Scan ID" />

          {user?.role === "user" && (
            <Button disabled={!isReservable} onClick={() => setOpen(true)}>
              {isReservable ? "Reserve This Plant" : "Currently Unavailable"}
            </Button>
          )}
        </div>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title="Reserve Plant">
        <ReservePlantForm
          maxQty={plant.quantityAvailable}
          busy={reserveMutation.isPending}
          onSubmit={async (values) => {
            if (!user) return;
            await reserveMutation.mutateAsync({
              plantId: plant.id,
              plantName: plant.name,
              requestedQty: values.requestedQty,
              requestedDate: new Date(values.requestedDate).toISOString(),
              userId: user.id,
              userName: user.name,
            });
            showToast("Reservation submitted", "success");
            setOpen(false);
          }}
        />
      </Dialog>
    </section>
  );
};

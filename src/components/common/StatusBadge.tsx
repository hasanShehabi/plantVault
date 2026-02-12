import { Badge } from "@/components/ui/badge";
import type { PlantStatus } from "@/types/plant";
import type { ReservationStatus } from "@/types/reservation";
import { capitalize } from "@/lib/utils";

export const PlantStatusBadge = ({ status }: { status: PlantStatus }) => (
  <Badge tone={status === "available" ? "success" : "danger"}>{capitalize(status)}</Badge>
);

export const ReservationStatusBadge = ({ status }: { status: ReservationStatus }) => {
  const tone =
    status === "approved" ? "success" : status === "pending" ? "warning" : status === "rejected" ? "danger" : "neutral";
  return <Badge tone={tone}>{capitalize(status)}</Badge>;
};

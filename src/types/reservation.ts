export type ReservationStatus = "pending" | "approved" | "rejected" | "fulfilled";

export interface Reservation {
  id: string;
  scanCode: string;
  plantId: string;
  plantName: string;
  requestedQty: number;
  requestedDate: string;
  userName: string;
  userId: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface CreateReservationInput {
  plantId: string;
  plantName: string;
  requestedQty: number;
  requestedDate: string;
  userName: string;
  userId: string;
}

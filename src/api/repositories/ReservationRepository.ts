import type { CreateReservationInput, Reservation, ReservationStatus } from "@/types/reservation";

export interface ReservationRepository {
  listAll(): Promise<Reservation[]>;
  listByUser(userId: string): Promise<Reservation[]>;
  create(input: CreateReservationInput): Promise<Reservation>;
  updateStatus(id: string, status: ReservationStatus): Promise<Reservation>;
}

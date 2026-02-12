import type { ReservationRepository } from "@/api/repositories/ReservationRepository";
import type { CreateReservationInput, Reservation, ReservationStatus } from "@/types/reservation";

export class FirebaseReservationRepository implements ReservationRepository {
  async listAll(): Promise<Reservation[]> {
    // TODO: Replace with Firestore query sorted with pending first.
    throw new Error("FirebaseReservationRepository.listAll is not implemented yet.");
  }

  async listByUser(_userId: string): Promise<Reservation[]> {
    // TODO: Query reservations by userId.
    throw new Error("FirebaseReservationRepository.listByUser is not implemented yet.");
  }

  async create(_input: CreateReservationInput): Promise<Reservation> {
    // TODO: Create reservation document in Firestore.
    throw new Error("FirebaseReservationRepository.create is not implemented yet.");
  }

  async updateStatus(_id: string, _status: ReservationStatus): Promise<Reservation> {
    // TODO: Update reservation status in Firestore.
    throw new Error("FirebaseReservationRepository.updateStatus is not implemented yet.");
  }
}

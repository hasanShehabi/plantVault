import type { ReservationRepository } from "@/api/repositories/ReservationRepository";
import { db, createId, createScanCode } from "@/api/repositories/mock/mockDb";
import type { CreateReservationInput, Reservation, ReservationStatus } from "@/types/reservation";

const sleep = async (ms = 220): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export class MockReservationRepository implements ReservationRepository {
  async listAll(): Promise<Reservation[]> {
    await sleep();
    return [...db.reservations].sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }

  async listByUser(userId: string): Promise<Reservation[]> {
    await sleep();
    return db.reservations
      .filter((res) => res.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async create(input: CreateReservationInput): Promise<Reservation> {
    await sleep(280);
    const reservation: Reservation = {
      id: createId("res"),
      scanCode: createScanCode(
        "RES",
        db.reservations.map((item) => item.scanCode),
      ),
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    db.reservations.unshift(reservation);
    return reservation;
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    await sleep(220);
    const idx = db.reservations.findIndex((res) => res.id === id);
    if (idx < 0) {
      throw new Error("Reservation not found");
    }
    const updated = { ...db.reservations[idx], status };
    db.reservations[idx] = updated;
    return updated;
  }
}

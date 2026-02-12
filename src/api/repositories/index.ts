import { MockPlantRepository } from "@/api/repositories/mock/MockPlantRepository";
import { MockReservationRepository } from "@/api/repositories/mock/MockReservationRepository";
import type { PlantRepository } from "@/api/repositories/PlantRepository";
import type { ReservationRepository } from "@/api/repositories/ReservationRepository";

const dataProvider = "mock" as const;

export const plantRepository: PlantRepository =
  dataProvider === "mock"
    ? new MockPlantRepository()
    : (() => {
        throw new Error("Configure Firebase provider.");
      })();

export const reservationRepository: ReservationRepository =
  dataProvider === "mock"
    ? new MockReservationRepository()
    : (() => {
        throw new Error("Configure Firebase provider.");
      })();

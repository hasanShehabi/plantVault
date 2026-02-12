import { plantSeedData } from "@/api/mockData/plants";
import { reservationSeedData } from "@/api/mockData/reservations";
import type { PlantItem } from "@/types/plant";
import type { Reservation } from "@/types/reservation";

const clonePlants = (): PlantItem[] => structuredClone(plantSeedData);
const cloneReservations = (): Reservation[] => structuredClone(reservationSeedData);

export const db = {
  plants: clonePlants(),
  reservations: cloneReservations(),
};

export const createId = (prefix: string): string => {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${rand}`;
};

export const createScanCode = (prefix: "PLANT" | "RES", existingCodes: string[]): string => {
  const regex = new RegExp(`^PV-${prefix}-(\\d+)$`);
  const max = existingCodes.reduce((acc, code) => {
    const match = code.match(regex);
    if (!match) return acc;
    const value = Number(match[1]);
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 0);
  const next = (max + 1).toString().padStart(4, "0");
  return `PV-${prefix}-${next}`;
};

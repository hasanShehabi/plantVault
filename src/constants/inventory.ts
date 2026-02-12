import type { PlantCategory, PlantStatus } from "@/types/plant";
import type { ReservationStatus } from "@/types/reservation";

export const PLANT_CATEGORIES: { label: string; value: PlantCategory }[] = [
  { label: "Tree", value: "tree" },
  { label: "Fruit Tree", value: "fruit_tree" },
  { label: "Flower", value: "flower" },
  { label: "Vegetable", value: "vegetable" },
  { label: "Herb", value: "herb" },
  { label: "Seedling", value: "seedling" },
];

export const PLANT_STATUSES: { label: string; value: PlantStatus }[] = [
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
];

export const RESERVATION_STATUSES: { label: string; value: ReservationStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Fulfilled", value: "fulfilled" },
];

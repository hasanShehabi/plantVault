export type PlantCategory =
  | "tree"
  | "fruit_tree"
  | "flower"
  | "vegetable"
  | "herb"
  | "seedling";

export type PlantStatus = "available" | "unavailable";

export type PlantUnit = "tree" | "pot" | "seedling";

export interface PlantItem {
  id: string;
  scanCode: string;
  name: string;
  species: string;
  category: PlantCategory;
  variety?: string;
  ageMonths?: number;
  location: string;
  quantityAvailable: number;
  unit: PlantUnit;
  status: PlantStatus;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export interface PlantFilters {
  search?: string;
  category?: PlantCategory | "all";
  status?: PlantStatus | "all";
  location?: string | "all";
  sortBy?: "name" | "updatedAt" | "quantity";
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type CreatePlantInput = Omit<PlantItem, "id" | "scanCode" | "createdAt" | "updatedAt">;
export type UpdatePlantInput = Partial<CreatePlantInput>;

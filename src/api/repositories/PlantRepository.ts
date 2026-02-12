import type { CreatePlantInput, PaginatedResult, PlantFilters, PlantItem, PlantStatus, UpdatePlantInput } from "@/types/plant";

export interface PlantRepository {
  list(filters?: PlantFilters): Promise<PaginatedResult<PlantItem>>;
  getById(id: string): Promise<PlantItem | null>;
  create(input: CreatePlantInput): Promise<PlantItem>;
  update(id: string, input: UpdatePlantInput): Promise<PlantItem>;
  updateStatus(id: string, status: PlantStatus): Promise<PlantItem>;
  listLocations(): Promise<string[]>;
}

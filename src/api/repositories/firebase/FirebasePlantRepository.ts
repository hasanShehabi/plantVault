import type { PlantRepository } from "@/api/repositories/PlantRepository";
import type { CreatePlantInput, PaginatedResult, PlantFilters, PlantItem, PlantStatus, UpdatePlantInput } from "@/types/plant";

export class FirebasePlantRepository implements PlantRepository {
  async list(_filters?: PlantFilters): Promise<PaginatedResult<PlantItem>> {
    // TODO: Replace with Firestore query and cursor pagination.
    throw new Error("FirebasePlantRepository.list is not implemented yet.");
  }

  async getById(_id: string): Promise<PlantItem | null> {
    // TODO: Replace with Firestore doc fetch.
    throw new Error("FirebasePlantRepository.getById is not implemented yet.");
  }

  async create(_input: CreatePlantInput): Promise<PlantItem> {
    // TODO: Create document in Firestore.
    throw new Error("FirebasePlantRepository.create is not implemented yet.");
  }

  async update(_id: string, _input: UpdatePlantInput): Promise<PlantItem> {
    // TODO: Update document in Firestore.
    throw new Error("FirebasePlantRepository.update is not implemented yet.");
  }

  async updateStatus(_id: string, _status: PlantStatus): Promise<PlantItem> {
    // TODO: Patch status field in Firestore.
    throw new Error("FirebasePlantRepository.updateStatus is not implemented yet.");
  }

  async listLocations(): Promise<string[]> {
    // TODO: Query unique locations from Firestore.
    throw new Error("FirebasePlantRepository.listLocations is not implemented yet.");
  }
}

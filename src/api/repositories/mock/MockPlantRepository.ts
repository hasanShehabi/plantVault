import type { PlantRepository } from "@/api/repositories/PlantRepository";
import { db, createId, createScanCode } from "@/api/repositories/mock/mockDb";
import type {
  CreatePlantInput,
  PaginatedResult,
  PlantFilters,
  PlantItem,
  PlantStatus,
  UpdatePlantInput,
} from "@/types/plant";

const sleep = async (ms = 220): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const sortItems = (items: PlantItem[], sortBy: PlantFilters["sortBy"]): PlantItem[] => {
  const copied = [...items];
  if (sortBy === "quantity") {
    return copied.sort((a, b) => b.quantityAvailable - a.quantityAvailable);
  }
  if (sortBy === "updatedAt") {
    return copied.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return copied.sort((a, b) => a.name.localeCompare(b.name));
};

export class MockPlantRepository implements PlantRepository {
  async list(filters?: PlantFilters): Promise<PaginatedResult<PlantItem>> {
    await sleep();
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 8;

    const searched = db.plants.filter((item) => {
      const search = (filters?.search ?? "").trim().toLowerCase();
      const matchesSearch =
        !search ||
        item.scanCode.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        item.species.toLowerCase().includes(search) ||
        item.tags.some((tag) => tag.toLowerCase().includes(search));
      const matchesCategory = !filters?.category || filters.category === "all" || item.category === filters.category;
      const matchesStatus = !filters?.status || filters.status === "all" || item.status === filters.status;
      const matchesLocation = !filters?.location || filters.location === "all" || item.location === filters.location;
      return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
    });

    const sorted = sortItems(searched, filters?.sortBy);
    const start = (page - 1) * pageSize;
    const data = sorted.slice(start, start + pageSize);

    return {
      data,
      total: sorted.length,
      page,
      pageSize,
    };
  }

  async getById(id: string): Promise<PlantItem | null> {
    await sleep(150);
    return db.plants.find((item) => item.id === id) ?? null;
  }

  async create(input: CreatePlantInput): Promise<PlantItem> {
    await sleep(250);
    const now = new Date().toISOString();
    const plant: PlantItem = {
      ...input,
      id: createId("plant"),
      scanCode: createScanCode(
        "PLANT",
        db.plants.map((item) => item.scanCode),
      ),
      createdAt: now,
      updatedAt: now,
    };
    db.plants.unshift(plant);
    return plant;
  }

  async update(id: string, input: UpdatePlantInput): Promise<PlantItem> {
    await sleep(250);
    const idx = db.plants.findIndex((item) => item.id === id);
    if (idx < 0) {
      throw new Error("Plant not found");
    }
    const updated: PlantItem = {
      ...db.plants[idx],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    db.plants[idx] = updated;
    return updated;
  }

  async updateStatus(id: string, status: PlantStatus): Promise<PlantItem> {
    return this.update(id, { status });
  }

  async listLocations(): Promise<string[]> {
    await sleep(120);
    return [...new Set(db.plants.map((p) => p.location))].sort((a, b) => a.localeCompare(b));
  }
}

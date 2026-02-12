import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { ScanSearch } from "@/components/common/ScanSearch";
import { Skeleton } from "@/components/common/Skeleton";
import { PlantStatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PLANT_CATEGORIES } from "@/constants/inventory";
import { usePlantLocations, usePlants } from "@/features/inventory/hooks";
import type { PlantCategory, PlantStatus } from "@/types/plant";

export const InventoryListPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PlantCategory | "all">("all");
  const [status, setStatus] = useState<PlantStatus | "all">("all");
  const [location, setLocation] = useState<"all" | string>("all");
  const [sortBy, setSortBy] = useState<"name" | "updatedAt" | "quantity">("name");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({ search, category, status, location, sortBy, page, pageSize: 6 }),
    [search, category, status, location, sortBy, page],
  );

  const { data, isLoading, isError } = usePlants(filters);
  const { data: locations = [] } = usePlantLocations();

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">Plant Inventory</h2>
        <div className="mt-3">
          <ScanSearch
            onDetected={(code) => {
              setSearch(code);
              setPage(1);
            }}
          />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            placeholder="Search by name/species/tags"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            aria-label="Search plants"
          />
          <Select value={category} onChange={(e) => setCategory(e.target.value as PlantCategory | "all")} aria-label="Filter by category">
            <option value="all">All categories</option>
            {PLANT_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value as PlantStatus | "all")} aria-label="Filter by status">
            <option value="all">Any status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </Select>
          <Select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter by location">
            <option value="all">All locations</option>
            {locations.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "updatedAt" | "quantity")} aria-label="Sort by">
            <option value="name">Sort: Name</option>
            <option value="updatedAt">Sort: Recently Updated</option>
            <option value="quantity">Sort: Quantity</option>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && <EmptyState title="Could not load plants" description="Please retry in a moment." />}

      {!isLoading && data && data.data.length === 0 && (
        <EmptyState title="No plants found" description="Try changing search or filter options." />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.data.map((plant) => (
              <Card key={plant.id} className="p-0">
                <img
                  src={plant.imageUrl ?? "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=900&q=80"}
                  alt={plant.name}
                  className="h-36 w-full rounded-t-xl object-cover"
                  loading="lazy"
                />
                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{plant.name}</h3>
                      <p className="text-sm text-slate-600">{plant.species}</p>
                    </div>
                    <PlantStatusBadge status={plant.status} />
                  </div>
                  <p className="text-sm text-slate-600">{plant.location}</p>
                  <p className="text-xs font-medium text-slate-500">ID: {plant.scanCode}</p>
                  <p className="text-sm text-slate-700">{plant.quantityAvailable} {plant.unit}(s)</p>
                  <Link to={`/plants/${plant.id}`} className="inline-block text-sm font-medium text-brand-700 underline">View Details</Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">Page {data.page}</span>
            <button
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
              disabled={data.page * data.pageSize >= data.total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

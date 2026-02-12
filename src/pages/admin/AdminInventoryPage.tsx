import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ScanSearch } from "@/components/common/ScanSearch";
import { PlantStatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlantForm } from "@/features/inventory/components/PlantForm";
import { useCreatePlant, usePlants, useUpdatePlant, useUpdatePlantStatus } from "@/features/inventory/hooks";
import { useToast } from "@/lib/toast";
import type { PlantItem } from "@/types/plant";

export const AdminInventoryPage = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PlantItem | null>(null);

  const filters = useMemo(() => ({ search, page: 1, pageSize: 100, sortBy: "updatedAt" as const }), [search]);
  const { data, isLoading } = usePlants(filters);
  const createPlant = useCreatePlant();
  const updatePlant = useUpdatePlant();
  const updatePlantStatus = useUpdatePlantStatus();
  const { showToast } = useToast();

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Inventory Management</h2>
          <p className="text-sm text-slate-600">Create, edit, and update availability status.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Add Plant</Button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
        <Input placeholder="Search plants..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <ScanSearch onDetected={(code) => setSearch(code)} />
      </div>

      {isLoading && <div className="h-48 animate-pulse rounded-xl bg-slate-200" />}
      {!isLoading && data && data.data.length === 0 && (
        <EmptyState title="No plants in inventory" description="Add your first plant to get started." actionLabel="Add Plant" onAction={() => setOpen(true)} />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-700">
                <tr>
                  <th className="px-3 py-2">Scan ID</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((plant) => (
                  <tr key={plant.id} className="border-t border-slate-200">
                    <td className="px-3 py-2 font-medium text-slate-700">{plant.scanCode}</td>
                    <td className="px-3 py-2">{plant.name}</td>
                    <td className="px-3 py-2">{plant.location}</td>
                    <td className="px-3 py-2">{plant.quantityAvailable} {plant.unit}(s)</td>
                    <td className="px-3 py-2"><PlantStatusBadge status={plant.status} /></td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => { setEditing(plant); setOpen(true); }}>Edit</Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            updatePlantStatus.mutate(
                              {
                                id: plant.id,
                                status: plant.status === "available" ? "unavailable" : "available",
                              },
                              { onSuccess: () => showToast("Availability updated", "success") },
                            );
                          }}
                        >
                          Toggle
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {data.data.map((plant) => (
              <Card key={plant.id}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{plant.name}</h3>
                  <PlantStatusBadge status={plant.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{plant.location} • {plant.quantityAvailable} {plant.unit}(s)</p>
                <p className="mt-1 text-xs font-medium text-slate-500">ID: {plant.scanCode}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" onClick={() => { setEditing(plant); setOpen(true); }}>Edit</Button>
                  <Button variant="ghost" onClick={() => updatePlantStatus.mutate({ id: plant.id, status: plant.status === "available" ? "unavailable" : "available" })}>Toggle</Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={open} onClose={handleClose} title={editing ? "Edit Plant" : "Add Plant"}>
        <PlantForm
          initial={editing ?? undefined}
          busy={createPlant.isPending || updatePlant.isPending}
          onSubmit={async (input) => {
            if (editing) {
              await updatePlant.mutateAsync({ id: editing.id, input });
              showToast("Plant updated", "success");
            } else {
              await createPlant.mutateAsync(input);
              showToast("Plant created", "success");
            }
            handleClose();
          }}
        />
      </Dialog>
    </section>
  );
};

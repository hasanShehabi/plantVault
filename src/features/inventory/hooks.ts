import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { plantRepository } from "@/api/repositories";
import type { CreatePlantInput, PlantFilters, PlantStatus, UpdatePlantInput } from "@/types/plant";

export const plantKeys = {
  all: ["plants"] as const,
  list: (filters: PlantFilters) => ["plants", "list", filters] as const,
  detail: (id: string) => ["plants", "detail", id] as const,
  locations: ["plants", "locations"] as const,
};

export const usePlants = (filters: PlantFilters) =>
  useQuery({
    queryKey: plantKeys.list(filters),
    queryFn: () => plantRepository.list(filters),
  });

export const usePlant = (id: string) =>
  useQuery({
    queryKey: plantKeys.detail(id),
    queryFn: () => plantRepository.getById(id),
    enabled: Boolean(id),
  });

export const usePlantLocations = () =>
  useQuery({
    queryKey: plantKeys.locations,
    queryFn: () => plantRepository.listLocations(),
  });

export const useCreatePlant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePlantInput) => plantRepository.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
    },
  });
};

export const useUpdatePlant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePlantInput }) => plantRepository.update(id, input),
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
      queryClient.invalidateQueries({ queryKey: plantKeys.detail(variables.id) });
    },
  });
};

export const useUpdatePlantStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PlantStatus }) => plantRepository.updateStatus(id, status),
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
      queryClient.invalidateQueries({ queryKey: plantKeys.detail(variables.id) });
    },
  });
};

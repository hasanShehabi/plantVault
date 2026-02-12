import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationRepository } from "@/api/repositories";
import type { CreateReservationInput, ReservationStatus } from "@/types/reservation";

export const reservationKeys = {
  all: ["reservations"] as const,
  admin: ["reservations", "admin"] as const,
  byUser: (userId: string) => ["reservations", "user", userId] as const,
};

export const useAdminReservations = () =>
  useQuery({
    queryKey: reservationKeys.admin,
    queryFn: () => reservationRepository.listAll(),
  });

export const useMyReservations = (userId: string) =>
  useQuery({
    queryKey: reservationKeys.byUser(userId),
    queryFn: () => reservationRepository.listByUser(userId),
    enabled: Boolean(userId),
  });

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReservationInput) => reservationRepository.create(input),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
      queryClient.invalidateQueries({ queryKey: reservationKeys.byUser(created.userId) });
    },
  });
};

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReservationStatus }) => reservationRepository.updateStatus(id, status),
    onSuccess: (_updated) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  requestedQty: z.coerce.number().int().min(1),
  requestedDate: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  maxQty: number;
  onSubmit: (values: FormValues) => Promise<void>;
  busy?: boolean;
}

export const ReservePlantForm = ({ maxQty, onSubmit, busy }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      requestedQty: 1,
      requestedDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    },
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
      <label className="block text-sm font-medium text-slate-700">
        Quantity (max {maxQty})
        <Input type="number" min={1} max={maxQty} {...register("requestedQty", { max: maxQty })} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Pickup date
        <Input type="date" {...register("requestedDate")} />
      </label>
      {errors.requestedQty && <p className="text-sm text-red-600">Quantity must be between 1 and {maxQty}.</p>}
      <Button type="submit" disabled={busy}>{busy ? "Submitting..." : "Submit Reservation"}</Button>
    </form>
  );
};

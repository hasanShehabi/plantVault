import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PLANT_CATEGORIES } from "@/constants/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreatePlantInput, PlantItem } from "@/types/plant";

const schema = z.object({
  name: z.string().min(2),
  species: z.string().min(2),
  category: z.enum(["tree", "fruit_tree", "flower", "vegetable", "herb", "seedling"]),
  variety: z.string().optional(),
  ageMonths: z.coerce.number().int().min(0).optional(),
  location: z.string().min(2),
  quantityAvailable: z.coerce.number().int().min(0),
  unit: z.enum(["tree", "pot", "seedling"]),
  status: z.enum(["available", "unavailable"]),
  tags: z.string().default(""),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface PlantFormProps {
  initial?: PlantItem;
  onSubmit: (input: CreatePlantInput) => Promise<void>;
  busy?: boolean;
}

export const PlantForm = ({ initial, onSubmit, busy }: PlantFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          ...initial,
          tags: initial.tags.join(", "),
          imageUrl: initial.imageUrl ?? "",
          variety: initial.variety ?? "",
          notes: initial.notes ?? "",
        }
      : {
          status: "available",
          unit: "tree",
          category: "fruit_tree",
          tags: "",
          quantityAvailable: 0,
          imageUrl: "",
          location: "",
          name: "",
          species: "",
          notes: "",
          variety: "",
        },
  });

  return (
    <form
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          name: values.name,
          species: values.species,
          category: values.category,
          variety: values.variety || undefined,
          ageMonths: values.ageMonths,
          location: values.location,
          quantityAvailable: values.quantityAvailable,
          unit: values.unit,
          status: values.status,
          tags: values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          notes: values.notes || undefined,
          imageUrl: values.imageUrl || undefined,
        });
      })}
    >
      <label className="text-sm font-medium text-slate-700">Name<Input {...register("name")} /></label>
      <label className="text-sm font-medium text-slate-700">Species<Input {...register("species")} /></label>
      <label className="text-sm font-medium text-slate-700">Category
        <Select {...register("category")}>
          {PLANT_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>{category.label}</option>
          ))}
        </Select>
      </label>
      <label className="text-sm font-medium text-slate-700">Variety<Input {...register("variety")} /></label>
      <label className="text-sm font-medium text-slate-700">Age (months)<Input type="number" {...register("ageMonths")} /></label>
      <label className="text-sm font-medium text-slate-700">Location<Input {...register("location")} /></label>
      <label className="text-sm font-medium text-slate-700">Quantity<Input type="number" {...register("quantityAvailable")} /></label>
      <label className="text-sm font-medium text-slate-700">Unit
        <Select {...register("unit")}>
          <option value="tree">Tree</option>
          <option value="pot">Pot</option>
          <option value="seedling">Seedling</option>
        </Select>
      </label>
      <label className="text-sm font-medium text-slate-700">Status
        <Select {...register("status")}>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </Select>
      </label>
      <label className="text-sm font-medium text-slate-700">Image URL<Input {...register("imageUrl")} /></label>
      <label className="text-sm font-medium text-slate-700 sm:col-span-2">Tags (comma separated)<Input {...register("tags")} /></label>
      <label className="text-sm font-medium text-slate-700 sm:col-span-2">Notes<Textarea rows={3} {...register("notes")} /></label>

      {(errors.name || errors.species || errors.location || errors.quantityAvailable) && (
        <p className="sm:col-span-2 text-sm text-red-600">Please fix the highlighted fields.</p>
      )}

      <div className="sm:col-span-2 flex justify-end gap-2">
        <Button type="submit" disabled={busy}>{busy ? "Saving..." : initial ? "Save Changes" : "Create Plant"}</Button>
      </div>
    </form>
  );
};

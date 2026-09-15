import { z } from "zod";
import { ApiError, apiGet } from "./client";
export const unitSchema = z.object({
  publicCode: z.string(),
  nameVi: z.string(),
  nameEn: z.string(),
  slugVi: z.string(),
  slugEn: z.string(),
  descriptionVi: z.string(),
  descriptionEn: z.string(),
  bedroomCount: z.number(),
  bathroomCount: z.coerce.number(),
  bedCount: z.number(),
  maxGuests: z.number(),
  area: z.coerce.number(),
  viewType: z.string().nullable(),
  basePrice: z.coerce.number(),
  currency: z.string(),
  status: z.string(),
  property: z.object({ name: z.string(), address: z.string() }),
  amenities: z.array(
    z.object({
      amenity: z.object({
        code: z.string(),
        nameVi: z.string(),
        nameEn: z.string(),
        icon: z.string().nullable(),
        category: z.string(),
      }),
    }),
  ),
  media: z.array(
    z.object({
      type: z.string(),
      sortOrder: z.number(),
      media: z.object({
        url: z.string(),
        width: z.number().nullable(),
        height: z.number().nullable(),
        altVi: z.string().nullable(),
        altEn: z.string().nullable(),
      }),
    }),
  ),
});
export type Unit = z.infer<typeof unitSchema>;
export async function getUnits(filters?: {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}): Promise<Unit[]> {
  try {
    const query = new URLSearchParams();
    if (filters?.checkIn) query.set("checkIn", filters.checkIn);
    if (filters?.checkOut) query.set("checkOut", filters.checkOut);
    if (filters?.guests) query.set("guests", String(filters.guests));
    return await apiGet(
      `/units${query.size ? `?${query}` : ""}`,
      z.array(unitSchema),
      filters ? { cache: "no-store" } : undefined,
    );
  } catch (error) {
    console.error("Unit catalog unavailable", error);
    return [];
  }
}
export async function getUnit(slug: string): Promise<Unit | undefined> {
  try {
    return await apiGet(`/units/${encodeURIComponent(slug)}`, unitSchema);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

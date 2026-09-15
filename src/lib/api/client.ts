import "server-only";
import { z } from "zod";
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
export async function apiGet<T extends z.ZodType>(
  path: string,
  schema: T,
  options?: RequestInit,
): Promise<z.output<T>> {
  const base = process.env.API_URL ?? "http://localhost:3000/api/v1";
  const response = await fetch(`${base}${path}`, {
    ...options,
    next: { revalidate: 60, ...options?.next },
  });
  if (!response.ok)
    throw new ApiError(`API request failed: ${path}`, response.status);
  const envelope = z
    .object({ success: z.literal(true), data: z.unknown() })
    .safeParse(await response.json());
  if (!envelope.success)
    throw new ApiError(`Invalid API envelope: ${path}`, 502);
  const parsed = schema.safeParse(envelope.data.data);
  if (!parsed.success) throw new ApiError(`Invalid API data: ${path}`, 502);
  return parsed.data;
}

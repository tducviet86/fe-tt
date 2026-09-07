import { z } from "zod";
export const quoteSchema=z.object({currency:z.string(),nights:z.number(),nightlyBreakdown:z.array(z.object({date:z.string(),amount:z.string(),source:z.string()})),subtotal:z.string(),cleaningFee:z.string(),serviceFee:z.string(),discount:z.string(),total:z.string(),requiredDeposit:z.string(),remainingAmount:z.string(),quoteId:z.string().nullable(),expiresAt:z.coerce.date()});
export type PriceQuote=z.infer<typeof quoteSchema>;

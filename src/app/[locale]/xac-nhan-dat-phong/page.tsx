import { notFound } from "next/navigation";
import { CheckoutConfirmation } from "@/components/booking/checkout-confirmation";
import { getUnit } from "@/lib/api/units";
import { isLocale } from "@/lib/i18n/config";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const required = [
    query.publicCode,
    query.quoteId,
    query.checkIn,
    query.checkOut,
    query.total,
    query.deposit,
    query.currency,
  ];
  if (required.some((value) => !value)) notFound();
  const unit = await getUnit(query.publicCode!);
  if (!unit) notFound();
  return (
    <CheckoutConfirmation
      locale={locale}
      unit={unit}
      checkout={{
        publicCode: query.publicCode!,
        quoteId: query.quoteId!,
        checkIn: query.checkIn!,
        checkOut: query.checkOut!,
        guests: Math.max(1, Number(query.guests) || 1),
        nights: Math.max(1, Number(query.nights) || 1),
        total: query.total!,
        deposit: query.deposit!,
        currency: query.currency!,
      }}
    />
  );
}

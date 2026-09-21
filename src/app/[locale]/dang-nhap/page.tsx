import { notFound } from "next/navigation";
import { CustomerAuthForm } from "@/components/auth/customer-auth-form";
import { isLocale } from "@/lib/i18n/config";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CustomerAuthForm locale={locale} mode="login" />;
}

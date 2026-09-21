import { notFound } from "next/navigation";
import { ProfileForm } from "@/components/auth/profile-form";
import { isLocale } from "@/lib/i18n/config";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ProfileForm locale={locale} />;
}

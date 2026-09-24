import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  HomeExperience,
  HomeCatalog,
} from "@/components/commercial/home-experience";
import { getUnits } from "@/lib/api/units";
export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}
async function Catalog({ locale }: { locale: "vi" | "en" }) {
  return <HomeCatalog locale={locale} units={await getUnits()} />;
}
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "vi" && locale !== "en") notFound();
  return (
    <HomeExperience locale={locale}>
      <Suspense
        fallback={
          <div role="status">
            <p className="guest-result-count">
              {locale === "vi"
                ? "Đang tải danh sách căn hộ…"
                : "Loading apartments…"}
            </p>
            <div className="guest-catalog-skeleton">
              <div />
              <div />
              <div />
            </div>
          </div>
        }
      >
        <Catalog locale={locale} />
      </Suspense>
    </HomeExperience>
  );
}

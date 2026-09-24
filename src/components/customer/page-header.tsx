import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AccountMenu } from "@/components/auth/account-menu";
export function PageHeader({
  locale,
  backHref,
  backLabel,
}: {
  locale: "vi" | "en";
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="customer-page-header">
      <div className="container-site">
        <Link className="customer-logo" href={`/${locale}`}>
          ABC.<small>APARTMENT / DA NANG</small>
        </Link>
        <nav>
          <Link href={backHref ?? `/${locale}`}>
            <ArrowLeft size={16} />
            {backLabel ?? (locale === "vi" ? "Trang chủ" : "Home")}
          </Link>
          <AccountMenu locale={locale} />
        </nav>
      </div>
    </header>
  );
}

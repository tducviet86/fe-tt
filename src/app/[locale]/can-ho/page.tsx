import { CatalogPage } from "@/components/apartment/catalog-page";
import { getUnits } from "@/lib/api/units";
export default async function Apartments() {
  return <CatalogPage units={await getUnits()} locale="vi" />;
}

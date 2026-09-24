import { PageLoading } from "@/components/shared/page-loading";

export default function DoctorsLoading() {
  return <PageLoading variant="grid" label="Loading doctors" sublabel="Finding available providers" />;
}

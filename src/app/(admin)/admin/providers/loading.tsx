import { PageLoading } from "@/components/shared/page-loading";

export default function AdminProvidersLoading() {
  return <PageLoading variant="table" label="Loading providers" sublabel="Fetching provider directory" />;
}
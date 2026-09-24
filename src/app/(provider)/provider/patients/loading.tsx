import { PageLoading } from "@/components/shared/page-loading";

export default function ProviderPatientsLoading() {
  return <PageLoading variant="table" label="Loading patient queue" sublabel="Preparing clinical workspace" />;
}

import { PageLoading } from "@/components/shared/page-loading";

export default function AdminUsersLoading() {
  return <PageLoading variant="table" label="Loading users" sublabel="Fetching portal accounts" />;
}

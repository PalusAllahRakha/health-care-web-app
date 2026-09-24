"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ADMIN_USER, DEMO_USER, PROVIDER_USER } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";
import { mockFetch } from "@/lib/api/mock";
import type { User } from "@/types";

const demoUsers = [DEMO_USER, PROVIDER_USER, ADMIN_USER];

const columns = [
  {
    key: "name",
    header: "Name",
    cell: (user: User) => <span className="font-semibold text-[var(--color-text-primary)]">{user.name}</span>,
  },
  {
    key: "email",
    header: "Email",
    cell: (user: User) => <span className="text-[var(--color-text-secondary)]">{user.email}</span>,
  },
  {
    key: "role",
    header: "Role",
    cell: (user: User) => (
      <Badge variant="secondary" className="capitalize">{user.role}</Badge>
    ),
  },
  {
    key: "id",
    header: "ID",
    cell: (user: User) => <span className="font-mono text-xs text-[var(--color-text-disabled)]">{user.id}</span>,
  },
];

export default function AdminUsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => mockFetch(demoUsers, 500),
  });

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Administration"
        title="User management"
        description="View and manage portal user accounts across all roles."
      />

      {isLoading ? (
        <SectionLoader label="Loading users" sublabel="Fetching account list" />
      ) : (
        <Card className="card-hover overflow-hidden">
          <CardHeader className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40">
            <CardTitle className="text-base">{users?.length ?? 0} registered users</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={users ?? []}
              getRowKey={(u) => u.id}
              emptyMessage="No users found"
            />
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}

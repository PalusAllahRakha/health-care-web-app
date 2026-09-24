"use client";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { ProfilePageContent } from "@/components/profile/profile-page-content";
import { getRoleHomePath } from "@/lib/auth/roles";
import { useAuth } from "@/providers/auth-provider";

export function ProfilePage() {
  const { user } = useAuth();
  const homePath = user ? getRoleHomePath(user.role) : "/dashboard";

  return (
    <PageContainer>
      <PageHeader
        title="Profile"
        description="Manage your personal information, preferences, and security settings."
        breadcrumbs={[
          { label: "Home", href: homePath },
          { label: "Profile" },
        ]}
      />
      <ProfilePageContent />
    </PageContainer>
  );
}

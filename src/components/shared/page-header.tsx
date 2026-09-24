import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
  breadcrumbs?: Breadcrumb[];
}

export function PageHeader({
  title,
  description,
  eyebrow,
  children,
  className,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <header className={cn("relative border-b border-[var(--color-border-subtle)] pb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-xs text-[var(--color-text-secondary)]">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
              {crumb.href ? (
                <Link href={crumb.href} className="font-medium transition-colors hover:text-[var(--color-brand-primary)]">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-[var(--color-text-primary)]">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
          <h1 className="heading-display text-[1.75rem] text-[var(--color-text-primary)] sm:text-[var(--text-display)]">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-[var(--text-body)] leading-relaxed text-[var(--color-text-secondary)]">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>
        )}
      </div>
    </header>
  );
}

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarDays, FileHeart, HeartPulse, MessageSquare } from "lucide-react";
import { getTransition, staggerContainer, listItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  contentClassName?: string;
  contentAlign?: "center" | "start";
  panelKey?: string;
  /** Rendered in the mobile top bar and desktop corner (e.g. theme toggle). */
  headerActions?: ReactNode;
}

const features = [
  {
    icon: CalendarDays,
    title: "Care on your calendar",
    description: "Book and manage your next appointment.",
  },
  {
    icon: FileHeart,
    title: "Your health, in one view",
    description: "Keep results, records, and prescriptions together.",
  },
  {
    icon: MessageSquare,
    title: "A connected care team",
    description: "A simpler way to stay in touch.",
  },
];

const COPY_SLOT_CLASS = "relative mt-5 h-[11.5rem] xl:h-[12.5rem]";

export function AuthLayout({
  children,
  title = "Your health.\nA little simpler.",
  subtitle = "One place for the people, information, and care that help you feel your best.",
  className,
  contentClassName,
  contentAlign = "center",
  panelKey = "default",
  headerActions,
}: AuthLayoutProps) {
  const reduced = useReducedMotion() ?? false;
  const transition = getTransition(reduced);

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[var(--color-surface-elevated)] lg:flex-row">
      <aside className="relative hidden w-full shrink-0 flex-col overflow-hidden bg-[#173c38] text-white lg:flex lg:min-h-dvh lg:w-[min(42%,640px)] xl:w-[min(44%,680px)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(181,217,191,0.14),transparent_55%)]" />

        <div className="relative z-10 flex min-h-dvh flex-col p-8 xl:p-14">
          <Link href="/" className="flex w-fit items-center gap-3" aria-label="HealthPortal home">
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/20">
              <HeartPulse className="size-5 text-[#d5e8c8]" aria-hidden />
            </span>
            <span className="text-xl font-semibold tracking-tight">
              HealthPortal<span className="text-[#b5d9bf]">.</span>
            </span>
          </Link>

          <div className="flex flex-1 flex-col justify-center py-10 xl:py-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#b5d9bf]">
              Care that feels connected
            </p>

            <div className={COPY_SLOT_CLASS}>
              <motion.div
                key={panelKey}
                className="absolute inset-x-0 top-0"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
              >
                <h2 className="whitespace-pre-line text-3xl font-medium leading-[1.12] tracking-[-0.04em] xl:text-5xl">
                  {title}
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/65 xl:mt-5">{subtitle}</p>
              </motion.div>
            </div>

            <motion.ul
              className="mt-10 max-w-sm divide-y divide-white/10 border-y border-white/10 xl:mt-12"
              variants={staggerContainer}
              initial={reduced ? "visible" : "hidden"}
              animate="visible"
            >
              {features.map(({ icon: Icon, title: featureTitle, description }) => (
                <motion.li
                  key={featureTitle}
                  className="flex gap-4 py-4 xl:py-5"
                  variants={listItem}
                  transition={transition}
                >
                  <Icon className="mt-1 size-5 shrink-0 text-[#b5d9bf]" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{featureTitle}</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <p className="text-[11px] text-white/45">
            © {new Date().getFullYear()} HealthPortal. Care, connected.
          </p>
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] bg-[#173c38] px-3 py-2.5 text-white sm:px-4 lg:hidden">
        <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="HealthPortal home">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/20">
            <HeartPulse className="size-4 text-[#d5e8c8]" aria-hidden />
          </span>
          <span className="truncate text-base font-semibold tracking-tight">
            HealthPortal<span className="text-[#b5d9bf]">.</span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-0.5 [&_button]:text-white/85 [&_button]:hover:bg-white/10 [&_button]:hover:text-white">
          {headerActions}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Home
          </Link>
        </div>
      </div>

      <main
        id="main-content"
        className={cn(
          "relative flex min-h-0 w-full min-w-0 flex-1 flex-col items-center overflow-hidden px-4 py-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10 md:px-10 lg:h-dvh lg:px-12 lg:py-14 xl:px-16",
          contentAlign === "center" ? "justify-center" : "justify-start lg:pt-14 xl:pt-16",
          className
        )}
      >
        <div className="absolute right-4 top-5 z-20 hidden lg:block xl:right-8">
          {headerActions}
        </div>

        <Link
          href="/"
          className="absolute left-4 top-5 hidden items-center gap-2 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-brand-primary)] lg:left-10 lg:inline-flex xl:left-12"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to home
        </Link>

        <div
          className={cn(
            "flex w-full min-h-0 min-w-0 max-w-[400px] flex-1 flex-col sm:max-w-[440px]",
            contentClassName
          )}
        >
          {children}
        </div>

        <p className="mt-4 shrink-0 px-2 text-center text-[11px] text-[var(--color-text-disabled)] sm:mt-6">
          Your space for better, more connected care.
        </p>
      </main>
    </div>
  );
}

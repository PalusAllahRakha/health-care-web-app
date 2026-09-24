"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarDays, FileHeart, HeartPulse, MessageSquare } from "lucide-react";
import { getTransition, staggerContainer, listItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  contentClassName?: string;
  /** Top-align content so tab height changes don't vertically recenter the form. */
  contentAlign?: "center" | "start";
  /** When this changes, left-panel copy crossfades. */
  panelKey?: string;
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

export function AuthLayout({
  children,
  title = "Your health.\nA little simpler.",
  subtitle = "One place for the people, information, and care that help you feel your best.",
  className,
  contentClassName,
  contentAlign = "center",
  panelKey = "default",
}: AuthLayoutProps) {
  const reduced = useReducedMotion() ?? false;
  const transition = getTransition(reduced);

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-elevated)]">
      <motion.aside
        className="relative hidden w-[44%] max-w-[680px] flex-col justify-between overflow-hidden bg-[#173c38] p-10 text-white lg:flex xl:p-14"
        initial={reduced ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...transition, duration: reduced ? 0.01 : 0.45 }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(181,217,191,0.14),transparent_55%)]"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition, delay: reduced ? 0 : 0.15 }}
        />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reduced ? 0 : 0.05 }}
        >
          <Link href="/" className="relative z-10 flex w-fit items-center gap-3" aria-label="HealthPortal home">
            <span className="flex size-10 items-center justify-center rounded-xl border border-white/20">
              <HeartPulse className="size-5 text-[#d5e8c8]" aria-hidden />
            </span>
            <span className="text-xl font-semibold tracking-tight">
              HealthPortal<span className="text-[#b5d9bf]">.</span>
            </span>
          </Link>
        </motion.div>

        <div className="relative z-10 py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#b5d9bf]">
            Care that feels connected
          </p>

          <div className="relative mt-5 min-h-[8.5rem]">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={panelKey}
                className="absolute inset-x-0 top-0"
                initial={reduced ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={transition}
              >
                <h2 className="whitespace-pre-line text-4xl font-medium leading-[1.12] tracking-[-0.04em] xl:text-5xl">
                  {title}
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">{subtitle}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.ul
            className="mt-12 max-w-sm divide-y divide-white/10 border-y border-white/10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {features.map(({ icon: Icon, title: featureTitle, description }) => (
              <motion.li
                key={featureTitle}
                className="flex gap-4 py-5"
                variants={listItem}
                transition={transition}
              >
                <Icon className="mt-1 size-5 shrink-0 text-[#b5d9bf]" aria-hidden />
                <div>
                  <p className="text-sm font-medium">{featureTitle}</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.p
          className="relative z-10 text-[11px] text-white/45"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition, delay: reduced ? 0 : 0.35 }}
        >
          © {new Date().getFullYear()} HealthPortal. Care, connected.
        </motion.p>
      </motion.aside>

      <main
        id="main-content"
        className={cn(
          "relative flex min-h-screen w-full flex-1 flex-col items-center px-5 py-24 sm:px-10 lg:px-16",
          contentAlign === "center" ? "justify-center" : "justify-start pt-28 sm:pt-32",
          className
        )}
      >
        <Link
          href="/"
          className="absolute left-5 top-7 inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-brand-primary)] sm:left-10 lg:left-12"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to home
        </Link>
        <Link
          href="/"
          className="mb-10 flex items-center gap-2.5 lg:hidden"
          aria-label="HealthPortal home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#173c38] text-white">
            <HeartPulse className="size-5" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight">HealthPortal.</span>
        </Link>
        <div className={cn("w-full max-w-[400px]", contentClassName)}>{children}</div>
        <p className="mt-10 text-center text-[11px] text-[var(--color-text-disabled)]">
          Your space for better, more connected care.
        </p>
      </main>
    </div>
  );
}

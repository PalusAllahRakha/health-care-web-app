import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, FileHeart, HeartPulse, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const features = [
  { icon: CalendarDays, title: "Care on your calendar", description: "Book and manage your next appointment." },
  { icon: FileHeart, title: "Your health, in one view", description: "Keep results, records, and prescriptions together." },
  { icon: MessageSquare, title: "A connected care team", description: "A simpler way to stay in touch." },
];

export function AuthLayout({
  children,
  title = "Your health.\nA little simpler.",
  subtitle = "One place for the people, information, and care that help you feel your best.",
  className,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface-elevated)]">
      <aside className="relative hidden w-[44%] max-w-[680px] flex-col justify-between bg-[#173c38] p-10 text-white lg:flex xl:p-14">
        <Link href="/" className="flex w-fit items-center gap-3" aria-label="HealthPortal home">
          <span className="flex size-10 items-center justify-center rounded-xl border border-white/20"><HeartPulse className="size-5 text-[#d5e8c8]" aria-hidden /></span>
          <span className="text-xl font-semibold tracking-tight">HealthPortal<span className="text-[#b5d9bf]">.</span></span>
        </Link>
        <div className="py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#b5d9bf]">Care that feels connected</p>
          <h2 className="mt-5 whitespace-pre-line text-4xl font-medium leading-[1.12] tracking-[-0.04em] xl:text-5xl">{title}</h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">{subtitle}</p>
          <ul className="mt-12 max-w-sm divide-y divide-white/10 border-y border-white/10">
            {features.map(({ icon: Icon, title: featureTitle, description }) => (
              <li key={featureTitle} className="flex gap-4 py-5">
                <Icon className="mt-1 size-5 shrink-0 text-[#b5d9bf]" aria-hidden />
                <div><p className="text-sm font-medium">{featureTitle}</p><p className="mt-1 text-xs leading-5 text-white/55">{description}</p></div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[11px] text-white/45">© {new Date().getFullYear()} HealthPortal. Care, connected.</p>
      </aside>
      <main id="main-content" className={cn("relative flex min-h-screen w-full flex-1 flex-col items-center justify-center px-5 py-24 sm:px-10 lg:px-16", className)}>
        <Link href="/" className="absolute left-5 top-7 inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-brand-primary)] sm:left-10 lg:left-12"><ArrowLeft className="size-3.5" aria-hidden /> Back to home</Link>
        <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden" aria-label="HealthPortal home"><span className="flex size-9 items-center justify-center rounded-xl bg-[#173c38] text-white"><HeartPulse className="size-5" aria-hidden /></span><span className="text-lg font-semibold tracking-tight">HealthPortal.</span></Link>
        <div className="w-full max-w-[400px]">{children}</div>
        <p className="mt-10 text-center text-[11px] text-[var(--color-text-disabled)]">Your space for better, more connected care.</p>
      </main>
    </div>
  );
}

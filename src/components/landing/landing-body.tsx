"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileHeart,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  Pill,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { FadeInView } from "@/components/motion/fade-in-view";
import { MotionGrid } from "@/components/motion/motion-grid";
import { Button } from "@/components/ui/button";

const features: { icon: LucideIcon; title: string; description: string; label: string }[] = [
  {
    icon: CalendarDays,
    title: "Make time for your health.",
    description: "Find the right provider, book your next visit, and keep track of what’s coming up.",
    label: "Appointments",
  },
  {
    icon: FileHeart,
    title: "A clearer picture of you.",
    description: "Keep your lab results, health records, and prescriptions together and easy to find.",
    label: "Health records",
  },
  {
    icon: MessageSquare,
    title: "Your care team, closer.",
    description: "Ask a question, follow up after a visit, and stay connected through secure messages.",
    label: "Connected care",
  },
];

function PortalPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] pb-8 pt-5 sm:px-3 lg:pt-0">
      <div className="absolute inset-x-6 bottom-0 top-12 rounded-[36px] bg-[#e5ece6] dark:bg-[#213d36]" aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] shadow-[0_20px_70px_-25px_rgba(23,60,56,0.24)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-5 py-4">
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <HeartPulse className="size-5 text-[var(--color-brand-primary)]" aria-hidden />
            HealthPortal
          </div>
          <span className="rounded-full border border-[var(--color-border-subtle)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)]">Portal preview</span>
        </div>
        <div className="flex">
          <div className="hidden w-14 shrink-0 flex-col items-center gap-5 border-r border-[var(--color-border-subtle)] py-6 text-[var(--color-text-disabled)] sm:flex" aria-hidden>
            <span className="rounded-lg bg-[var(--color-brand-primary)]/10 p-2 text-[var(--color-brand-primary)]"><LayoutDashboard className="size-4" /></span>
            <CalendarDays className="size-4" />
            <FileHeart className="size-4" />
            <MessageSquare className="size-4" />
            <Pill className="size-4" />
          </div>
          <div className="min-w-0 flex-1 p-5 sm:p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">YOUR HEALTH, AT A GLANCE</p>
            <p className="mt-2 text-[23px] font-semibold tracking-tight">A little more peace of mind.</p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Your care is coming together.</p>

            <div className="mt-5 rounded-xl bg-[#173c38] p-4 text-white">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/65">UPCOMING VISIT</span>
                <span className="flex items-center gap-1 text-[10px] text-[#c4e6ce]"><CheckCircle2 className="size-3" aria-hidden /> Confirmed</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10"><Stethoscope className="size-5 text-[#c7dec6]" aria-hidden /></div>
                <div>
                  <p className="text-sm font-semibold">Your annual checkup</p>
                  <p className="mt-0.5 text-xs text-white/65">Primary care · In-person visit</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-white/15 pt-3 text-[11px] text-white/85">
                <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden /> Thu, October 15</span>
                <span className="flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden /> 10:30 AM</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--color-border-subtle)] p-3.5">
                <FileHeart className="size-4 text-[var(--color-brand-primary)]" aria-hidden />
                <p className="mt-3 text-xs font-semibold">Lab results</p>
                <p className="mt-1 text-[10px] text-[var(--color-text-secondary)]">Ready when you are</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-[var(--color-brand-primary)]"><Check className="size-3" aria-hidden /> Up to date</div>
              </div>
              <div className="rounded-xl border border-[var(--color-border-subtle)] p-3.5">
                <MessageSquare className="size-4 text-[var(--color-brand-primary)]" aria-hidden />
                <p className="mt-3 text-xs font-semibold">Care messages</p>
                <p className="mt-1 text-[10px] text-[var(--color-text-secondary)]">A direct line to your team</p>
                <div className="mt-3 text-[10px] font-medium text-[var(--color-brand-primary)]">All in one place</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mx-5 -mt-1 flex items-center gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-4 py-3 shadow-[0_8px_30px_-12px_rgba(23,60,56,0.16)] sm:absolute sm:-bottom-1 sm:-left-3 sm:mx-0">
        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"><ShieldCheck className="size-4" aria-hidden /></span>
        <div><p className="text-xs font-semibold">A space for your health</p><p className="mt-0.5 text-[10px] text-[var(--color-text-secondary)]">Personal. Connected. Simple.</p></div>
      </div>
    </div>
  );
}

export function LandingBody() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5" aria-label="HealthPortal home">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#173c38] text-white"><HeartPulse className="size-5" aria-hidden /></span>
            <span className="text-lg font-semibold tracking-tight">HealthPortal<span className="text-[var(--color-brand-primary)]">.</span></span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-[var(--color-text-secondary)] md:flex" aria-label="Main navigation">
            <a href="#your-care" className="transition-colors hover:text-[var(--color-brand-primary)]">Your care, connected</a>
            <a href="#how-it-works" className="transition-colors hover:text-[var(--color-brand-primary)]">How it works</a>
          </nav>
          <Button asChild size="sm" className="rounded-lg px-4"><Link href="/login">Sign in <ArrowRight className="size-4" aria-hidden /></Link></Button>
        </div>
      </header>

      <main id="main-content">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.04fr] lg:gap-14 lg:px-12 lg:py-24">
          <FadeInView>
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-brand-primary)]"><span className="size-1.5 rounded-full bg-[var(--color-brand-primary)]" /> A healthier kind of connection</p>
            <h1 className="mt-7 text-[3.25rem] font-semibold leading-[1.06] tracking-[-0.055em] sm:text-[4rem] lg:text-[4.5rem]">Your health.<br />Your people.<br /><span className="text-[var(--color-brand-primary)]">One place.</span></h1>
            <p className="mt-6 max-w-[420px] text-base leading-7 text-[var(--color-text-secondary)]">Life is busy. Looking after your health should feel simpler. Connect with your care team and take your next step with confidence.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-xl px-6 text-sm"><Link href="/login">Access your portal <ArrowRight className="size-4" aria-hidden /></Link></Button>
              <a href="#your-care" className="inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-brand-primary)]">Explore your care <ChevronRight className="size-4" aria-hidden /></a>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"><ShieldCheck className="size-4 text-[var(--color-brand-primary)]" aria-hidden /> Your health information, at your fingertips.</div>
          </FadeInView>
          <FadeInView delay={0.1}><PortalPreview /></FadeInView>
        </section>

        <section className="border-y border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">Less admin. More living.</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 lg:gap-12">
              {[{ icon: CalendarDays, label: "Appointments" }, { icon: FileHeart, label: "Health records" }, { icon: Pill, label: "Prescriptions" }, { icon: MessageSquare, label: "Care messages" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm font-medium"><Icon className="size-4 text-[var(--color-brand-primary)]" aria-hidden />{label}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="your-care" className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <FadeInView className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-brand-primary)]">Built around you</p><h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">A little less to manage.<br />A lot more peace of mind.</h2></div>
            <p className="max-w-xs text-sm leading-6 text-[var(--color-text-secondary)]">From your first question to your next appointment, keep every part of your care connected.</p>
          </FadeInView>
          <MotionGrid className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, label }, index) => (
              <article key={title} className="flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 lg:p-8">
                <div className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-xl bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]"><Icon className="size-5" aria-hidden /></span><span className="text-xs text-[var(--color-text-disabled)]">0{index + 1}</span></div>
                <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.13em] text-[var(--color-text-secondary)]">{label}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
              </article>
            ))}
          </MotionGrid>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
          <div className="grid gap-10 rounded-3xl bg-[#173c38] p-7 text-white sm:p-10 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:p-14">
            <FadeInView>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#b5d9bf]">Your next step starts here</p>
              <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Good care.<br />A simpler way to get there.</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">Your portal brings the details together, so you can focus on feeling your best.</p>
              <Button asChild size="lg" className="mt-7 rounded-xl bg-[#d5e8c8] text-[#173c38] hover:bg-[#e1efd7]"><Link href="/login">Let’s get you connected <ArrowRight className="size-4" aria-hidden /></Link></Button>
            </FadeInView>
            <ol className="space-y-6 self-center">
              {[{ title: "Sign in to your portal", description: "One secure account for your health information." }, { title: "Find everything in one view", description: "See upcoming visits, results, and messages." }, { title: "Take care of what’s next", description: "Book a visit or get in touch with your care team." }].map(({ title, description }, index) => (
                <li key={title} className="flex gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-xs text-[#d5e8c8]">{index + 1}</span><div className="pt-1"><h3 className="text-sm font-medium">{title}</h3><p className="mt-1 text-xs leading-5 text-white/65">{description}</p></div></li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <footer className="border-t border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-xs text-[var(--color-text-secondary)] sm:flex-row sm:px-8 lg:px-12">
          <span className="flex items-center gap-2 font-semibold text-[var(--color-text-primary)]"><HeartPulse className="size-4 text-[var(--color-brand-primary)]" aria-hidden />HealthPortal</span>
          <p>© {new Date().getFullYear()} HealthPortal. Care, connected.</p>
          <Link href="/login" className="transition-colors hover:text-[var(--color-brand-primary)]">Access your portal <span aria-hidden>↗</span></Link>
        </div>
      </footer>
    </div>
  );
}

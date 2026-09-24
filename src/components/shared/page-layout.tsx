"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, getTransition, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  const reduced = useReducedMotion() ?? false;
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <motion.div
      className={cn("space-y-[var(--space-section)]", className)}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      transition={getTransition(reduced)}
    >
      {items.map((child, index) => (
        <motion.div key={child.key ?? `section-${index}`} variants={fadeUp}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

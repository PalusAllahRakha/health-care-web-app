"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FadeInViewProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInView({ children, className, delay = 0 }: FadeInViewProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...getTransition(reduced), delay }}
    >
      {children}
    </motion.div>
  );
}

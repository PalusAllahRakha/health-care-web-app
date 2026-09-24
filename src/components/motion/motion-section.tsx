"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, getTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ ...getTransition(reduced), delay }}
    >
      {children}
    </motion.div>
  );
}

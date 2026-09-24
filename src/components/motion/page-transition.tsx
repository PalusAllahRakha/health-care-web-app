"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { pageEnter, getTransition } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      transition={getTransition(reduced)}
    >
      {children}
    </motion.div>
  );
}

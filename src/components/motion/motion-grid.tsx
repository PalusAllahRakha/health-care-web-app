"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, getTransition, staggerFast, hoverLift } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface MotionGridProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function MotionGrid({ children, className, hover = true }: MotionGridProps) {
  const reduced = useReducedMotion() ?? false;
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <motion.div
      className={className}
      variants={staggerFast}
      initial="hidden"
      animate="visible"
      transition={getTransition(reduced)}
    >
      {items.map((child, index) => (
        <motion.div
          key={child.key ?? `grid-${index}`}
          variants={fadeUp}
          whileHover={hover && !reduced ? hoverLift : undefined}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

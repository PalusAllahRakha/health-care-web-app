"use client";

import { type ComponentProps, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, getTransition, staggerFast } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MotionListProps extends ComponentProps<typeof motion.ul> {
  children: ReactNode;
  className?: string;
}

export function MotionList({ children, className, ...props }: MotionListProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.ul
      className={cn(className)}
      variants={staggerFast}
      initial="hidden"
      animate="visible"
      transition={getTransition(reduced)}
      {...props}
    >
      {children}
    </motion.ul>
  );
}

export function MotionListItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.li className={className} variants={fadeUp}>
      {children}
    </motion.li>
  );
}

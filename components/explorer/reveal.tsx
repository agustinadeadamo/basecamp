"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The single, purposeful motion beat: a calm ~250ms fade-and-rise used only for
 * the score and its reasoning, on load and (via a changing `key`) when the
 * profile changes. Honors prefers-reduced-motion by rendering statically.
 */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  // A plain wrapper (not a fragment) keeps layout identical with motion off.
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index, 6) * 0.03,
      }}
    >
      {children}
    </motion.div>
  );
}

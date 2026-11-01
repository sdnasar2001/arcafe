"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Fragment, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ children, delay = 0, y = 28, className, as = "div" }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "p" | "li" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

const wordsParent: Variants = { show: { transition: { staggerChildren: 0.06 } } };
const word: Variants = {
  hide: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.1, ease: EASE } },
};

/** A heading whose words rise one by one from behind a mask. */
export function SplitHeading({ text, className, as = "h2" }: { text: string; className?: string; as?: "h1" | "h2" | "h3" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M className={className} variants={wordsParent} initial={reduce ? false : "hide"} whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }} aria-label={text}>
      {text.split(" ").map((w, i, all) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="inline-block" variants={word}>
              {w}
            </motion.span>
          </span>
          {i < all.length - 1 ? " " : null}
        </Fragment>
      ))}
    </M>
  );
}

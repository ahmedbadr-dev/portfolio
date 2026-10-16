/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

type RevealProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

/** Soft section/header entrance on scroll */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 36,
  once = true,
  className,
  ...rest
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, amount: 0.2, margin: '0px 0px -8% 0px' }}
    transition={{ duration: 0.7, delay, ease }}
    {...rest}
  >
    {children}
  </motion.div>
);

type FloatingCardProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  index?: number;
  className?: string;
  once?: boolean;
};

/** Card that floats up into place with staggered delay */
export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  index = 0,
  className,
  once = true,
  ...rest
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 48, scale: 0.97 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once, amount: 0.15, margin: '0px 0px -6% 0px' }}
    transition={{
      duration: 0.65,
      delay: Math.min(index * 0.08, 0.4),
      ease,
    }}
    {...rest}
  >
    {children}
  </motion.div>
);

type SectionShellProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

/** Section wrapper with a subtle fade/slide as it enters the viewport */
export const SectionShell: React.FC<SectionShellProps> = ({ id, className, children }) => (
  <motion.section
    id={id}
    className={className}
    initial={{ opacity: 0.35 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: false, amount: 0.12 }}
    transition={{ duration: 0.55, ease }}
  >
    {children}
  </motion.section>
);

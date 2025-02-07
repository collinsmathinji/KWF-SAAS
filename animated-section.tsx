"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import React from 'react'; // Import React

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedSection({ children, className }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [100, 0, 0, -100])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

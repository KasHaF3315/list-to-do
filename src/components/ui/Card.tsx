'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6 shadow-sm',
          hover && 'hover:shadow-md transition-shadow duration-200',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...(props as any)}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export default Card

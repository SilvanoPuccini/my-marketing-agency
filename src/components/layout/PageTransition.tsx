import { motion, type Variants } from 'framer-motion'

const variants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.12, ease: 'easeIn' as const } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  )
}

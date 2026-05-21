import { motion } from 'framer-motion'

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center justify-between px-6 py-5 border-b border-gold-400/06"
    >
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div className="relative w-11 h-11 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-gold-400/20" />
          <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-gold-500/15 to-transparent" />
          <span className="relative font-display text-base font-semibold text-gold-300">S</span>
        </div>

        <div>
          <h1 className="font-display text-lg sm:text-2xl font-bold leading-tight">
            <span className="gold-gradient">Sharwari Muley</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-400 font-mono mt-0.5">
            BTech. student from IIT Kharagpur
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-light">
          <div className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-pulse" />
          <span className="text-[10px] font-mono text-sage-400 uppercase tracking-wider">Live</span>
        </div>
      </div>
    </motion.header>
  )
}

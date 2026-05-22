import { motion, AnimatePresence } from 'framer-motion'

export function StatusBar({ status, transcript, error }) {
  const configs = {
    idle: null,
    listening: {
      color: 'text-gold-400',
      dot: 'bg-gold-400',
      label: 'Listening…',
      sub: transcript || 'Speak your question',
    },
    loading: {
      color: 'text-ink-300',
      dot: 'bg-ink-400',
      label: 'Thinking…',
      sub: 'Sharwari is composing a response',
    },
    speaking: {
      color: 'text-sage-400',
      dot: 'bg-sage-400',
      label: 'Speaking…',
      sub: 'Click mic or wait for her to finish',
    },
    error: {
      color: 'text-red-400',
      dot: 'bg-red-400',
      label: 'Something went wrong',
      sub: error || 'Please try again',
    },
  }

  const config = configs[status]

  return (
    <div className={`flex items-center justify-center transition-all duration-300 ${config ? 'h-7 sm:h-10' : 'h-0 overflow-hidden'}`}>
      <AnimatePresence mode="wait">
        {config && (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
            <span className={`text-xs font-mono ${config.color}`}>{config.label}</span>
            {config.sub && (
              <>
                <span className="text-ink-600 text-xs">·</span>
                <span className="text-xs text-ink-500 truncate max-w-[180px] sm:max-w-xs">
                  {config.sub}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

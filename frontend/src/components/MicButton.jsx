import { motion, AnimatePresence } from 'framer-motion'

export function MicButton({ isListening, isSpeaking, isLoading, onClick, disabled }) {
  const getState = () => {
    if (isLoading) return 'loading'
    if (isSpeaking) return 'speaking'
    if (isListening) return 'listening'
    return 'idle'
  }

  const state = getState()

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse rings */}
      <AnimatePresence>
        {(isListening || isSpeaking) && (
          <>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`absolute inset-0 rounded-full border ${
                  isListening ? 'border-gold-400/20' : 'border-sage-400/20'
                }`}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{
                  scale: 1 + i * 0.35,
                  opacity: 0,
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={onClick}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
        className={`
          relative w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
          transition-all duration-500 cursor-pointer select-none
          disabled:cursor-not-allowed disabled:opacity-50
          ${state === 'listening' ? 'mic-glow-active bg-gold-500/20 border border-gold-400/40' : ''}
          ${state === 'speaking' ? 'speaking-glow bg-sage-500/20 border border-sage-400/40' : ''}
          ${state === 'idle' ? 'mic-glow bg-ink-800/80 border border-gold-400/15 hover:border-gold-400/30' : ''}
          ${state === 'loading' ? 'bg-ink-800/80 border border-ink-600/30' : ''}
        `}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {/* Inner icon */}
        <AnimatePresence mode="wait">
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex gap-1"
            >
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-ink-300 typing-dot"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </motion.div>
          )}

          {state === 'listening' && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-end gap-0.5 h-5 sm:h-7"
            >
              {[0.7, 1, 0.6, 0.9, 0.5].map((h, i) => (
                <div
                  key={i}
                  className="soundbar w-0.5 sm:w-1 rounded-full bg-gold-400"
                  style={{
                    height: `${h * 100}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </motion.div>
          )}

          {state === 'speaking' && (
            <motion.div
              key="speaking"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-end gap-0.5 h-5 sm:h-7"
            >
              {[0.5, 0.9, 1, 0.7, 0.6].map((h, i) => (
                <div
                  key={i}
                  className="soundbar w-0.5 sm:w-1 rounded-full bg-sage-400"
                  style={{
                    height: `${h * 100}%`,
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              ))}
            </motion.div>
          )}

          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center"
            >
              <svg className="text-gold-400 w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
                <path d="M5 10a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

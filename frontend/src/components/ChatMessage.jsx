import { motion } from 'framer-motion'

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function ChatMessage({ message, isLatest, isLive }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-gold-500/20 to-sage-500/20 border border-gold-400/15 text-xs font-display font-semibold text-gold-300 mb-5">
          S
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Role label */}
        <span className="text-xs uppercase tracking-widest text-ink-400 font-mono px-1">
          {isUser ? (isLive ? 'Speaking…' : 'You') : 'Sharwari'}
        </span>

        {/* Bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl text-base leading-relaxed relative
            ${isUser
              ? 'message-user text-ink-100 rounded-br-sm'
              : 'message-ai text-ink-200 rounded-bl-sm'
            }
            ${isLive ? 'border border-dashed border-gold-400/40 opacity-80' : ''}
          `}
        >
          {message.content}
          {isLive && (
            <span className="inline-flex ml-1.5 items-center gap-0.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            </span>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-ink-500 px-1 font-mono">
          {isLive ? 'Real-time' : formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  )
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="flex items-end gap-3"
    >
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-gold-500/20 to-sage-500/20 border border-gold-400/15 text-xs font-display font-semibold text-gold-300">
        S
      </div>
      <div className="flex flex-col gap-1 items-start">
        <span className="text-xs uppercase tracking-widest text-ink-400 font-mono px-1">
          Sharwari
        </span>
        <div className="message-ai px-4 py-3.5 rounded-2xl rounded-bl-sm">
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="typing-dot w-1.5 h-1.5 rounded-full bg-gold-400/60"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

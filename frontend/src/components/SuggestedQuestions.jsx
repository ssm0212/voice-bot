import { motion } from 'framer-motion'

const QUESTIONS = [
  { text: 'Tell me about your lifestory in few sentences', icon: '✦' },
  { text: "What's your biggest strength?", icon: '◈' },
  { text: 'What is your biggest weakness?', icon: '◎' },
  { text: 'What are your 3 weaknesses?', icon: '◉' },
  { text: 'Why AI & Machine Learning?', icon: '⬡' },
  { text: 'Why should we hire you?', icon: '★' },
  { text: 'Tell me about your Vedanta PPO', icon: '◇' },
  { text: 'Did you accept the Vedanta offer?', icon: '◆' },
  { text: 'One interesting fact about you', icon: '✧' },
  { text: 'Tell me about your thesis', icon: '△' },
  { text: 'How do you push boundaries?', icon: '⬢' },
]

export function SuggestedQuestions({ onSelect, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full animate-fade-in"
    >
      <div className="flex items-center justify-between mb-1 sm:mb-2 px-1">
        <span className="text-[10px] uppercase tracking-widest text-ink-400 font-mono">
          Suggested Questions
        </span>
        <span className="text-[9px] text-ink-500 font-mono sm:hidden">Swipe →</span>
      </div>
      <div className="flex overflow-x-auto gap-1.5 sm:gap-2 pb-1.5 sm:pb-2 pt-0.5 -mx-1 px-1 scroll-smooth snap-x">
        {QUESTIONS.map((q, i) => (
          <motion.button
            key={q.text}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
            onClick={() => !disabled && onSelect(q.text)}
            disabled={disabled}
            className="question-card flex-shrink-0 snap-start rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <span className="text-gold-400/60 text-sm mr-1.5 font-mono">{q.icon}</span>
            <span className="text-sm text-ink-200">{q.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

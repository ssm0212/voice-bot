import { useState } from 'react'
import { motion } from 'framer-motion'

export function TextInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = value.trim()
    if (!text || disabled) return
    onSubmit(text)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Or type your question here…"
        className="
          flex-1 bg-ink-800/50 border border-ink-600/30 rounded-xl
          px-4 py-2.5 text-base text-ink-200 placeholder:text-ink-600
          focus:outline-none focus:border-gold-400/25 focus:bg-ink-800/70
          transition-all duration-200 font-body disabled:opacity-50
        "
      />
      <motion.button
        type="submit"
        disabled={disabled || !value.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="
          px-4 py-2.5 rounded-xl bg-gold-500/15 border border-gold-400/20
          text-gold-300 text-xs font-mono uppercase tracking-wider
          hover:bg-gold-500/25 hover:border-gold-400/35
          transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
          whitespace-nowrap
        "
      >
        Send
      </motion.button>
    </form>
  )
}

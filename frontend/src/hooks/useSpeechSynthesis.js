import { useState, useRef, useCallback } from 'react'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const startSpeaking = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      const voices = window.speechSynthesis.getVoices()

      // Priority order — Prioritize Indian English voices (Approach A)
      const female = voices.find(v => v.name.includes('Google India'))
        || voices.find(v => v.name === 'Microsoft Heera - English (India)')
        || voices.find(v => v.name.includes('Microsoft Heera'))
        || voices.find(v => v.lang === 'en-IN')
        || voices.find(v => v.lang.startsWith('en_IN'))
        || voices.find(v => v.name.toLowerCase().includes('india') && v.lang.startsWith('en'))
        // Fallbacks
        || voices.find(v => v.name === 'Google UK English Female')
        || voices.find(v => v.name === 'Microsoft Zira - English (United States)')
        || voices.find(v => v.name.includes('Samantha'))
        || voices.find(v => v.name.toLowerCase().includes('female') && v.lang.startsWith('en'))
        || voices.find(v => v.lang.startsWith('en'))

      if (female) utterance.voice = female

      utterance.rate = 1.15
      utterance.pitch = 1.2
      utterance.volume = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    }

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      startSpeaking()
    } else {
      // Wait for voices to load, then speak
      window.speechSynthesis.onvoiceschanged = () => {
        startSpeaking()
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return { isSpeaking, speak, stopSpeaking }
}
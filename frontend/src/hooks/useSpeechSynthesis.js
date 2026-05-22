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

      // Priority order — Prioritize smooth Indian English voices (including Microsoft Natural Online voices)
      const female = voices.find(v => v.name.toLowerCase().includes('natural') && (v.lang === 'en-IN' || v.lang.startsWith('en_IN') || v.name.toLowerCase().includes('india')))
        || voices.find(v => v.name.toLowerCase().includes('neerja'))
        || voices.find(v => v.name.toLowerCase().includes('raveena'))
        || voices.find(v => v.name.includes('Google India'))
        || voices.find(v => v.name === 'Microsoft Heera - English (India)')
        || voices.find(v => v.name.includes('Microsoft Heera'))
        || voices.find(v => v.lang === 'en-IN')
        || voices.find(v => v.lang.startsWith('en_IN'))
        || voices.find(v => v.name.toLowerCase().includes('india') && v.lang.startsWith('en'))
        // Smooth fallbacks (English Natural voices)
        || voices.find(v => v.name.toLowerCase().includes('natural') && v.lang.startsWith('en'))
        || voices.find(v => v.name === 'Google UK English Female')
        || voices.find(v => v.name === 'Microsoft Zira - English (United States)')
        || voices.find(v => v.name.includes('Samantha'))
        || voices.find(v => v.name.toLowerCase().includes('female') && v.lang.startsWith('en'))
        || voices.find(v => v.lang.startsWith('en'))

      if (female) utterance.voice = female

      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      utterance.rate = isMobile ? 1.15 : 1.25
      utterance.pitch = 1.1
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
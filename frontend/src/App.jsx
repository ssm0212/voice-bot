import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'
import { sendMessage, transcribeAudio } from './utils/api'
import { Header } from './components/Header'
import { AudioVisualizer } from './components/AudioVisualizer'
import { MicButton } from './components/MicButton'
import { ChatMessage, TypingIndicator } from './components/ChatMessage'
import { SuggestedQuestions } from './components/SuggestedQuestions'
import { StatusBar } from './components/StatusBar'
import { TextInput } from './components/TextInput'

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col items-center justify-center h-full text-center px-6 pb-4"
    >
      {/* Decorative ring */}
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-4 rounded-full border border-dashed border-gold-400/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-8 rounded-full border border-dashed border-gold-400/05"
        />

        <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-gold-500/10 to-sage-500/05 border border-gold-400/15">
          <span className="font-display text-3xl font-light text-gold-300/80">S</span>
        </div>
      </div>

      <h2 className="font-display text-2xl sm:text-3xl font-light text-ink-100 mb-2">
        Hello, I'm{' '}
        <span className="shimmer-text font-semibold">Sharwari</span>
      </h2>

      <p className="text-base text-ink-400 max-w-xs leading-relaxed font-body">
        Ask me anything — about my background, projects, or what drives me in AI and ML.
      </p>

      <div className="flex items-center gap-4 mt-6 text-xs font-mono text-ink-600 uppercase tracking-wider">
        <span>IIT Kharagpur</span>
        <span className="text-gold-400/30">·</span>
        <span>AI Engineer</span>
        <span className="text-gold-400/30">·</span>
        <span>Class of '26</span>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Sharwari, feel free to ask me anything!",
      timestamp: new Date(),
    }
  ])
  const [status, setStatus] = useState('idle') // idle | listening | loading | speaking | error
  const [error, setError] = useState(null)
  const chatEndRef = useRef(null)
  const isProcessingRef = useRef(false)
  const welcomeSpokenRef = useRef(false)

  const { isListening, transcript, isSupported, error: recognitionError, startListening, stopListening } = useSpeechRecognition()
  const { isSpeaking, speak, stopSpeaking } = useSpeechSynthesis()

  // Auto-speak welcome message on first load or user interaction
  useEffect(() => {
    const handleVoiceGreeting = () => {
      if (welcomeSpokenRef.current) return
      
      try {
        speak("Hi! I'm Sharwari, feel free to ask me anything!")
        welcomeSpokenRef.current = true
        // Remove event listeners
        document.removeEventListener('click', handleVoiceGreeting)
        document.removeEventListener('touchstart', handleVoiceGreeting)
      } catch (err) {
        console.warn('Auto-speak greeting failed/blocked:', err)
      }
    }

    const timer = setTimeout(() => {
      handleVoiceGreeting()
    }, 800)

    document.addEventListener('click', handleVoiceGreeting)
    document.addEventListener('touchstart', handleVoiceGreeting)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleVoiceGreeting)
      document.removeEventListener('touchstart', handleVoiceGreeting)
    }
  }, [speak])

  // Sync status with speech states
  useEffect(() => {
    if (isSpeaking) {
      setStatus('speaking')
    } else if (isListening) {
      setStatus('listening')
    } else {
      setStatus(prev => (prev === 'speaking' || prev === 'listening' ? 'idle' : prev))
    }
  }, [isSpeaking, isListening])

  // Handle speech recognition errors
  useEffect(() => {
    if (recognitionError) {
      if (recognitionError === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access.')
      } else if (recognitionError === 'no-speech') {
        setError('No speech detected. Please speak clearly.')
      } else {
        setError(`Speech recognition error: ${recognitionError}`)
      }
      setStatus('error')
      const timer = setTimeout(() => {
        setStatus('idle')
        setError(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [recognitionError])

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, status])

  const handleSend = useCallback(async (text) => {
    if (!text.trim() || isProcessingRef.current) return
    isProcessingRef.current = true

    // Stop speaking if AI is mid-sentence
    stopSpeaking()

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setStatus('loading')
    setError(null)

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }))
      const data = await sendMessage(text.trim(), history)

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
      setStatus('speaking')
      speak(data.response)
    } catch (err) {
      setError(err.message)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    } finally {
      isProcessingRef.current = false
    }
  }, [messages, speak, stopSpeaking])

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening()
      return
    }

    if (isSpeaking) {
      stopSpeaking()
      return
    }

    if (status === 'loading') return

    startListening(async (textFallback, audioBlob) => {
      if (audioBlob) {
        setStatus('loading')
        try {
          const whisperTranscript = await transcribeAudio(audioBlob)
          if (whisperTranscript && whisperTranscript.trim()) {
            handleSend(whisperTranscript)
            return
          }
        } catch (e) {
          console.error("Whisper transcription failed, falling back to local speech recognition:", e)
        }
      }

      if (textFallback) {
        handleSend(textFallback)
      } else {
        setStatus('idle')
      }
    })
  }, [isListening, isSpeaking, status, startListening, stopListening, stopSpeaking, handleSend])

  const handleDownloadTranscript = useCallback(() => {
    const chatHistory = messages.filter(m => m.id !== 'welcome')
    if (chatHistory.length === 0) return

    let text = `==================================================\n`
    text += `INTERVIEW TRANSCRIPT: SHARWARI MULEY BOT\n`
    text += `Candidate: Sharwari Muley (BTech. student, IIT Kharagpur)\n`
    text += `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`
    text += `==================================================\n\n`

    chatHistory.forEach((msg) => {
      const role = msg.role === 'user' ? 'Interviewer' : 'Sharwari'
      text += `[${new Date(msg.timestamp).toLocaleTimeString()}] ${role}:\n`
      text += `${msg.content}\n\n`
    })

    text += `==================================================\n`
    text += `End of Transcript\n`

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Sharwari_Interview_Transcript_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [messages])

  const handleClear = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm Sharwari, feel free to ask me anything!",
        timestamp: new Date(),
      }
    ])
    stopSpeaking()
    setStatus('idle')
    setError(null)
  }, [stopSpeaking])

  const isDisabled = status === 'loading'
  const showEmpty = messages.length === 1 && status === 'idle' // showEmpty if only welcome message is present

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Header />

      {/* Main layout */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-4 min-h-full flex flex-col justify-end">
            <div key="chat" className="flex flex-col gap-4 pb-2 w-full">
              {messages.map((msg, i) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isLatest={i === messages.length - 1}
                />
              ))}

              {/* Real-time speech transcript bubble */}
              {isListening && transcript && (
                <ChatMessage
                  key="live-transcript"
                  message={{
                    id: 'live',
                    role: 'user',
                    content: transcript,
                    timestamp: new Date()
                  }}
                  isLatest={true}
                  isLive={true}
                />
              )}

              <AnimatePresence>
                {status === 'loading' && (
                  <TypingIndicator key="typing" />
                )}
              </AnimatePresence>
            </div>
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Bottom control panel */}
        <div className="border-t border-gold-400/06 glass">
          <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-3">

            {/* Suggested questions — always visible */}
            <SuggestedQuestions onSelect={handleSend} disabled={isDisabled} />

            {/* Audio Waveform Visualizer */}
            <AudioVisualizer status={status === 'idle' && error ? 'error' : status} />

            {/* Status bar */}
            <StatusBar
              status={status === 'idle' && error ? 'error' : status}
              transcript={transcript}
              error={error}
            />

            {/* Center mic + text input row */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-4">
              <div className="w-full sm:flex-1 flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <TextInput onSubmit={handleSend} disabled={isDisabled} />
                </div>
                {messages.length > 1 && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleDownloadTranscript}
                      className="
                        w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20
                        text-cyan-400 text-xs font-mono uppercase tracking-wider
                        hover:bg-cyan-500/20 hover:border-cyan-500/30
                        transition-all duration-200 cursor-pointer
                        flex items-center justify-center whitespace-nowrap
                      "
                    >
                      Download Transcript
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleClear}
                      className="
                        w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20
                        text-red-400 text-xs font-mono uppercase tracking-wider
                        hover:bg-red-500/20 hover:border-red-500/30
                        transition-all duration-200 cursor-pointer
                        flex items-center justify-center whitespace-nowrap
                      "
                    >
                      Clear Chat
                    </motion.button>
                  </>
                )}
              </div>
              <MicButton
                isListening={isListening}
                isSpeaking={isSpeaking}
                isLoading={status === 'loading'}
                onClick={handleMicClick}
                disabled={isDisabled && !isListening && !isSpeaking}
              />
            </div>

            {/* Mic instructions hint */}
            {isSupported ? (
              <p className="text-[11px] text-ink-400 text-center font-mono animate-pulse">
                Click the microphone icon to talk, or type your question below.
              </p>
            ) : (
              <p className="text-[11px] text-ink-500 text-center font-mono">
                Voice input not supported in this browser. Try Chrome or Edge.
              </p>
            )}

            {/* Credit */}
            <p className="text-center text-[10px] text-ink-700 font-mono">
              AI Interview Bot · Built with Gemini · IIT Kharagpur
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

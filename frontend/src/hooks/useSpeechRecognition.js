import { useState, useEffect, useRef, useCallback } from 'react'

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState(null)
  
  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')
  const silenceTimerRef = useRef(null)
  const maxDurationTimerRef = useRef(null)
  const onCompleteRef = useRef(null)
  
  // Media recording refs
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const mediaStreamRef = useRef(null)

  const finishSpeech = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    if (maxDurationTimerRef.current) clearTimeout(maxDurationTimerRef.current)
    
    // Stop Web Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
    }
    
    // Stop MediaRecorder first — this triggers onstop where onComplete is called
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch (e) {
        console.error('Error stopping MediaRecorder:', e)
      }
    } else {
      // Fallback if mediaRecorder was never started or inactive
      const textToSubmit = transcriptRef.current.trim()
      if (textToSubmit && onCompleteRef.current) {
        onCompleteRef.current(textToSubmit, null)
        onCompleteRef.current = null
      }
    }
    
    setIsListening(false)
  }, [])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-IN'

      recognition.onresult = (event) => {
        let currentText = ''
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' '
        }
        currentText = currentText.trim()
        
        setTranscript(currentText)
        transcriptRef.current = currentText

        // Reset silence timer — auto-submit after 2.5s of no speaking
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = setTimeout(() => {
          finishSpeech()
        }, 2500)
      }

      recognition.onend = () => {
        // We let MediaRecorder.onstop handle the submission, so we do nothing here
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        if (maxDurationTimerRef.current) clearTimeout(maxDurationTimerRef.current)
      }

      recognition.onerror = (event) => {
        if (event.error === 'aborted') {
          return
        }
        console.error('Speech recognition error:', event.error)
        setError(event.error)
        finishSpeech()
      }

      recognitionRef.current = recognition
    } else {
      // If Web Speech API is not supported, we can still use MediaRecorder
      setIsSupported(true)
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      if (maxDurationTimerRef.current) clearTimeout(maxDurationTimerRef.current)
    }
  }, [finishSpeech])

  const startListening = useCallback(async (onComplete) => {
    onCompleteRef.current = onComplete
    setTranscript('')
    transcriptRef.current = ''
    setError(null)
    audioChunksRef.current = []

    try {
      // 1. Get audio stream and start MediaRecorder
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const textFallback = transcriptRef.current.trim()
        
        if (onCompleteRef.current) {
          onCompleteRef.current(textFallback, audioBlob)
          onCompleteRef.current = null
        }
        
        // Stop stream tracks to turn off mic light
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop())
          mediaStreamRef.current = null
        }
      }

      mediaRecorder.start()
      setIsListening(true)

      // 2. Start Web Speech Recognition in parallel (if supported) for real-time preview
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (e) {
          console.warn('SpeechRecognition start error:', e)
        }
      }

      // Hard caps and silence timers
      if (maxDurationTimerRef.current) clearTimeout(maxDurationTimerRef.current)
      maxDurationTimerRef.current = setTimeout(() => {
        finishSpeech()
      }, 30000)

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        finishSpeech()
      }, 6000)

    } catch (e) {
      console.error('Failed to access microphone or start recording:', e)
      setError('not-allowed')
      setIsListening(false)
    }
  }, [finishSpeech])

  const stopListening = useCallback(() => {
    finishSpeech()
  }, [finishSpeech])

  return { isListening, transcript, isSupported, error, startListening, stopListening }
}

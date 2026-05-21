const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function sendMessage(message, history = []) {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history: history.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }))
    throw new Error(error.detail || 'Failed to get response')
  }

  return response.json()
}

export async function checkHealth() {
  const response = await fetch(`${API_URL}/health`)
  return response.ok
}

export async function transcribeAudio(audioBlob) {
  const formData = new FormData()
  // Whisper API accepts webm or other audio files.
  formData.append('file', audioBlob, 'audio.webm')

  const response = await fetch(`${API_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Transcription failed' }))
    throw new Error(error.detail || 'Failed to transcribe audio')
  }

  const data = await response.json()
  return data.text
}


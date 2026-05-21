import { useEffect, useRef } from 'react'

export function AudioVisualizer({ status }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const phaseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = (canvas.width = canvas.parentElement.clientWidth || 400)
    let height = (canvas.height = 40)

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth
        height = canvas.height = 40
      }
    }
    window.addEventListener('resize', handleResize)

    const draw = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      phaseRef.current += 0.05

      // Target amplitudes and speeds based on status
      let targetAmplitude = 0
      let targetSpeed = 0.02
      let colorGradient = null

      if (status === 'listening') {
        targetAmplitude = 12
        targetSpeed = 0.08
        // Electric Cyan/Teal gradient
        colorGradient = ctx.createLinearGradient(0, 0, width, 0)
        colorGradient.addColorStop(0, 'rgba(0, 245, 255, 0.05)')
        colorGradient.addColorStop(0.5, 'rgba(0, 245, 255, 0.8)')
        colorGradient.addColorStop(1, 'rgba(0, 245, 255, 0.05)')
      } else if (status === 'speaking') {
        targetAmplitude = 15
        targetSpeed = 0.12
        // Sunset Coral/Gold gradient
        colorGradient = ctx.createLinearGradient(0, 0, width, 0)
        colorGradient.addColorStop(0, 'rgba(255, 87, 68, 0.05)')
        colorGradient.addColorStop(0.5, 'rgba(255, 87, 68, 0.8)')
        colorGradient.addColorStop(1, 'rgba(255, 87, 68, 0.05)')
      } else if (status === 'loading') {
        targetAmplitude = 5
        targetSpeed = 0.04
        // Mild Teal/Cyan gradient
        colorGradient = ctx.createLinearGradient(0, 0, width, 0)
        colorGradient.addColorStop(0, 'rgba(0, 245, 255, 0.02)')
        colorGradient.addColorStop(0.5, 'rgba(0, 245, 255, 0.4)')
        colorGradient.addColorStop(1, 'rgba(0, 245, 255, 0.02)')
      } else if (status === 'error') {
        targetAmplitude = 8
        targetSpeed = 0.15
        // Red error gradient
        colorGradient = ctx.createLinearGradient(0, 0, width, 0)
        colorGradient.addColorStop(0, 'rgba(239, 68, 68, 0.05)')
        colorGradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.7)')
        colorGradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)')
      } else {
        // Idle: very flat, subtle line
        targetAmplitude = 0.8
        targetSpeed = 0.01
        colorGradient = ctx.createLinearGradient(0, 0, width, 0)
        colorGradient.addColorStop(0, 'rgba(255, 255, 255, 0.01)')
        colorGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)')
        colorGradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)')
      }

      const phase = phaseRef.current * (targetSpeed * 10)

      // Draw 3 layered sine waves with different parameters to look organic
      const waves = [
        { amplitude: targetAmplitude, frequency: 0.015, phaseShift: 0, opacity: 0.8 },
        { amplitude: targetAmplitude * 0.6, frequency: 0.025, phaseShift: Math.PI / 3, opacity: 0.4 },
        { amplitude: targetAmplitude * 0.3, frequency: 0.035, phaseShift: (2 * Math.PI) / 3, opacity: 0.2 },
      ]

      waves.forEach((w) => {
        ctx.beginPath()
        ctx.strokeStyle = colorGradient
        ctx.lineWidth = w.amplitude <= 1 ? 1 : 2
        ctx.globalAlpha = w.opacity

        for (let x = 0; x < width; x++) {
          // Normalize so amplitudes taper off at the left and right edges
          const edgeTaper = Math.sin((x / width) * Math.PI)
          const y =
            height / 2 +
            Math.sin(x * w.frequency + phase + w.phaseShift) * w.amplitude * edgeTaper
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      })

      ctx.globalAlpha = 1.0 // Reset alpha
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [status])

  return (
    <div className="w-full h-10 flex items-center justify-center overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}

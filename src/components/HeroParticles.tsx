'use client'

import { useEffect, useRef } from 'react'

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = 0
    let H = 0

    const LABELS = [
      'bytesurl.io/launch', 'go.io/sale', 'lnk.to/promo',
      'short.ly/deal', 'bit.do/offer', 'tiny.cc/event',
      'go.io/docs', 'lnk.to/blog', 'short.ly/free',
      'bit.do/start', 'tiny.cc/trial', 'bytesurl.io/plan',
      'bytesurl.io/promo', 'bytesurl.io/free', 'bytesurl.io/trial',
    ]

    type Particle = {
      x: number; y: number
      vx: number; vy: number
      label: string
      alpha: number
      targetAlpha: number
      size: number
    }

    const particles: Particle[] = []

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W * devicePixelRatio
      canvas.height = H * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    const spawn = (): Particle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      label: LABELS[Math.floor(Math.random() * LABELS.length)],
      alpha: 0,
      targetAlpha: 0.07 + Math.random() * 0.07,
      size: 11 + Math.random() * 2,
    })

    resize()
    for (let i = 0; i < 20; i++) {
      const p = spawn()
      p.alpha = p.targetAlpha
      particles.push(p)
    }

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < -140) p.x = W + 100
        if (p.x > W + 140) p.x = -100
        if (p.y < -40)  p.y = H + 20
        if (p.y > H + 40)  p.y = -20

        p.alpha += (p.targetAlpha - p.alpha) * 0.05

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.font = `${p.size}px monospace`

        const w   = ctx.measureText(p.label).width
        const pad = 5
        const rh  = p.size + pad * 2
        const rw  = w + pad * 2 + 16


        ctx.beginPath()
        ctx.roundRect(p.x - rw / 2, p.y - rh / 2, rw, rh, rh / 2)
        ctx.fillStyle = '#F5F3FF'
        ctx.fill()
        ctx.strokeStyle = '#DDD6FE'
        ctx.lineWidth = 1
        ctx.stroke()


        ctx.beginPath()
        ctx.arc(p.x - rw / 2 + 10, p.y + 1, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#7C3AED'
        ctx.fill()


        ctx.fillStyle = '#7C3AED'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.label, p.x - rw / 2 + 20, p.y + 1)

        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position     : 'absolute',
        inset        : 0,
        width        : '100%',
        height       : '100%',
        pointerEvents: 'none', 
        zIndex       : 0,
      }}
    />
  )
}
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimation } from '../store/AnimationStore'
import './ParticleEffects.css'

interface Particle {
  id: string
  x: number
  y: number
  rotation: number
  scale: number
}

/**
 * Particle Effects Component
 * Renders all 6 particle types based on animation state
 */
export default function ParticleEffects() {
  const { state } = useAnimation()
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!state.particleType) {
      setParticles([])
      return
    }

    switch (state.particleType) {
      case 'sleepZ':
        spawnSleepZParticles()
        break
      case 'confetti':
        spawnConfettiParticles()
        break
      case 'coffeeSteam':
        spawnCoffeeSteamParticles()
        break
      case 'angerParticle':
        spawnAngerParticles()
        break
      case 'sparkle':
        spawnSparkleParticles()
        break
      case 'glitchRectangle':
        spawnGlitchRectangles()
        break
    }
  }, [state.particleType])

  const spawnSleepZParticles = () => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 3; i++) {
      newParticles.push({
        id: `sleepZ-${Date.now()}-${i}`,
        x: 50 + (Math.random() * 20 - 10),
        y: 50 + (Math.random() * 20 - 10),
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4
      })
    }
    setParticles(newParticles)

    // Spawn new ones every 1.5s
    const interval = setInterval(() => {
      const newP: Particle = {
        id: `sleepZ-${Date.now()}`,
        x: 50 + (Math.random() * 20 - 10),
        y: 50 + (Math.random() * 20 - 10),
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4
      }
      setParticles(prev => [...prev, newP])
    }, 1500)

    return () => clearInterval(interval)
  }

  const spawnConfettiParticles = () => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: `confetti-${Date.now()}-${i}`,
        x: 50 + (Math.random() * 40 - 20),
        y: 50 + (Math.random() * 40 - 20),
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5
      })
    }
    setParticles(newParticles)
  }

  const spawnCoffeeSteamParticles = () => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 5; i++) {
      newParticles.push({
        id: `steam-${Date.now()}-${i}`,
        x: 50 + (Math.random() * 10 - 5),
        y: 70 + (Math.random() * 10),
        rotation: Math.random() * 20 - 10,
        scale: 0.3 + Math.random() * 0.3
      })
    }
    setParticles(newParticles)

    // Continuous steam
    const interval = setInterval(() => {
      const newP: Particle = {
        id: `steam-${Date.now()}`,
        x: 50 + (Math.random() * 10 - 5),
        y: 70,
        rotation: Math.random() * 20 - 10,
        scale: 0.3 + Math.random() * 0.3
      }
      setParticles(prev => [...prev, newP].slice(-10)) // Keep max 10
    }, 800)

    return () => clearInterval(interval)
  }

  const spawnAngerParticles = () => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: `anger-${Date.now()}-${i}`,
        x: 50,
        y: 50,
        rotation: (360 / 8) * i,
        scale: 1
      })
    }
    setParticles(newParticles)
  }

  const spawnSparkleParticles = () => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 3; i++) {
      newParticles.push({
        id: `sparkle-${Date.now()}-${i}`,
        x: 50 + (Math.random() * 30 - 15),
        y: 50 + (Math.random() * 30 - 15),
        rotation: Math.random() * 360,
        scale: 1
      })
    }
    setParticles(newParticles)
  }

  const spawnGlitchRectangles = () => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 5; i++) {
      newParticles.push({
        id: `glitch-${Date.now()}-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 90,
        scale: 0.5 + Math.random() * 0.5
      })
    }
    setParticles(newParticles)

    // Rapid glitch effect
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 90
      })))
    }, 50)

    setTimeout(() => {
      clearInterval(interval)
      setParticles([])
    }, 500)

    return () => clearInterval(interval)
  }

  if (!state.particleType) return null

  return (
    <div className="particle-effects-container">
      <AnimatePresence>
        {particles.map(particle => {
          switch (state.particleType) {
            case 'sleepZ':
              return <SleepZParticle key={particle.id} particle={particle} />
            case 'confetti':
              return <ConfettiParticle key={particle.id} particle={particle} />
            case 'coffeeSteam':
              return <CoffeeSteamParticle key={particle.id} particle={particle} />
            case 'angerParticle':
              return <AngerParticle key={particle.id} particle={particle} />
            case 'sparkle':
              return <SparkleParticle key={particle.id} particle={particle} />
            case 'glitchRectangle':
              return <GlitchRectangle key={particle.id} particle={particle} />
            default:
              return null
          }
        })}
      </AnimatePresence>
    </div>
  )
}

// Sleep Z Particle
function SleepZParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="particle sleep-z"
      initial={{ opacity: 0, y: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: -30,
        scale: [0.8, 1.4, 1.4, 0.8],
        x: particle.x + Math.sin(Date.now() / 1000) * 5
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 2,
        ease: 'easeOut'
      }}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`
      }}
    >
      Z
    </motion.div>
  )
}

// Confetti Particle
function ConfettiParticle({ particle }: { particle: Particle }) {
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181']
  const color = colors[Math.floor(Math.random() * colors.length)]

  return (
    <motion.div
      className="particle confetti"
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
      animate={{
        opacity: [1, 1, 0],
        y: 100,
        x: (Math.random() - 0.5) * 50,
        rotate: 360
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 2 + Math.random(),
        ease: 'easeIn'
      }}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        backgroundColor: color,
        transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`
      }}
    />
  )
}

// Coffee Steam Particle
function CoffeeSteamParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="particle coffee-steam"
      initial={{ opacity: 0, y: 0, scale: 0.3 }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        y: -40,
        scale: [0.3, 0.6, 0.6, 0.3],
        x: particle.x + Math.sin(Date.now() / 500 + particle.id.length) * 3
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 3,
        ease: 'easeOut',
        repeat: Infinity
      }}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`
      }}
    />
  )
}

// Anger Particle
function AngerParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="particle anger"
      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1.5, 2],
        x: Math.cos((particle.rotation * Math.PI) / 180) * 30,
        y: Math.sin((particle.rotation * Math.PI) / 180) * 30
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: 'easeOut'
      }}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        transform: `rotate(${particle.rotation}deg)`
      }}
    />
  )
}

// Sparkle Particle
function SparkleParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="particle sparkle"
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1.2, 0],
        rotate: 180
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut'
      }}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`
      }}
    >
      ✦
    </motion.div>
  )
}

// Glitch Rectangle
function GlitchRectangle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="particle glitch-rectangle"
      initial={{ opacity: 1 }}
      animate={{
        opacity: [1, 0.5, 1, 0.5, 1, 0],
        x: particle.x + (Math.random() - 0.5) * 10,
        y: particle.y + (Math.random() - 0.5) * 10
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.05,
        repeat: 10
      }}
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`
      }}
    />
  )
}


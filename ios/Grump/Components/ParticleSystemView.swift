import SwiftUI

enum ParticleType {
    case sleepZ
    case confetti
    case coffeeSteam
    case angerParticle
    case sparkle
    case glitchRectangle
}

struct Particle: Identifiable {
    let id = UUID()
    var position: CGPoint
    var velocity: CGVector
    var size: CGFloat
    var opacity: Double
    var rotation: Double
    var color: Color
    var lifetime: TimeInterval
    var age: TimeInterval = 0
}

struct ParticleSystemView: View {
    let particleType: ParticleType
    let isActive: Bool
    @State private var particles: [Particle] = []
    @State private var spawnTimer: Timer?
    
    var body: some View {
        if ReducedMotion.shouldDisable(.particles) {
            EmptyView()
        } else {
            TimelineView(.periodic(from: .now, by: 0.016)) { context in
            Canvas { ctx, size in
                for particle in particles {
                    let ageRatio = particle.age / particle.lifetime
                    let currentOpacity = particle.opacity * (1.0 - ageRatio)
                    let currentSize = particle.size * (1.0 + ageRatio * 0.5)
                    
                    ctx.opacity = currentOpacity
                    ctx.rotate(by: .degrees(particle.rotation))
                    
                    switch particleType {
                    case .sleepZ:
                        drawZ(ctx: ctx, at: particle.position, size: currentSize, color: particle.color)
                    case .confetti:
                        drawConfetti(ctx: ctx, at: particle.position, size: currentSize, color: particle.color)
                    case .coffeeSteam:
                        drawSteam(ctx: ctx, at: particle.position, size: currentSize, color: particle.color)
                    case .angerParticle:
                        drawAngerLine(ctx: ctx, at: particle.position, size: currentSize, color: particle.color)
                    case .sparkle:
                        drawSparkle(ctx: ctx, at: particle.position, size: currentSize, color: particle.color)
                    case .glitchRectangle:
                        drawGlitchRect(ctx: ctx, at: particle.position, size: currentSize, color: particle.color)
                    }
                }
            }
            .onChange(of: isActive) { _, active in
                if active {
                    startParticleSystem()
                } else {
                    stopParticleSystem()
                }
            }
            }
        }
    }
    
    private func startParticleSystem() {
        let spawnInterval = getSpawnInterval()
        spawnTimer = Timer.scheduledTimer(withTimeInterval: spawnInterval, repeats: true) { [self] _ in
            spawnParticle()
        }
        
        // Update existing particles
        Timer.scheduledTimer(withTimeInterval: 0.016, repeats: true) { [self] timer in
            if !isActive {
                timer.invalidate()
                return
            }
            
            particles = particles.compactMap { particle in
                var updated = particle
                updated.age += 0.016
                
                // Update position based on velocity
                updated.position.x += updated.velocity.dx * 0.016
                updated.position.y += updated.velocity.dy * 0.016
                
                // Apply physics
                switch particleType {
                case .confetti:
                    updated.velocity.dy += 0.3 // Gravity
                    updated.velocity.dx *= 0.98 // Drag
                    updated.rotation += 2.0 // Spin
                case .coffeeSteam:
                    updated.velocity.dx += sin(updated.age * 0.15) * 3.0 // Wobble
                case .sleepZ:
                    updated.velocity.dx = sin(updated.age * 0.1) * 4.0 // Sine wave drift
                default:
                    break
                }
                
                // Remove if expired
                if updated.age >= updated.lifetime {
                    return nil
                }
                
                return updated
            }
        }
    }
    
    private func stopParticleSystem() {
        spawnTimer?.invalidate()
        particles.removeAll()
    }
    
    private func spawnParticle() {
        let particle = createParticle()
        particles.append(particle)
        
            // Limit particle count (performance budget)
            if particles.count > PerformanceOptimizer.maxParticles {
                particles.removeFirst()
            }
    }
    
    private func createParticle() -> Particle {
        switch particleType {
        case .sleepZ:
            return Particle(
                position: CGPoint(x: 0, y: -60),
                velocity: CGVector(dx: 0, dy: -2),
                size: 8,
                opacity: 0.6,
                rotation: -15,
                color: Color.grumpTextPrimary,
                lifetime: 2.0
            )
            
        case .confetti:
            let colors: [Color] = [.grumpAccent, .orange, .blue, .purple, .green]
            return Particle(
                position: CGPoint(x: Double.random(in: -200...200), y: -200),
                velocity: CGVector(
                    dx: Double.random(in: -2...2),
                    dy: Double.random(in: 0.3...0.5)
                ),
                size: Double.random(in: 4...8),
                opacity: 1.0,
                rotation: Double.random(in: 0...360),
                color: colors.randomElement() ?? .grumpAccent,
                lifetime: 5.0
            )
            
        case .coffeeSteam:
            return Particle(
                position: CGPoint(x: 120, y: 120),
                velocity: CGVector(
                    dx: sin(Double.random(in: 0...Double.pi)) * 3.0,
                    dy: -1
                ),
                size: Double.random(in: 3...4),
                opacity: 0.3,
                rotation: 0,
                color: .white,
                lifetime: 1.0
            )
            
        case .angerParticle:
            return Particle(
                position: CGPoint(x: 0, y: 0),
                velocity: CGVector(
                    dx: Double.random(in: -5...5),
                    dy: Double.random(in: -5...5)
                ),
                size: 8,
                opacity: 1.0,
                rotation: Double.random(in: 0...360),
                color: Color.grumpAccent,
                lifetime: 0.3
            )
            
        case .sparkle:
            return Particle(
                position: CGPoint(x: -20, y: -20),
                velocity: CGVector(dx: 0, dy: 0),
                size: 3,
                opacity: 1.0,
                rotation: 0,
                color: .white,
                lifetime: 0.4
            )
            
        case .glitchRectangle:
            return Particle(
                position: CGPoint(
                    x: Double.random(in: -140...140),
                    y: Double.random(in: -140...140)
                ),
                velocity: CGVector(dx: 0, dy: 0),
                size: 10,
                opacity: 1.0,
                rotation: 0,
                color: Color(hex: "FF66FF"),
                lifetime: 0.05
            )
        }
    }
    
    private func getSpawnInterval() -> TimeInterval {
        switch particleType {
        case .sleepZ: return 1.5
        case .confetti: return 0.1 // Burst
        case .coffeeSteam: return 0.2
        case .angerParticle: return 0.1
        case .sparkle: return 999 // Very rare
        case .glitchRectangle: return 0.1
        }
    }
    
    private func drawZ(ctx: GraphicsContext, at position: CGPoint, size: CGFloat, color: Color) {
        var path = Path()
        path.move(to: CGPoint(x: position.x - size/2, y: position.y))
        path.addLine(to: CGPoint(x: position.x + size/2, y: position.y))
        path.addLine(to: CGPoint(x: position.x - size/2, y: position.y + size/2))
        path.addLine(to: CGPoint(x: position.x + size/2, y: position.y + size/2))
        ctx.stroke(path, with: .color(color), lineWidth: 2)
    }
    
    private func drawConfetti(ctx: GraphicsContext, at position: CGPoint, size: CGFloat, color: Color) {
        let rect = CGRect(
            x: position.x - size/2,
            y: position.y - size/2,
            width: size,
            height: size
        )
        ctx.fill(Path(rect), with: .color(color))
    }
    
    private func drawSteam(ctx: GraphicsContext, at position: CGPoint, size: CGFloat, color: Color) {
        let rect = CGRect(
            x: position.x - size/2,
            y: position.y - size/2,
            width: size,
            height: size * 1.3
        )
        ctx.fill(Path(ellipseIn: rect), with: .color(color))
    }
    
    private func drawAngerLine(ctx: GraphicsContext, at position: CGPoint, size: CGFloat, color: Color) {
        var path = Path()
        path.move(to: position)
        path.addLine(to: CGPoint(x: position.x + size, y: position.y))
        ctx.stroke(path, with: .color(color), lineWidth: 2)
    }
    
    private func drawSparkle(ctx: GraphicsContext, at position: CGPoint, size: CGFloat, color: Color) {
        // 4-point star
        var path = Path()
        let radius = size / 2
        for i in 0..<4 {
            let angle = Double(i) * Double.pi / 2
            let x = position.x + cos(angle) * radius
            let y = position.y + sin(angle) * radius
            if i == 0 {
                path.move(to: CGPoint(x: x, y: y))
            } else {
                path.addLine(to: CGPoint(x: x, y: y))
            }
        }
        path.closeSubpath()
        ctx.fill(path, with: .color(color))
    }
    
    private func drawGlitchRect(ctx: GraphicsContext, at position: CGPoint, size: CGFloat, color: Color) {
        let rect = CGRect(
            x: position.x - size/2,
            y: position.y - 1,
            width: size,
            height: 2
        )
        ctx.fill(Path(rect), with: .color(color))
    }
}


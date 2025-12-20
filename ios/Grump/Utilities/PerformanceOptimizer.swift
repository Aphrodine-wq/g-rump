import SwiftUI

struct PerformanceOptimizer {
    // Performance budgets - 120fps for ProMotion displays
    static let targetFPS: Double = 120.0
    static let frameBudget: TimeInterval = 1.0 / targetFPS // 8.33ms
    static let animationCalcBudget: TimeInterval = 0.002 // 2ms (for 120fps)
    static let renderBudget: TimeInterval = 0.004 // 4ms (for 120fps)
    static let bufferBudget: TimeInterval = 0.00233 // 2.33ms (for 120fps)
    
    // Limits
    static let maxAnimatedLayers: Int = 12
    static let maxParticles: Int = 30
    
    // Particle pooling
    private static var particlePool: [Particle] = []
    private static let poolSize = 50
    
    static func getParticleFromPool() -> Particle? {
        if particlePool.isEmpty {
            return nil
        }
        return particlePool.removeFirst()
    }
    
    static func returnParticleToPool(_ particle: Particle) {
        if particlePool.count < poolSize {
            particlePool.append(particle)
        }
    }
    
    // GPU-accelerated properties (use transform, opacity, scale)
    // These are automatically GPU-accelerated in SwiftUI
    
    // Pre-compute keyframes for complex animations
    static func precomputeKeyframes(
        startValue: Double,
        endValue: Double,
        duration: TimeInterval,
        easing: EasingFunction
    ) -> [Double] {
        let frameCount = Int(duration * targetFPS)
        var keyframes: [Double] = []
        
        for i in 0...frameCount {
            let progress = Double(i) / Double(frameCount)
            let eased = easing(progress)
            keyframes.append(startValue + (endValue - startValue) * eased)
        }
        
        return keyframes
    }
    
    // Pause off-screen animations
    static func shouldPauseAnimation(isOnScreen: Bool, isVisible: Bool) -> Bool {
        return !isOnScreen || !isVisible
    }
}

typealias EasingFunction = (Double) -> Double

struct EasingFunctions {
    static let linear: EasingFunction = { t in t }
    static let easeIn: EasingFunction = { t in t * t }
    static let easeOut: EasingFunction = { t in t * (2 - t) }
    static let easeInOut: EasingFunction = { t in
        if t < 0.5 {
            return 2 * t * t
        } else {
            return -1 + (4 - 2 * t) * t
        }
    }
}


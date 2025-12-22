// G-Rump Compiled Animation Engine for iOS
// Generated from grump-character-animations.grump
// Advanced animation system with reasoning and causal chains

import SwiftUI
import Combine

// MARK: - Animation State Management

struct GrumpAnimationState {
    var mood: GrumpMood = .neutral
    var intensity: Double = 0.5
    var eyeScaleX: Double = 1.0
    var eyeScaleY: Double = 1.0
    var leftEyebrowRotation: Double = 0.0
    var rightEyebrowRotation: Double = 0.0
    var leftEyebrowY: Double = 0.0
    var rightEyebrowY: Double = 0.0
    var mouthWidth: Double = 1.0
    var mouthCurveDepth: Double = 0.0
    var glowIntensity: Double = 0.0
    var glowPulseRate: Double = 2.0
    var glowColor: GlowColor = .soft
    var showAccessories: Bool = false
    var accessoryType: AccessoryType = .partyHat
    var particleType: ParticleType? = nil

    // Advanced animation properties
    var causalDelay: Double = 0.0
    var settlingOvershoot: Double = 0.0
    var microSettleAmount: Double = 0.0
}

// MARK: - Animation Engine

class GrumpAnimationEngine: ObservableObject {
    @Published var state = GrumpAnimationState()
    private var cancellables = Set<AnyCancellable>()

    // Animation reasoning system
    private let reasoner = AnimationReasoner()

    // MARK: - Public API

    func setMood(_ mood: GrumpMood, intensity: Double = 0.5, animated: Bool = true) {
        let oldState = state

        // Use reasoning system to determine animation parameters
        let reasoningResult = reasoner.reason(
            from: oldState.mood,
            to: mood,
            intensity: intensity
        )

        state.mood = mood
        state.intensity = intensity

        if animated {
            animateToReasonedState(reasoningResult)
        } else {
            applyReasonedState(reasoningResult)
        }
    }

    func playSequence(_ sequence: AnimationSequence) {
        // Play complex animation sequences with causal chains
        reasoner.executeSequence(sequence) { [weak self] step in
            self?.applyAnimationStep(step)
        }
    }

    // MARK: - Animation Implementation

    private func animateToReasonedState(_ result: ReasoningResult) {
        // Apply reasoned animation with proper timing and causality

        // Phase 1: Anticipation (stillness creates contrast)
        if result.requiresAnticipation {
            // Brief pause before animation
            DispatchQueue.main.asyncAfter(deadline: .now() + result.anticipationDelay) {
                self.animateWithCausality(result)
            }
        } else {
            animateWithCausality(result)
        }
    }

    private func animateWithCausality(_ result: ReasoningResult) {
        // Leader animations (eyes first)
        animateEyes(result.eyeAnimation)

        // Secondary animations with causal delays
        DispatchQueue.main.asyncAfter(deadline: .now() + result.causalDelays.brows) {
            self.animateBrows(result.browAnimation)
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + result.causalDelays.head) {
            self.animateHead(result.headAnimation)
        }

        // Tertiary animations
        DispatchQueue.main.asyncAfter(deadline: .now() + result.causalDelays.body) {
            self.animateBody(result.bodyAnimation)
        }

        // Mouth animation (special timing)
        DispatchQueue.main.asyncAfter(deadline: .now() + result.causalDelays.mouth) {
            self.animateMouth(result.mouthAnimation)
        }

        // Effects
        if result.hasGlow {
            animateGlow(result.glowAnimation)
        }

        if result.hasParticles {
            animateParticles(result.particleAnimation)
        }

        // Settling phase
        DispatchQueue.main.asyncAfter(deadline: .now() + result.settlingDelay) {
            self.applySettling(result.settling)
        }
    }

    // MARK: - Individual Animation Methods

    private func animateEyes(_ animation: EyeAnimation) {
        withAnimation(.ease(animation.ease).duration(animation.duration)) {
            state.eyeScaleX = animation.scaleX
            state.eyeScaleY = animation.scaleY
        }
    }

    private func animateBrows(_ animation: BrowAnimation) {
        withAnimation(.ease(animation.ease).duration(animation.duration)) {
            state.leftEyebrowRotation = animation.leftRotation
            state.rightEyebrowRotation = animation.rightRotation
            state.leftEyebrowY = animation.leftY
            state.rightEyebrowY = animation.rightY
        }
    }

    private func animateHead(_ animation: HeadAnimation) {
        // Head animations would affect the entire character transform
        withAnimation(.ease(animation.ease).duration(animation.duration)) {
            // Apply head rotation/position changes
        }
    }

    private func animateBody(_ animation: BodyAnimation) {
        // Body breathing and posture changes
        withAnimation(.ease(animation.ease).duration(animation.duration)) {
            // Apply body scale/position changes
        }
    }

    private func animateMouth(_ animation: MouthAnimation) {
        withAnimation(.ease(animation.ease).duration(animation.duration)) {
            state.mouthWidth = animation.width
            state.mouthCurveDepth = animation.curveDepth
        }
    }

    private func animateGlow(_ animation: GlowAnimation) {
        withAnimation(.ease(animation.ease).duration(animation.duration)) {
            state.glowIntensity = animation.intensity
            state.glowPulseRate = animation.pulseRate
            state.glowColor = animation.color
        }
    }

    private func animateParticles(_ animation: ParticleAnimation) {
        state.particleType = animation.particleType
        // Particle system would be triggered here
    }

    private func applySettling(_ settling: SettlingConfig) {
        // Apply micro-settles and overshoot corrections
        withAnimation(.ease(.smooth).duration(settling.duration)) {
            state.settlingOvershoot = settling.overshoot
            state.microSettleAmount = settling.microAmount
        }
    }

    private func applyAnimationStep(_ step: AnimationStep) {
        // Apply individual animation step from sequence
        switch step.type {
        case .eye:
            animateEyes(step.eyeAnimation!)
        case .brow:
            animateBrows(step.browAnimation!)
        case .mouth:
            animateMouth(step.mouthAnimation!)
        case .head:
            animateHead(step.headAnimation!)
        case .body:
            animateBody(step.bodyAnimation!)
        case .glow:
            animateGlow(step.glowAnimation!)
        case .particle:
            animateParticles(step.particleAnimation!)
        }
    }
}

// MARK: - Supporting Types

enum GrumpMood {
    case neutral, annoyed, typing, angry, happy, surprised
}

enum GlowColor {
    case red, orange, soft, intense
}

enum AccessoryType {
    case partyHat, coffeeMug
}

enum ParticleType {
    case sparkles, hearts, angerSymbols
}

// Animation configuration structs would be generated here
// These represent the compiled output from G-Rump reasoning

struct ReasoningResult {
    let requiresAnticipation: Bool
    let anticipationDelay: Double
    let causalDelays: CausalDelays
    let eyeAnimation: EyeAnimation
    let browAnimation: BrowAnimation
    let headAnimation: HeadAnimation
    let bodyAnimation: BodyAnimation
    let mouthAnimation: MouthAnimation
    let hasGlow: Bool
    let glowAnimation: GlowAnimation
    let hasParticles: Bool
    let particleAnimation: ParticleAnimation
    let settlingDelay: Double
    let settling: SettlingConfig
}

struct CausalDelays {
    let brows: Double
    let head: Double
    let body: Double
    let mouth: Double
}

struct EyeAnimation {
    let scaleX: Double
    let scaleY: Double
    let duration: Double
    let ease: AnimationEase
}

struct BrowAnimation {
    let leftRotation: Double
    let rightRotation: Double
    let leftY: Double
    let rightY: Double
    let duration: Double
    let ease: AnimationEase
}

struct HeadAnimation {
    let rotation: Double
    let tilt: Double
    let duration: Double
    let ease: AnimationEase
}

struct BodyAnimation {
    let scale: Double
    let shift: Double
    let duration: Double
    let ease: AnimationEase
}

struct MouthAnimation {
    let width: Double
    let curveDepth: Double
    let duration: Double
    let ease: AnimationEase
}

struct GlowAnimation {
    let intensity: Double
    let pulseRate: Double
    let color: GlowColor
    let duration: Double
    let ease: AnimationEase
}

struct ParticleAnimation {
    let particleType: ParticleType
    let count: Int
    let duration: Double
}

struct SettlingConfig {
    let overshoot: Double
    let microAmount: Double
    let duration: Double
}

struct AnimationSequence {
    let steps: [AnimationStep]
}

struct AnimationStep {
    let type: AnimationStepType
    let delay: Double
    let eyeAnimation: EyeAnimation?
    let browAnimation: BrowAnimation?
    let mouthAnimation: MouthAnimation?
    let headAnimation: HeadAnimation?
    let bodyAnimation: BodyAnimation?
    let glowAnimation: GlowAnimation?
    let particleAnimation: ParticleAnimation?
}

enum AnimationStepType {
    case eye, brow, mouth, head, body, glow, particle
}

enum AnimationEase {
    case linear, easeIn, easeOut, easeInOut, smooth, bounce, heavy, fastOut
}

// MARK: - Animation Reasoner

class AnimationReasoner {
    // This would contain the compiled reasoning logic from G-Rump
    // For now, it's a placeholder that demonstrates the concept

    func reason(from oldMood: GrumpMood, to newMood: GrumpMood, intensity: Double) -> ReasoningResult {
        // Complex reasoning based on G-Rump entity definitions
        // This would be generated code from the compiler

        switch newMood {
        case .annoyed:
            return ReasoningResult(
                requiresAnticipation: true,
                anticipationDelay: 0.08,
                causalDelays: CausalDelays(brows: 0.02, head: 0.06, body: 0.08, mouth: 0.04),
                eyeAnimation: EyeAnimation(scaleX: 1.0, scaleY: 1.0, duration: 0.12, ease: .fastOut),
                browAnimation: BrowAnimation(leftRotation: 12, rightRotation: -8, leftY: 0, rightY: 0, duration: 0.15, ease: .heavy),
                headAnimation: HeadAnimation(rotation: 0, tilt: 5, duration: 0.22, ease: .heavy),
                bodyAnimation: BodyAnimation(scale: 1.0, shift: 0, duration: 0.2, ease: .smooth),
                mouthAnimation: MouthAnimation(width: 1.0, curveDepth: -5, duration: 0.2, ease: .smooth),
                hasGlow: false,
                glowAnimation: GlowAnimation(intensity: 0, pulseRate: 2, color: .soft, duration: 0.3, ease: .smooth),
                hasParticles: false,
                particleAnimation: ParticleAnimation(particleType: .sparkles, count: 0, duration: 0),
                settlingDelay: 0.6,
                settling: SettlingConfig(overshoot: 0.05, microAmount: 0.08, duration: 0.6)
            )

        case .happy:
            return ReasoningResult(
                requiresAnticipation: true,
                anticipationDelay: 0.06,
                causalDelays: CausalDelays(brows: 0.02, head: 0.08, body: 0.1, mouth: 0.05),
                eyeAnimation: EyeAnimation(scaleX: 1.2, scaleY: 1.1, duration: 0.2, ease: .bounce),
                browAnimation: BrowAnimation(leftRotation: -5, rightRotation: -5, leftY: -3, rightY: -3, duration: 0.25, ease: .light),
                headAnimation: HeadAnimation(rotation: 0, tilt: -3, duration: 0.35, ease: .bounce),
                bodyAnimation: BodyAnimation(scale: 1.05, shift: 0, duration: 0.4, ease: .bounce),
                mouthAnimation: MouthAnimation(width: 1.2, curveDepth: 10, duration: 0.3, ease: .smooth),
                hasGlow: true,
                glowAnimation: GlowAnimation(intensity: 0.8, pulseRate: 3, color: .soft, duration: 0.4, ease: .smooth),
                hasParticles: true,
                particleAnimation: ParticleAnimation(particleType: .hearts, count: 5, duration: 1.0),
                settlingDelay: 0.5,
                settling: SettlingConfig(overshoot: 0.1, microAmount: 0.06, duration: 0.5)
            )

        default:
            // Default neutral animation
            return ReasoningResult(
                requiresAnticipation: false,
                anticipationDelay: 0,
                causalDelays: CausalDelays(brows: 0.05, head: 0.1, body: 0.15, mouth: 0.08),
                eyeAnimation: EyeAnimation(scaleX: 1.0, scaleY: 1.0, duration: 0.3, ease: .smooth),
                browAnimation: BrowAnimation(leftRotation: 0, rightRotation: 0, leftY: 0, rightY: 0, duration: 0.3, ease: .smooth),
                headAnimation: HeadAnimation(rotation: 0, tilt: 0, duration: 0.3, ease: .smooth),
                bodyAnimation: BodyAnimation(scale: 1.0, shift: 0, duration: 0.3, ease: .smooth),
                mouthAnimation: MouthAnimation(width: 1.0, curveDepth: 0, duration: 0.3, ease: .smooth),
                hasGlow: false,
                glowAnimation: GlowAnimation(intensity: 0, pulseRate: 2, color: .soft, duration: 0.3, ease: .smooth),
                hasParticles: false,
                particleAnimation: ParticleAnimation(particleType: .sparkles, count: 0, duration: 0),
                settlingDelay: 0.3,
                settling: SettlingConfig(overshoot: 0.02, microAmount: 0.03, duration: 0.3)
            )
        }
    }

    func executeSequence(_ sequence: AnimationSequence, stepHandler: @escaping (AnimationStep) -> Void) {
        // Execute animation sequence with proper timing
        for (index, step) in sequence.steps.enumerated() {
            let delay = step.delay
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                stepHandler(step)
            }
        }
    }
}
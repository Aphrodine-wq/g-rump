import Foundation
import Combine
import SwiftUI

@MainActor
class AnimationService: ObservableObject {
    @Published var state: AnimationState = AnimationState()
    @Published var isBlinking: Bool = false
    @Published var blinkType: BlinkType = .standard
    @Published var eyeTrackingPosition: CGFloat = 0
    @Published var isEyeRolling: Bool = false
    @Published var eyeRollPhase: Double = 0
    
    private var cancellables = Set<AnyCancellable>()
    private var blinkTimer: Timer?
    private var breathingTimer: Timer?
    private var idleTimer: Timer?
    private var microMovementTimer: Timer?
    
    // Perlin noise generators for micro-movements
    private let pupilNoise = PerlinNoise(seed: 1)
    private let eyebrowNoise = PerlinNoise(seed: 2)
    private let headNoise = PerlinNoise(seed: 3)
    private let mouthNoise = PerlinNoise(seed: 4)
    
    init() {
        startContinuousAnimations()
    }
    
    func transitionToState(_ newState: EmotionalState) {
        let previousState = state.currentState
        
        // Check emotion buffer system (v2.1)
        if !TransitionMatrix.shouldAllowTransition(
            from: previousState,
            to: newState,
            lastChangeTime: state.lastStateChange
        ) {
            // Queue the transition or intensify current if same state
            if previousState == newState {
                // Re-trigger: Intensify slightly (+5%)
                intensifyCurrentExpression()
            }
            return
        }
        
        // Get transition spec from matrix
        let transition = TransitionMatrix.getTransition(from: previousState, to: newState)
        
        // Apply staggered component transitions (v2.1)
        applyStaggeredTransition(
            from: previousState,
            to: newState,
            transitionType: transition.type,
            duration: transition.duration
        )
        
        state.currentState = newState
        state.lastStateChange = Date()
    }
    
    private func intensifyCurrentExpression() {
        // Intensify current expression by 5% on applicable values
        // This allows same-expression re-triggers to build intensity
        withAnimation(GrumpEasingCurve.snap(duration: 0.1)) {
            // Intensify eyebrow rotations, glow, etc. by 5%
            let intensityMultiplier = 1.05
            state.leftEyebrowRotation *= intensityMultiplier
            state.rightEyebrowRotation *= intensityMultiplier
            state.glowIntensity = min(1.0, state.glowIntensity * intensityMultiplier)
        }
    }
    
    private func applyStaggeredTransition(
        from: EmotionalState,
        to: EmotionalState,
        transitionType: TransitionMatrix.TransitionType,
        duration: TimeInterval
    ) {
        // Select appropriate easing curve based on transition type
        let curve: Animation
        switch transitionType {
        case .direct, .escalation, .glitchIn:
            curve = GrumpEasingCurve.snap(duration: duration)
        case .gradualSettle, .coolDown, .gentle:
            curve = GrumpEasingCurve.settle(duration: duration)
        case .crossfade:
            curve = GrumpEasingCurve.float(duration: duration)
        case .glitchOut:
            curve = GrumpEasingCurve.mechanical(duration: duration)
        case .progressive, .startle:
            curve = GrumpEasingCurve.settle(duration: duration)
        }
        
        // Get target state configuration
        let targetComponents = ExpressionConfig.getComponentStates(for: to)
        let fromComponents = ExpressionConfig.getComponentStates(for: from)
        
        // Apply component transitions with stagger (v2.1)
        // Eyebrows lead (0ms delay - immediate)
        withAnimation(curve) {
            state.leftEyebrowRotation = targetComponents.leftEyebrowRotation
            state.rightEyebrowRotation = targetComponents.rightEyebrowRotation
            state.leftEyebrowY = targetComponents.leftEyebrowY
            state.rightEyebrowY = targetComponents.rightEyebrowY
            state.leftEyebrowX = targetComponents.leftEyebrowX
            state.rightEyebrowX = targetComponents.rightEyebrowX
        }
        
        // Eyelids (30ms delay)
        DispatchQueue.main.asyncAfter(deadline: .now() + AnimationConstants.transitionEyelidDelay) {
            withAnimation(curve) {
                self.state.leftEyelidTopY = targetComponents.leftEyelidTopY
                self.state.rightEyelidTopY = targetComponents.rightEyelidTopY
                self.state.leftEyelidBottomY = targetComponents.leftEyelidBottomY
                self.state.rightEyelidBottomY = targetComponents.rightEyelidBottomY
            }
        }
        
        // Eye whites (50ms delay)
        DispatchQueue.main.asyncAfter(deadline: .now() + AnimationConstants.transitionEyeWhiteDelay) {
            withAnimation(curve) {
                self.state.leftEyeScaleX = targetComponents.leftEyeScaleX
                self.state.leftEyeScaleY = targetComponents.leftEyeScaleY
                self.state.rightEyeScaleX = targetComponents.rightEyeScaleX
                self.state.rightEyeScaleY = targetComponents.rightEyeScaleY
            }
        }
        
        // Pupils (60ms delay)
        DispatchQueue.main.asyncAfter(deadline: .now() + AnimationConstants.transitionPupilDelay) {
            withAnimation(curve) {
                self.state.leftPupilSize = targetComponents.leftPupilSize
                self.state.rightPupilSize = targetComponents.rightPupilSize
            }
        }
        
        // Mouth (80ms delay)
        DispatchQueue.main.asyncAfter(deadline: .now() + AnimationConstants.transitionMouthDelay) {
            withAnimation(curve) {
                self.state.mouthState = targetComponents.mouthState
                self.state.mouthWidth = targetComponents.mouthWidth
                self.state.mouthHeight = targetComponents.mouthHeight
                self.state.mouthCurveDepth = targetComponents.mouthCurveDepth
                // v2.1: Mouth elasticity - overshoot then settle
                self.state.mouthWidth = targetComponents.mouthWidth * 1.08 // Start with 8% overshoot
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.01) {
                    withAnimation(GrumpEasingCurve.settle(duration: 0.08)) {
                        self.state.mouthWidth = targetComponents.mouthWidth // Settle to target
                    }
                }
            }
        }
        
        // Mood glow (100ms delay - most delayed)
        DispatchQueue.main.asyncAfter(deadline: .now() + AnimationConstants.transitionGlowDelay) {
            withAnimation(curve) {
                self.state.glowIntensity = targetComponents.glowIntensity
                self.state.glowPulseRate = targetComponents.glowPulseRate
                self.state.glowColor = targetComponents.glowColor
            }
        }
        
        // Call updateStateForEmotion for special behaviors (after main transition)
        updateStateForEmotion(to, previousState: from)
    }
    
    func updateEyeTracking(position: CGFloat) {
        // v2.1: Use grumpFloat curve with velocity constraints and stagger
        let currentLeft = state.leftPupilX
        let currentRight = state.rightPupilX
        let target = Double(position)
        
        // Apply maximum velocity constraint (40pt/sec)
        let maxChange = AnimationConstants.pupilMaxVelocity * AnimationConstants.eyeTrackingSpeed
        let leftChange = min(abs(target - currentLeft), maxChange) * (target > currentLeft ? 1 : -1)
        let rightChange = min(abs(target - currentRight), maxChange) * (target > currentRight ? 1 : -1)
        
        // Left pupil leads slightly (20ms stagger)
        withAnimation(GrumpEasingCurve.float(duration: AnimationConstants.eyeTrackingSpeed)) {
            eyeTrackingPosition = position
            state.leftPupilX = currentLeft + leftChange
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + AnimationConstants.pupilStaggerDelay) {
            withAnimation(GrumpEasingCurve.float(duration: AnimationConstants.eyeTrackingSpeed)) {
                self.state.rightPupilX = currentRight + rightChange
            }
        }
    }
    
    func triggerBlink(type: BlinkType? = nil) {
        let blink = type ?? determineBlinkTypeForState()
        blinkType = blink
        
        // v2.1: Refined blink timing - 180ms total with hold
        let baseDuration = AnimationConstants.blinkDuration
        let variance = baseDuration * AnimationConstants.blinkSpeedVariance * (Double.random(in: -1...1))
        let duration = baseDuration + variance
        
        // Determine lead eye (randomize for asymmetry)
        let leftLeads = Bool.random()
        let asymmetry = Double.random(in: 0.95...1.0) // 5% chance of uneven blink
        
        if blink == .quickDouble {
            // Double blink
            withAnimation(.easeInOut(duration: duration)) {
                isBlinking = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
                withAnimation(.easeInOut(duration: duration)) {
                    self.isBlinking = false
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                    withAnimation(.easeInOut(duration: duration)) {
                        self.isBlinking = true
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
                        withAnimation(.easeInOut(duration: duration)) {
                            self.isBlinking = false
                        }
                    }
                }
            }
        } else if blink == .wink {
            // One eye only - handled by view
            withAnimation(.easeInOut(duration: duration)) {
                isBlinking = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
                withAnimation(.easeInOut(duration: duration)) {
                    self.isBlinking = false
                }
            }
        } else {
            // v2.1: Standard blink with refined timing
            // Blink down: grumpSnap * 0.8, Blink up: grumpSettle * 1.2
            let downDuration = AnimationConstants.blinkDownDuration
            let holdDuration = AnimationConstants.blinkHoldTime
            let upDuration = AnimationConstants.blinkUpDuration
            
            // Anticipation: Eyebrows micro-lift (30ms before)
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.03) {
                // Eyelids begin descent (grumpSnap)
                withAnimation(GrumpEasingCurve.snap(duration: downDuration)) {
                    self.isBlinking = true
                }
                
                // Hold at closed (prevents flutter)
                DispatchQueue.main.asyncAfter(deadline: .now() + downDuration + holdDuration) {
                    // Eyelids open (grumpSettle)
                    withAnimation(GrumpEasingCurve.settle(duration: upDuration)) {
                        self.isBlinking = false
                    }
                }
            }
        }
    }
    
    private func determineBlinkTypeForState() -> BlinkType {
        switch state.currentState {
        case .sleepy, .softMode:
            return .slow
        case .annoyed, .maximumGrump:
            return .heavy
        case .suspicious:
            return .half
        case .idle, .listening, .processing, .responding, .skeptical, .impressed:
            return .standard
        default:
            return .standard
        }
    }
    
    private func startContinuousAnimations() {
        // Blinking
        scheduleNextBlink()
        
        // Breathing
        startBreathingAnimation()
        
        // Idle tracking
        startIdleTracking()
        
        // Micro-movements
        startMicroMovements()
    }
    
    private func scheduleNextBlink() {
        let interval = getBlinkIntervalForState()
        blinkTimer = Timer.scheduledTimer(withTimeInterval: interval, repeats: false) { [weak self] _ in
            self?.triggerBlink()
            self?.scheduleNextBlink()
        }
    }
    
    private func getBlinkIntervalForState() -> Double {
        switch state.currentState {
        case .listening:
            return Double.random(in: 8...12)
        case .skeptical:
            return Double.random(in: 5...10)
        case .annoyed:
            return Double.random(in: 4...6)
        case .maximumGrump:
            return Double.random(in: 2...4)
        case .suspicious:
            return Double.random(in: 6...10)
        case .softMode, .sleepy:
            return Double.random(in: 4...5)
        default:
            return Double.random(in: AnimationConstants.blinkInterval)
        }
    }
    
    private func startBreathingAnimation() {
        // v2.1: Layered breathing system (primary Y, secondary X, component offsets)
        breathingTimer = Timer.scheduledTimer(withTimeInterval: 0.016, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            let (range, duration) = self.getBreathingParamsForState()
            let time = Date().timeIntervalSince1970
            
            // v2.1: Layered breathing - use sine for organic feel
            // Primary breath: Face scale Y (0.99-1.01) - sine easing, not linear
            let primaryCycle = sin(time * (2 * Double.pi / duration))
            let breathingMin = AnimationConstants.breathingScaleY.lowerBound
            let breathingMax = AnimationConstants.breathingScaleY.upperBound
            let breathingRange = breathingMax - breathingMin
            let breathingCenter = (breathingMax + breathingMin) / 2.0
            // Map sine (-1 to 1) to breathing range
            self.state.breathingScale = breathingCenter + (primaryCycle * breathingRange / 2.0)
            
            // Eye whites: Scale 0.995-1.005, synced to primary (view-level implementation needed)
            // Note: Eye breathing scale would need to be applied to eye components in view layer
            
            // Eyebrows: Y position +0.5pt at inhale peak (subtle lift)
            // Applied as subtle offset during idle states only
            if self.state.currentState == .idle {
                let eyebrowOffset = primaryCycle * AnimationConstants.eyebrowBreathingOffset
                // Store base Y and apply offset (simplified for now)
                let baseComponents = ExpressionConfig.getComponentStates(for: .idle)
                self.state.leftEyebrowY = baseComponents.leftEyebrowY + (eyebrowOffset * 0.3)
                self.state.rightEyebrowY = baseComponents.rightEyebrowY + (eyebrowOffset * 0.3)
            }
            
            // Mouth: Height +0.3pt at exhale (slight part)
            if self.state.currentState == .idle {
                let baseComponents = ExpressionConfig.getComponentStates(for: .idle)
                let mouthOffset = -primaryCycle * AnimationConstants.mouthBreathingHeight // Negative for exhale
                self.state.mouthHeight = max(2.0, baseComponents.mouthHeight + (mouthOffset * 0.2))
            }
        }
    }
    
    private func getBreathingParamsForState() -> (range: Double, duration: Double) {
        switch state.currentState {
        case .listening:
            return (0.01, 2.5)
        case .processing:
            return (0.02, 2.0)
        case .responding:
            return (0.015, 2.5)
        case .annoyed:
            return (0.03, 2.0)
        case .maximumGrump:
            return (0.04, 1.5)
        case .softMode:
            return (0.02, 4.0)
        case .sleepy, .sleep:
            return (0.04, 4.5)
        default:
            return (0.02, 3.0)
        }
    }
    
    private func startIdleTracking() {
        idleTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.state.idleTime += 0.1
            
            // v2.1: Idle variation by context
            if self.state.currentState == .idle {
                let idleMinutes = self.state.idleTime / 60.0
                
                // Extended session idle (15+ min): Less alert
                if idleMinutes > 15 {
                    // Eyelids 12% closed (sleepier)
                    withAnimation(GrumpEasingCurve.settle(duration: 1.0)) {
                        self.state.leftEyelidTopY = -20 // More closed
                        self.state.rightEyelidTopY = -20
                    }
                    
                    // Occasional deeper sigh (every 60s)
                    if Int(self.state.idleTime) % 60 == 0 && Int.random(in: 0..<100) < 10 {
                        // Trigger subtle sigh animation
                    }
                } else {
                    // Fresh session idle: More alert
                    // Eyelids 5% closed (less sleepy)
                    withAnimation(GrumpEasingCurve.settle(duration: 1.0)) {
                        self.state.leftEyelidTopY = -23
                        self.state.rightEyelidTopY = -23
                    }
                }
                
                // After 10 seconds of idle, subtle changes
                if self.state.idleTime > 10 {
                    // Very subtle eye closing (not dramatic)
                    let closeAmount = min(0.95, 1.0 - (self.state.idleTime / 600.0) * 0.05) // Max 5% over 600s
                    withAnimation(GrumpEasingCurve.settle(duration: 2.0)) {
                        self.state.leftEyeScaleY = closeAmount
                        self.state.rightEyeScaleY = closeAmount
                    }
                }
            }
        }
    }
    
    func resetIdleTimer() {
        state.idleTime = 0
        withAnimation {
            state.leftEyeScaleY = 1.0
            state.rightEyeScaleY = 1.0
        }
    }
    
    private func updateStateForEmotion(_ emotion: EmotionalState, previousState: EmotionalState) {
        let components = ExpressionConfig.getComponentStates(for: emotion)
        
        withAnimation(ReducedMotion.animation(duration: ReducedMotion.isEnabled ? 0.2 : 0.3)) {
            // Eyebrows
            state.leftEyebrowRotation = components.leftEyebrowRotation
            state.rightEyebrowRotation = components.rightEyebrowRotation
            state.leftEyebrowY = components.leftEyebrowY
            state.rightEyebrowY = components.rightEyebrowY
            state.leftEyebrowX = components.leftEyebrowX
            state.rightEyebrowX = components.rightEyebrowX
            
            // Eyes
            state.leftEyeScaleX = components.leftEyeScaleX
            state.leftEyeScaleY = components.leftEyeScaleY
            state.rightEyeScaleX = components.rightEyeScaleX
            state.rightEyeScaleY = components.rightEyeScaleY
            
            // Pupils
            state.leftPupilSize = components.leftPupilSize
            state.rightPupilSize = components.rightPupilSize
            
            // Eyelids
            state.leftEyelidTopY = components.leftEyelidTopY
            state.rightEyelidTopY = components.rightEyelidTopY
            state.leftEyelidBottomY = components.leftEyelidBottomY
            state.rightEyelidBottomY = components.rightEyelidBottomY
            
            // Mouth
            state.mouthState = components.mouthState
            state.mouthWidth = components.mouthWidth
            state.mouthCurveDepth = components.mouthCurveDepth
            
            // Glow
            state.glowIntensity = components.glowIntensity
            state.glowPulseRate = components.glowPulseRate
            state.glowColor = components.glowColor
        }
        
        // Special behaviors for specific states
        switch emotion {
        case .idle:
            resetIdleTimer()
            
        case .listening:
            resetIdleTimer()
            
        case .processing:
            // Animated pupil movement (thinking look)
            startProcessingAnimation()
            SoundService.shared.playSound(.eyeRoll)
            
        case .suspicious:
            startSuspiciousPupilShift()
            
        case .impressed:
            HapticService.shared.impressed()
            SoundService.shared.playSound(.impressed)
            
        case .maximumGrump:
            HapticService.shared.maximumGrump()
            triggerScreenShake()
            
        case .jumpscare:
            HapticService.shared.easterEgg()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                self.transitionToState(.annoyed)
            }
            
        case .threeAM:
            state.showAccessories = true
            state.accessoryType = .coffeeMug
            
        case .birthday:
            state.showAccessories = true
            state.accessoryType = .partyHat
            
        case .sleep:
            state.showAccessories = false
            state.particleType = .sleepZ
            
        case .birthday:
            state.particleType = .confetti
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                self.state.particleType = nil
            }
            
        case .maximumGrump:
            state.particleType = .angerParticle
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                self.state.particleType = nil
            }
            
        case .error:
            state.particleType = .glitchRectangle
            
        case .threeAM:
            state.particleType = .coffeeSteam
            
        case .impressed:
            // Rare sparkle (5% chance)
            if Int.random(in: 0..<100) < 5 {
                state.particleType = .sparkle
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                    self.state.particleType = nil
                }
            }
            
        default:
            state.showAccessories = false
            state.particleType = nil
        }
    }
    
    private func startProcessingAnimation() {
        // Random processing sequence
        let sequence = Int.random(in: 0..<4)
        switch sequence {
        case 0: // Thinking look - eyes move around
            withAnimation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true)) {
                state.leftPupilY = -4
                state.rightPupilY = -4
            }
        case 1: // Eye roll
            triggerEyeRoll()
        case 2: // Heavy blink
            triggerBlink(type: .heavy)
        default:
            break
        }
    }
    
    private func startSuspiciousPupilShift() {
        // Pupils shift side to side
        withAnimation(.easeInOut(duration: 2.0).repeatForever(autoreverses: true)) {
            state.leftPupilX = -4
            state.rightPupilX = -4
        }
    }
    
    private func triggerScreenShake() {
        // Screen shake handled in view
    }
    
    func triggerEyeRoll(variation: EyeRollVariation = .full) {
        // Skip if reduced motion enabled
        guard !ReducedMotion.shouldDisable(.eyeRoll) else { return }
        
        isEyeRolling = true
        HapticService.shared.eyeRoll()
        
        let duration: TimeInterval = {
            switch variation {
            case .full: return 1.0
            case .half: return 0.5
            case .double: return 2.0
            case .slow: return 1.5
            case .quick: return 0.6
            }
        }()
        
        // Animate pupil path
        let startTime = Date().timeIntervalSince1970
        Timer.scheduledTimer(withTimeInterval: 0.016, repeats: true) { [weak self] timer in
            guard let self = self, self.isEyeRolling else {
                timer.invalidate()
                return
            }
            
            let elapsed = Date().timeIntervalSince1970 - startTime
            if elapsed >= duration {
                self.isEyeRolling = false
                timer.invalidate()
                return
            }
            
            let progress = elapsed / duration
            
            // v2.1: Figure-8 path (not circle)
            let radius: Double = 6.0
            let verticalScale: Double = 0.7 // Squash the 8 vertically
            
            var pupilX: Double = 0
            var pupilY: Double = 0
            
            if progress < 0.45 {
                // Phase 1: Arc up and out
                let phase1Progress = progress / 0.45
                let angle = phase1Progress * Double.pi * 1.2
                pupilX = sin(angle) * radius
                pupilY = -cos(angle) * radius * verticalScale
                
                // Eyes converge slightly
                let convergence = 0.3
                pupilX *= (1.0 + convergence * phase1Progress)
            } else if progress < 0.85 {
                // Phase 2: Arc down and in, return
                let phase2Progress = (progress - 0.45) / 0.4
                let angle = Double.pi * 1.2 + (phase2Progress * Double.pi * 0.8)
                pupilX = sin(angle) * radius
                pupilY = -cos(angle) * radius * verticalScale
                
                // Continue convergence then diverge
                let convergencePhase = phase2Progress < 0.5 ? phase2Progress : 1.0 - phase2Progress
                pupilX *= (1.0 + 0.3 * (1.0 - convergencePhase * 2.0))
            } else {
                // Phase 3: Settle forward
                let phase3Progress = (progress - 0.85) / 0.15
                pupilX = 0.0 * (1.0 - phase3Progress)
                pupilY = 0.0 * (1.0 - phase3Progress)
            }
            
            // Apply with slight stagger between eyes
            self.state.leftPupilX = pupilX
            self.state.leftPupilY = pupilY
            // Right eye follows with slight delay (handled via stagger delay constant)
            
            // Eyelid behavior
            if progress < 0.25 {
                self.state.leftEyelidTopY = -24 + (progress * 4 * 8)
                self.state.rightEyelidTopY = -24 + (progress * 4 * 8)
            } else if progress < 0.5 {
                self.state.leftEyelidTopY = -8
                self.state.rightEyelidTopY = -8
            } else {
                self.state.leftEyelidTopY = -24
                self.state.rightEyelidTopY = -24
            }
            
            // Eyebrow
            if progress < 0.3 {
                self.state.leftEyebrowY = -12 + (progress * 3.33 * 4)
                self.state.rightEyebrowY = -12 + (progress * 3.33 * 4)
            } else if progress < 0.5 {
                self.state.leftEyebrowY = 0
                self.state.rightEyebrowY = 0
            } else {
                self.state.leftEyebrowY = -8
                self.state.rightEyebrowY = -8
            }
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            self.isEyeRolling = false
            // Reset pupils to center
            self.state.leftPupilX = 0
            self.state.leftPupilY = 0
            self.state.rightPupilX = 0
            self.state.rightPupilY = 0
        }
    }
}
    
    private func startMicroMovements() {
        // Skip if reduced motion enabled
        guard !ReducedMotion.isEnabled else { return }
        
        var time: Double = 0
        var lastMicroSaccadeTime: Double = 0
        var lastRefocusTime: Double = 0
        var lastAttentionDriftTime: Double = 0
        
        microMovementTimer = Timer.scheduledTimer(withTimeInterval: 0.016, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            
            // Only apply micro-movements when idle or in neutral states
            guard self.state.currentState == .idle else {
                return
            }
            
            time += 0.016
            
            // v2.1: Layer 2 - Micro-Saccades (subtle eye life)
            // Small saccades: ±0.8pt, every 200-600ms (random), instant movement
            let microSaccadeInterval = Double.random(in: 0.2...0.6)
            if time - lastMicroSaccadeTime >= microSaccadeInterval {
                lastMicroSaccadeTime = time
                let saccadeX = Double.random(in: -AnimationConstants.microSaccadeRange.lowerBound...AnimationConstants.microSaccadeRange.upperBound)
                let saccadeY = Double.random(in: -AnimationConstants.microSaccadeRange.lowerBound...AnimationConstants.microSaccadeRange.upperBound)
                
                // Instant micro-movement (no animation, feels natural)
                self.state.leftPupilX += saccadeX
                self.state.rightPupilX += saccadeX
                self.state.leftPupilY += saccadeY
                self.state.rightPupilY += saccadeY
            }
            
            // Drift: ±1.5pt, 8-12s cycle, Perlin noise
            let driftCycle = Double.random(in: 8.0...12.0)
            let driftX = self.pupilNoise.noise1D(time / driftCycle) * AnimationConstants.pupilDriftRange.upperBound
            let driftY = self.pupilNoise.noise1D(time / driftCycle + 100) * AnimationConstants.pupilDriftRange.upperBound
            self.state.leftPupilX += driftX * 0.1 // Apply slowly
            self.state.rightPupilX += driftX * 0.1
            self.state.leftPupilY += driftY * 0.1
            self.state.rightPupilY += driftY * 0.1
            
            // Refocus: Every 15-30s, both pupils shift 2-3pt, hold, return
            let refocusInterval = Double.random(in: 15.0...30.0)
            if time - lastRefocusTime >= refocusInterval {
                lastRefocusTime = time
                let refocusX = Double.random(in: 2.0...3.0) * (Bool.random() ? 1 : -1)
                let refocusY = Double.random(in: 1.0...2.0) * (Bool.random() ? 1 : -1)
                
                withAnimation(GrumpEasingCurve.float(duration: 0.3)) {
                    self.state.leftPupilX += refocusX
                    self.state.rightPupilX += refocusX
                    self.state.leftPupilY += refocusY
                    self.state.rightPupilY += refocusY
                }
                
                // Hold then return
                DispatchQueue.main.asyncAfter(deadline: .now() + Double.random(in: 0.5...1.5)) {
                    withAnimation(GrumpEasingCurve.float(duration: 0.5)) {
                        self.state.leftPupilX -= refocusX
                        self.state.rightPupilX -= refocusX
                        self.state.leftPupilY -= refocusY
                        self.state.rightPupilY -= refocusY
                    }
                }
            }
            
            // v2.1: Layer 3 - Attention Simulation
            // Every 4-8s: Pupils briefly drift toward a "point of interest"
            let attentionInterval = Double.random(in: 4.0...8.0)
            if time - lastAttentionDriftTime >= attentionInterval {
                lastAttentionDriftTime = time
                
                // Random spot (10% chance), otherwise subtle drift
                if Double.random(in: 0...1) < 0.1 {
                    // Suspicious scan
                    let scanX = Double.random(in: -3.0...3.0)
                    let scanY = Double.random(in: -2.0...2.0)
                    
                    withAnimation(GrumpEasingCurve.float(duration: 0.8)) {
                        self.state.leftPupilX += scanX
                        self.state.rightPupilX += scanX
                        self.state.leftPupilY += scanY
                        self.state.rightPupilY += scanY
                    }
                    
                    // Return after hold
                    DispatchQueue.main.asyncAfter(deadline: .now() + Double.random(in: 0.5...1.5)) {
                        withAnimation(GrumpEasingCurve.float(duration: 0.8)) {
                            self.state.leftPupilX -= scanX
                            self.state.rightPupilX -= scanX
                            self.state.leftPupilY -= scanY
                            self.state.rightPupilY -= scanY
                        }
                    }
                }
            }
            
            // v2.1: Pupil size continuous drift (always subtly changing)
            let pupilSizeDrift = Double.random(in: AnimationConstants.pupilContinuousDrift.lowerBound...AnimationConstants.pupilContinuousDrift.upperBound)
            self.state.leftPupilSize += pupilSizeDrift * 0.01
            self.state.rightPupilSize += pupilSizeDrift * 0.01
            
            // Clamp pupil size to reasonable range
            self.state.leftPupilSize = max(8.0, min(18.0, self.state.leftPupilSize))
            self.state.rightPupilSize = max(8.0, min(18.0, self.state.rightPupilSize))
            
            // Eyebrow micro-adjust: ±1° rotation, ±1pt Y, 8s cycle
            let eyebrowRotL = self.eyebrowNoise.noise1D(time / 8.0) * 1.0
            let eyebrowRotR = self.eyebrowNoise.noise1D(time / 8.0 + 50) * 1.0
            let eyebrowYL = self.eyebrowNoise.noise1D(time / 8.0 + 25) * 1.0
            let eyebrowYR = self.eyebrowNoise.noise1D(time / 8.0 + 75) * 1.0
            
            // Apply as offsets to base state (5-10% variance for asymmetry)
            let variance = Double.random(in: 0.05...0.10)
            self.state.leftEyebrowX = eyebrowRotL * variance
            self.state.rightEyebrowX = eyebrowRotR * variance * (1.0 + variance) // Asymmetry
            self.state.leftEyebrowY += eyebrowYL * variance * 0.1
            self.state.rightEyebrowY += eyebrowYR * variance * 0.1
        }
    }
    
    deinit {
        blinkTimer?.invalidate()
        breathingTimer?.invalidate()
        idleTimer?.invalidate()
        microMovementTimer?.invalidate()
    }
}


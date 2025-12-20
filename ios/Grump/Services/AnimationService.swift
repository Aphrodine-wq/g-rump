import Foundation
import Combine

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
        state.currentState = newState
        state.lastStateChange = Date()
        
        updateStateForEmotion(newState, previousState: previousState)
    }
    
    func updateEyeTracking(position: CGFloat) {
        withAnimation(.easeOut(duration: AnimationConstants.eyeTrackingSpeed)) {
            eyeTrackingPosition = position
            state.leftPupilX = Double(position)
            state.rightPupilX = Double(position)
        }
    }
    
    func triggerBlink(type: BlinkType? = nil) {
        let blink = type ?? determineBlinkTypeForState()
        blinkType = blink
        
        let duration = blink.duration
        
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
            // Standard blink
            withAnimation(.easeInOut(duration: duration)) {
                isBlinking = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
                withAnimation(.easeInOut(duration: duration)) {
                    self.isBlinking = false
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
        breathingTimer = Timer.scheduledTimer(withTimeInterval: 0.016, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            let (range, duration) = self.getBreathingParamsForState()
            let time = Date().timeIntervalSince1970
            let breathingCycle = sin(time * Double.pi / duration)
            self.state.breathingScale = 1.0 + (breathingCycle * range)
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
            
            // After 10 seconds of idle, start getting bored
            if self.state.idleTime > 10 && self.state.currentState == .idle {
                // Eyes start to close
                withAnimation(.easeInOut(duration: 2.0)) {
                    self.state.leftEyeScaleY = 0.3
                    self.state.rightEyeScaleY = 0.3
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
            let angle = progress * 2 * Double.pi
            let radius: Double = 6.0
            
            self.state.leftPupilX = cos(angle) * radius
            self.state.leftPupilY = sin(angle) * radius
            self.state.rightPupilX = cos(angle) * radius
            self.state.rightPupilY = sin(angle) * radius
            
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

enum EyeRollVariation {
    case full
    case half
    case double
    case slow
    case quick
}
    
    private func startMicroMovements() {
        // Skip if reduced motion enabled
        guard !ReducedMotion.isEnabled else { return }
        
        var time: Double = 0
        
        microMovementTimer = Timer.scheduledTimer(withTimeInterval: 0.016, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            
            // Only apply micro-movements when idle or in neutral states
            guard self.state.currentState == .idle || self.state.currentState == .neutral else {
                return
            }
            
            time += 0.016
            
            // Pupil drift: ±2pt, 5s cycle
            let pupilX = self.pupilNoise.noise1D(time / 5.0) * 2.0
            let pupilY = self.pupilNoise.noise1D(time / 5.0 + 100) * 2.0
            self.state.leftPupilX = pupilX
            self.state.rightPupilX = pupilX + 0.5 // Slight offset for depth
            self.state.leftPupilY = pupilY
            self.state.rightPupilY = pupilY
            
            // Eyebrow micro-adjust: ±1° rotation, ±1pt Y, 8s cycle
            let eyebrowRotL = self.eyebrowNoise.noise1D(time / 8.0) * 1.0
            let eyebrowRotR = self.eyebrowNoise.noise1D(time / 8.0 + 50) * 1.0
            let eyebrowYL = self.eyebrowNoise.noise1D(time / 8.0 + 25) * 1.0
            let eyebrowYR = self.eyebrowNoise.noise1D(time / 8.0 + 75) * 1.0
            
            // Apply as offsets to base state
            if self.state.currentState == .idle {
                self.state.leftEyebrowX = eyebrowRotL
                self.state.rightEyebrowX = eyebrowRotR
                // Y is already set by expression, so we add micro-adjustment
                // (In practice, we'd store base Y and apply offset)
            }
            
            // Head micro-tilt: ±0.5°, 10s cycle (applied via face rotation in view)
            // This would be handled in the view layer
            
            // Mouth micro-movement: ±1pt width, ±0.5pt depth, 6s cycle
            let mouthWidthOffset = self.mouthNoise.noise1D(time / 6.0) * 1.0
            let mouthDepthOffset = self.mouthNoise.noise1D(time / 6.0 + 30) * 0.5
            // Applied as offsets to base mouth state
        }
    }
    
    deinit {
        blinkTimer?.invalidate()
        breathingTimer?.invalidate()
        idleTimer?.invalidate()
        microMovementTimer?.invalidate()
    }
}


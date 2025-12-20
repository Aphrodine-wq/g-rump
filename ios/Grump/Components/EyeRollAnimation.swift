import SwiftUI

struct EyeRollAnimation: View {
    @State private var rollPhase: Double = 0
    @State private var isRolling: Bool = false
    let duration: TimeInterval
    let variation: EyeRollVariation
    
    enum EyeRollVariation {
        case full
        case half
        case double
        case slow
        case quick
    }
    
    var body: some View {
        TimelineView(.periodic(from: .now, by: 0.016)) { context in
            if isRolling {
                let time = context.date.timeIntervalSince1970
                let progress = (time.truncatingRemainder(dividingBy: duration)) / duration
                
                // Calculate pupil position on circular path
                let angle = progress * 2 * Double.pi
                let radius: Double = 6.0
                let pupilX = cos(angle) * radius
                let pupilY = sin(angle) * radius
                
                // Eyelid behavior
                let eyelidY: Double = {
                    if progress < 0.25 {
                        return -24 + (progress * 4 * 8) // Rising
                    } else if progress < 0.5 {
                        return -8 // Squinting
                    } else {
                        return -24 // Relaxed
                    }
                }()
                
                // Eyebrow behavior
                let eyebrowY: Double = {
                    if progress < 0.3 {
                        return -12 + (progress * 3.33 * 4) // Raising
                    } else if progress < 0.5 {
                        return 0 // Furrowed
                    } else {
                        return -8 // Settling
                    }
                }()
                
                // Head tilt
                let headRotation: Double = progress < 0.25 ? -2 * (progress * 4) : 0
                
                EyeRollState(
                    pupilX: pupilX,
                    pupilY: pupilY,
                    eyelidY: eyelidY,
                    eyebrowY: eyebrowY,
                    headRotation: headRotation
                )
            }
        }
        .onAppear {
            startRoll()
        }
    }
    
    private func startRoll() {
        isRolling = true
        HapticService.shared.eyeRoll()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            isRolling = false
        }
    }
}

struct EyeRollState {
    let pupilX: Double
    let pupilY: Double
    let eyelidY: Double
    let eyebrowY: Double
    let headRotation: Double
}


import Foundation
import SwiftUI

/// Grump-specific easing curves for natural, character-appropriate animations
enum GrumpEasingCurve {
    /// grumpSnap - For irritated, assertive movements
    /// Quick start, slight overshoot, sharp settle
    /// Use for: eyebrow furrows, annoyed blinks, message slams
    static let snap = Animation.timingCurve(0.68, -0.1, 0.27, 1.2)
    
    /// grumpSettle - For reluctant, heavy movements
    /// Slow acceleration, no overshoot, weighted landing
    /// Use for: sighs, sleepy eyelids, giving up
    static let settle = Animation.timingCurve(0.34, 0.8, 0.64, 1)
    
    /// grumpFloat - For ambient/idle movements
    /// Nearly linear but slightly softer
    /// Use for: breathing, micro-movements, pupil drift
    static let float = Animation.timingCurve(0.45, 0.05, 0.55, 0.95)
    
    /// grumpBounce - For rare positive reactions
    /// Enthusiastic overshoot with bounce
    /// Use for: impressed reaction, birthday hat, rare almost-smile
    static let bounce = Animation.timingCurve(0.175, 0.885, 0.32, 1.4)
    
    /// grumpMechanical - For glitch/error states only
    /// Intentionally slightly robotic
    /// Use for: ERROR state, processing glitches
    static let mechanical = Animation.timingCurve(0.25, 0.1, 0.25, 1)
    
    /// Helper to get curve with duration
    static func snap(duration: Double) -> Animation {
        Animation.timingCurve(0.68, -0.1, 0.27, 1.2, duration: duration)
    }
    
    static func settle(duration: Double) -> Animation {
        Animation.timingCurve(0.34, 0.8, 0.64, 1, duration: duration)
    }
    
    static func float(duration: Double) -> Animation {
        Animation.timingCurve(0.45, 0.05, 0.55, 0.95, duration: duration)
    }
    
    static func bounce(duration: Double) -> Animation {
        Animation.timingCurve(0.175, 0.885, 0.32, 1.4, duration: duration)
    }
    
    static func mechanical(duration: Double) -> Animation {
        Animation.timingCurve(0.25, 0.1, 0.25, 1, duration: duration)
    }
}

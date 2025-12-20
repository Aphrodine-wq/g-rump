import SwiftUI

struct ReducedMotion {
    static var isEnabled: Bool {
        #if os(iOS)
        return UIAccessibility.isReduceMotionEnabled
        #else
        return false
        #endif
    }
    
    static func animation(duration: TimeInterval = 0.2) -> Animation {
        if isEnabled {
            return .linear(duration: duration)
        } else {
            return .spring(response: 0.3, dampingFraction: 0.7)
        }
    }
    
    static func shouldDisable(_ animationType: AnimationType) -> Bool {
        guard isEnabled else { return false }
        
        switch animationType {
        case .eyeRoll, .screenShake, .messageSlam, .particles, .bounce, .spring, .microMovements, .techGrid:
            return true
        case .blink, .expressionTransition, .glow, .breathing:
            return false
        }
    }
}

enum AnimationType {
    case eyeRoll
    case screenShake
    case messageSlam
    case particles
    case bounce
    case spring
    case microMovements
    case techGrid
    case blink
    case expressionTransition
    case glow
    case breathing
}


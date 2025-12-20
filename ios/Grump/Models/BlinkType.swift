import Foundation

/// Types of blinks for different emotional states
enum BlinkType: String {
    case standard
    case slow
    case heavy
    case quickDouble
    case half
    case wink
    
    var duration: TimeInterval {
        switch self {
        case .standard:
            return AnimationConstants.blinkDuration // 180ms
        case .slow:
            return AnimationConstants.blinkDuration * 2.0 // 360ms
        case .heavy:
            return AnimationConstants.blinkDuration * 3.0 // 540ms
        case .quickDouble:
            return AnimationConstants.blinkDuration * 0.7 // ~126ms per blink
        case .half:
            return AnimationConstants.blinkDuration * 0.5 // 90ms
        case .wink:
            return AnimationConstants.blinkDuration * 1.1 // ~198ms
        }
    }
}

/// Variation types for eye roll animations
enum EyeRollVariation {
    case full
    case half
    case double
    case slow
    case quick
}

import Foundation

enum BlinkType {
    case standard  // 150ms
    case slow      // 400ms
    case heavy     // 600ms
    case quickDouble // 250ms total
    case half      // 100ms
    case wink      // 200ms, one eye only
    
    var duration: TimeInterval {
        switch self {
        case .standard: return 0.15
        case .slow: return 0.4
        case .heavy: return 0.6
        case .quickDouble: return 0.125 // per blink
        case .half: return 0.1
        case .wink: return 0.2
        }
    }
}


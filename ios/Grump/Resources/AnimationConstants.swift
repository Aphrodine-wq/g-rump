import Foundation
import SwiftUI

struct AnimationConstants {
    // Avatar
    static let avatarSize: CGFloat = 120
    
    // Eye tracking
    static let eyeTrackingSpeed: TimeInterval = 0.1
    static let eyeTrackingRange: CGFloat = 6.0
    
    // Blinking
    static let blinkDuration: TimeInterval = 0.15
    static let blinkInterval: ClosedRange<Double> = 3.0...6.0
    
    // Breathing
    static let breathingDuration: TimeInterval = 3.0
    
    // Spring animations
    static let springResponse: Double = 0.3
    static let springDamping: Double = 0.7
    
    // Message animations
    static let messageSlamDuration: TimeInterval = 0.4
    static let messageShakeDuration: TimeInterval = 0.1
    static let messageShakeAmount: CGFloat = 5.0
    
    // Typing
    static let typingSpeedNormal: Double = 30.0 // characters per second
    static let typingSpeedFast: Double = 50.0
    static let typingSpeedThoughtful: Double = 20.0
}

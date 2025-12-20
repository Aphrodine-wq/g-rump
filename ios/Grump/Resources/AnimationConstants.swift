import Foundation
import SwiftUI

struct AnimationConstants {
    // Avatar
    static let avatarSize: CGFloat = 120
    
    // Eye tracking (v2.1 refined)
    static let eyeTrackingSpeed: TimeInterval = 0.1 // Uses grumpFloat curve
    static let eyeTrackingRange: CGFloat = 6.0
    static let pupilMaxVelocity: CGFloat = 40.0 // pts/sec (prevents snapping)
    static let pupilAccelerationTime: TimeInterval = 0.05 // 50ms
    static let pupilDecelerationTime: TimeInterval = 0.03 // 30ms
    static let pupilStaggerDelay: TimeInterval = 0.02 // 20ms (left leads)
    
    // Blinking (v2.1 refined - 180ms total with hold)
    static let blinkDuration: TimeInterval = 0.18 // Updated from 0.15
    static let blinkHoldTime: TimeInterval = 0.02 // 20ms hold at closed (prevents flutter)
    static let blinkDownDuration: TimeInterval = 0.07 // 70ms down (uses grumpSnap * 0.8)
    static let blinkUpDuration: TimeInterval = 0.09 // 90ms up (uses grumpSettle * 1.2)
    static let blinkInterval: ClosedRange<Double> = 3.0...6.0
    static let blinkSpeedVariance: Double = 0.15 // ±15% per blink
    static let blinkAsymmetryChance: Double = 0.05 // 5% of blinks slightly uneven
    
    // Breathing (v2.1 refined - layered system)
    static let breathingDuration: TimeInterval = 3.2 // Updated from 3.0
    static let breathingScaleY: ClosedRange<Double> = 0.99...1.01 // Primary breath (Y-axis)
    static let breathingScaleX: ClosedRange<Double> = 0.999...1.001 // Secondary breath (X-axis, inverse)
    static let eyeBreathingScale: ClosedRange<Double> = 0.995...1.005 // Eyes "breathe" too
    static let eyebrowBreathingOffset: CGFloat = 0.5 // +0.5pt at inhale peak
    static let mouthBreathingHeight: CGFloat = 0.3 // +0.3pt at exhale
    
    // Expression transitions (v2.1 component stagger)
    static let transitionEyebrowDelay: TimeInterval = 0.0 // Leads (0ms)
    static let transitionEyelidDelay: TimeInterval = 0.03 // 30ms
    static let transitionEyeWhiteDelay: TimeInterval = 0.05 // 50ms
    static let transitionPupilDelay: TimeInterval = 0.06 // 60ms
    static let transitionMouthDelay: TimeInterval = 0.08 // 80ms
    static let transitionGlowDelay: TimeInterval = 0.10 // 100ms
    static let transitionMinDuration: TimeInterval = 0.20 // 200ms minimum
    static let transitionMaxDuration: TimeInterval = 0.50 // 500ms maximum (except sleepy)
    
    // Component drag values (parent-child lag)
    static let dragEyebrows: Double = 0.15
    static let dragEyes: Double = 0.1
    static let dragPupils: Double = 0.25
    static let dragMouth: Double = 0.2
    static let dragMoodGlow: Double = 0.4
    static let dragAccessories: Double = 0.5
    
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
    
    // Pupil dynamics (v2.1)
    static let pupilBaseSize: CGFloat = 12.0
    static let pupilSizeTransitionDuration: TimeInterval = 0.2 // 200ms
    static let pupilLightLevelDrift: ClosedRange<CGFloat> = -1.0...1.0 // ±1pt
    static let pupilEmotionalIntensity: ClosedRange<CGFloat> = -2.0...2.0 // ±2pt
    static let pupilFocusIntensity: ClosedRange<CGFloat> = -1.5...1.5 // ±1.5pt
    static let pupilContinuousDrift: ClosedRange<CGFloat> = -0.5...0.5 // Always subtly changing
    
    // Eye roll (v2.1 refined path - figure 8, not circle)
    static let eyeRollDuration: TimeInterval = 1.0 // 1000ms
    static let eyeRollAnticipationTime: TimeInterval = 0.08 // 80ms
    static let eyeRollSettleTime: TimeInterval = 0.15 // 150ms at end
    
    // Idle system (v2.1 layered)
    static let microSaccadeRange: ClosedRange<CGFloat> = -0.8...0.8 // ±0.8pt
    static let microSaccadeInterval: ClosedRange<TimeInterval> = 0.2...0.6 // 200-600ms
    static let pupilDriftRange: ClosedRange<CGFloat> = -1.5...1.5 // ±1.5pt
    static let pupilDriftCycle: ClosedRange<TimeInterval> = 8.0...12.0 // 8-12s
    static let pupilRefocusInterval: ClosedRange<TimeInterval> = 15.0...30.0 // 15-30s
    static let attentionDriftInterval: ClosedRange<TimeInterval> = 4.0...8.0 // 4-8s
    
    // Emotion buffer system
    static let minExpressionHoldTime: TimeInterval = 0.4 // 400ms (except ERROR)
    static let expressionIntensificationRate: Double = 0.05 // +5% on re-trigger
    
    // Rest periods
    static let restPostExpression: TimeInterval = 0.4 // 400ms minimum
    static let restPostMajorAnimation: TimeInterval = 0.6 // 600ms minimum
    static let restPostInteraction: TimeInterval = 0.2 // 200ms before idle resumes
    
    // Face container movement
    static let faceContainerTiltRange: ClosedRange<Double> = 0.3...0.8 // degrees
    static let faceContainerDrag: Double = 0.05 // Subtle lag for all children
}

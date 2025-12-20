import Foundation

/// Transition matrix defining how expression changes should behave
struct TransitionMatrix {
    enum TransitionType {
        case direct          // Standard transition
        case gradualSettle   // Slow return to baseline
        case escalation      // Quick snap, building intensity
        case coolDown        // Slow de-escalation
        case crossfade       // Related expressions
        case gentle          // No sudden movements
        case glitchIn        // Intentionally jarring
        case glitchOut       // Shake-off, reboot feel
        case progressive     // Per-stage transitions
        case startle         // If interrupted
    }
    
    struct TransitionSpec {
        let type: TransitionType
        let duration: TimeInterval
        let specialBehavior: String?
    }
    
    /// Get transition spec for a state change
    static func getTransition(from: EmotionalState, to: EmotionalState) -> TransitionSpec {
        // Any → Neutral: Gradual settle
        if to == .idle {
            return TransitionSpec(
                type: .gradualSettle,
                duration: 0.35,
                specialBehavior: "Slow return to baseline"
            )
        }
        
        // Neutral → Any: Direct
        if from == .idle {
            return TransitionSpec(
                type: .direct,
                duration: 0.20,
                specialBehavior: "Standard transition"
            )
        }
        
        // Annoyed → MaximumGrump: Escalation
        if from == .annoyed && to == .maximumGrump {
            return TransitionSpec(
                type: .escalation,
                duration: 0.15,
                specialBehavior: "Quick snap, building intensity"
            )
        }
        
        // MaximumGrump → Neutral/Idle: Cool-down
        if from == .maximumGrump && (to == .idle || to == .annoyed) {
            return TransitionSpec(
                type: .coolDown,
                duration: 0.60,
                specialBehavior: "Slow de-escalation, breathing"
            )
        }
        
        // Skeptical ↔ Smug: Crossfade
        if (from == .skeptical && to == .smug) || (from == .smug && to == .skeptical) {
            return TransitionSpec(
                type: .crossfade,
                duration: 0.18,
                specialBehavior: "Related expressions"
            )
        }
        
        // Any → SoftMode: Gentle
        if to == .softMode {
            return TransitionSpec(
                type: .gentle,
                duration: 0.40,
                specialBehavior: "No sudden movements"
            )
        }
        
        // SoftMode → Any: Gradual
        if from == .softMode {
            return TransitionSpec(
                type: .gentle,
                duration: 0.30,
                specialBehavior: "Respectful exit"
            )
        }
        
        // Any → Error: Glitch-in
        if to == .error {
            return TransitionSpec(
                type: .glitchIn,
                duration: 0.10,
                specialBehavior: "Intentionally jarring"
            )
        }
        
        // Error → Any: Glitch-out
        if from == .error {
            return TransitionSpec(
                type: .glitchOut,
                duration: 0.25,
                specialBehavior: "Shake-off, reboot feel"
            )
        }
        
        // Any → Sleepy: Progressive
        if to == .sleepy || to == .sleep {
            return TransitionSpec(
                type: .progressive,
                duration: 0.50, // Per stage, see sleep system
                specialBehavior: "Progressive stages"
            )
        }
        
        // Sleepy → Alert: Startle
        if (from == .sleepy || from == .sleep) && to != .sleepy && to != .sleep {
            return TransitionSpec(
                type: .startle,
                duration: 0.20,
                specialBehavior: "If interrupted"
            )
        }
        
        // Default: Direct transition
        return TransitionSpec(
            type: .direct,
            duration: 0.25,
            specialBehavior: nil
        )
    }
    
    /// Check if transition should be allowed (emotion buffer system)
    static func shouldAllowTransition(
        from: EmotionalState,
        to: EmotionalState,
        lastChangeTime: Date,
        minHoldTime: TimeInterval = AnimationConstants.minExpressionHoldTime
    ) -> Bool {
        let timeSinceChange = Date().timeIntervalSince(lastChangeTime)
        
        // ERROR can always transition (no buffer)
        if from == .error {
            return true
        }
        
        // Must hold minimum time (except escalating emotions)
        if timeSinceChange < minHoldTime {
            // Allow escalating transitions (annoyed → max)
            if from == .annoyed && to == .maximumGrump {
                return true
            }
            return false
        }
        
        return true
    }
}

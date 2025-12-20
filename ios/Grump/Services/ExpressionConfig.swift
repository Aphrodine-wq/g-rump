import Foundation

struct ExpressionConfig {
    static func getComponentStates(for expression: EmotionalState) -> ExpressionComponents {
        switch expression {
        case .idle:
            return ExpressionComponents(
                leftEyebrowRotation: -5,
                rightEyebrowRotation: 5,
                leftEyebrowY: 0,
                rightEyebrowY: 0,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 1.0,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 1.0,
                leftPupilSize: 12,
                rightPupilSize: 12,
                leftEyelidTopY: -24,
                rightEyelidTopY: -24,
                mouthState: .flat,
                mouthWidth: 40,
                mouthCurveDepth: 0,
                glowIntensity: 0.4,
                glowPulseRate: 2.0,
                glowColor: .red
            )
            
        case .listening:
            return ExpressionComponents(
                leftEyebrowRotation: -3,
                rightEyebrowRotation: 3,
                leftEyebrowY: -4,
                rightEyebrowY: -4,
                leftEyeScaleX: 1.05,
                leftEyeScaleY: 1.1,
                rightEyeScaleX: 1.05,
                rightEyeScaleY: 1.1,
                leftPupilSize: 14,
                rightPupilSize: 14,
                leftEyelidTopY: -24,
                rightEyelidTopY: -24,
                mouthState: .flat,
                mouthWidth: 36,
                mouthCurveDepth: 0,
                glowIntensity: 0.6,
                glowPulseRate: 1.0,
                glowColor: .orange
            )
            
        case .processing:
            return ExpressionComponents(
                leftEyebrowRotation: -12,
                rightEyebrowRotation: 12,
                leftEyebrowY: 4,
                rightEyebrowY: 4,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.9,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.9,
                leftPupilSize: 10,
                rightPupilSize: 10,
                leftEyelidTopY: -18,
                rightEyelidTopY: -18,
                mouthState: .pursed,
                mouthWidth: 16,
                mouthCurveDepth: 0,
                glowIntensity: 0.5,
                glowPulseRate: 1.5,
                glowColor: .orange
            )
            
        case .responding:
            return ExpressionComponents(
                leftEyebrowRotation: -5,
                rightEyebrowRotation: 5,
                leftEyebrowY: 0,
                rightEyebrowY: 0,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 1.0,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 1.0,
                leftPupilSize: 12,
                rightPupilSize: 12,
                leftEyelidTopY: -24,
                rightEyelidTopY: -24,
                mouthState: .open,
                mouthWidth: 12,
                mouthCurveDepth: 0,
                glowIntensity: 0.3,
                glowPulseRate: 2.0,
                glowColor: .red
            )
            
        case .skeptical:
            return ExpressionComponents(
                leftEyebrowRotation: -5,
                rightEyebrowRotation: -18,
                leftEyebrowY: 0,
                rightEyebrowY: -10,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.85,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 1.1,
                leftPupilSize: 10,
                rightPupilSize: 12,
                leftEyelidTopY: -16,
                rightEyelidTopY: -24,
                mouthState: .smirk,
                mouthWidth: 44,
                mouthCurveDepth: -2,
                glowIntensity: 0.4,
                glowPulseRate: 1.5,
                glowColor: .red
            )
            
        case .annoyed:
            return ExpressionComponents(
                leftEyebrowRotation: -18,
                rightEyebrowRotation: 18,
                leftEyebrowY: 6,
                rightEyebrowY: 6,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.8,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.8,
                leftPupilSize: 10,
                rightPupilSize: 10,
                leftEyelidTopY: -14,
                rightEyelidTopY: -14,
                mouthState: .tight,
                mouthWidth: 36,
                mouthCurveDepth: 0,
                glowIntensity: 0.6,
                glowPulseRate: 1.2,
                glowColor: .red
            )
            
        case .maximumGrump:
            return ExpressionComponents(
                leftEyebrowRotation: -25,
                rightEyebrowRotation: 25,
                leftEyebrowY: 8,
                rightEyebrowY: 8,
                leftEyeScaleX: 0.95,
                leftEyeScaleY: 0.6,
                rightEyeScaleX: 0.95,
                rightEyeScaleY: 0.6,
                leftPupilSize: 8,
                rightPupilSize: 8,
                leftEyelidTopY: -6,
                rightEyelidTopY: -6,
                leftEyelidBottomY: 8,
                rightEyelidBottomY: 8,
                mouthState: .exaggeratedFrown,
                mouthWidth: 48,
                mouthCurveDepth: 12,
                glowIntensity: 0.8,
                glowPulseRate: 0.8,
                glowColor: .intense
            )
            
        case .impressed:
            return ExpressionComponents(
                leftEyebrowRotation: 2,
                rightEyebrowRotation: -2,
                leftEyebrowY: -8,
                rightEyebrowY: -8,
                leftEyeScaleX: 1.05,
                leftEyeScaleY: 1.15,
                rightEyeScaleX: 1.05,
                rightEyeScaleY: 1.15,
                leftPupilSize: 14,
                rightPupilSize: 14,
                leftEyelidTopY: -24,
                rightEyelidTopY: -24,
                mouthState: .almostSmile,
                mouthWidth: 42,
                mouthCurveDepth: -3,
                glowIntensity: 0.5,
                glowPulseRate: 1.8,
                glowColor: .orange
            )
            
        case .suspicious:
            return ExpressionComponents(
                leftEyebrowRotation: -20,
                rightEyebrowRotation: -8,
                leftEyebrowY: 4,
                rightEyebrowY: -4,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.75,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.9,
                leftPupilSize: 10,
                rightPupilSize: 10,
                leftEyelidTopY: -12,
                rightEyelidTopY: -18,
                mouthState: .tight,
                mouthWidth: 32,
                mouthCurveDepth: 0,
                glowIntensity: 0.4,
                glowPulseRate: 1.8,
                glowColor: .red
            )
            
        case .softMode:
            return ExpressionComponents(
                leftEyebrowRotation: 5,
                rightEyebrowRotation: -5,
                leftEyebrowY: 2,
                rightEyebrowY: 2,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 1.0,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 1.0,
                leftPupilSize: 13,
                rightPupilSize: 13,
                leftEyelidTopY: -20,
                rightEyelidTopY: -20,
                mouthState: .neutral,
                mouthWidth: 38,
                mouthCurveDepth: 0,
                glowIntensity: 0.2,
                glowPulseRate: 2.5,
                glowColor: .soft
            )
            
        case .sleepy:
            return ExpressionComponents(
                leftEyebrowRotation: 8,
                rightEyebrowRotation: -8,
                leftEyebrowY: 6,
                rightEyebrowY: 6,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.5,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.5,
                leftPupilSize: 10,
                rightPupilSize: 10,
                leftEyelidTopY: -6,
                rightEyelidTopY: -6,
                mouthState: .flat,
                mouthWidth: 36,
                mouthCurveDepth: 0,
                glowIntensity: 0.2,
                glowPulseRate: 4.0,
                glowColor: .soft
            )
            
        case .error:
            return ExpressionComponents(
                leftEyebrowRotation: -10,
                rightEyebrowRotation: 15,
                leftEyebrowY: -4,
                rightEyebrowY: 2,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 1.1,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.9,
                leftPupilSize: 8,
                rightPupilSize: 8,
                leftEyelidTopY: -24,
                rightEyelidTopY: -16,
                mouthState: .wavy,
                mouthWidth: 40,
                mouthCurveDepth: 0,
                glowIntensity: 0.6,
                glowPulseRate: 0.5,
                glowColor: .intense
            )
            
        case .thinkingDeep:
            return ExpressionComponents(
                leftEyebrowRotation: -15,
                rightEyebrowRotation: 15,
                leftEyebrowY: 2,
                rightEyebrowY: 2,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.95,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.95,
                leftPupilSize: 11,
                rightPupilSize: 11,
                leftEyelidTopY: -20,
                rightEyelidTopY: -20,
                mouthState: .muttering,
                mouthWidth: 38,
                mouthCurveDepth: 0,
                glowIntensity: 0.5,
                glowPulseRate: 1.2,
                glowColor: .orange
            )
            
        case .smug:
            return ExpressionComponents(
                leftEyebrowRotation: -5,
                rightEyebrowRotation: -20,
                leftEyebrowY: -4,
                rightEyebrowY: -8,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.9,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.9,
                leftPupilSize: 12,
                rightPupilSize: 12,
                leftEyelidTopY: -18,
                rightEyelidTopY: -18,
                mouthState: .smirk,
                mouthWidth: 44,
                mouthCurveDepth: -2,
                glowIntensity: 0.5,
                glowPulseRate: 1.5,
                glowColor: .red
            )
            
        case .exasperatedSigh:
            return ExpressionComponents(
                leftEyebrowRotation: -8,
                rightEyebrowRotation: 8,
                leftEyebrowY: 4,
                rightEyebrowY: 4,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.85,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.85,
                leftPupilSize: 11,
                rightPupilSize: 11,
                leftEyelidTopY: -22,
                rightEyelidTopY: -22,
                mouthState: .open,
                mouthWidth: 14,
                mouthCurveDepth: 0,
                glowIntensity: 0.4,
                glowPulseRate: 2.0,
                glowColor: .red
            )
            
        case .reluctantAgreement:
            return ExpressionComponents(
                leftEyebrowRotation: -3,
                rightEyebrowRotation: 3,
                leftEyebrowY: 0,
                rightEyebrowY: 0,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 1.0,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 1.0,
                leftPupilSize: 12,
                rightPupilSize: 12,
                leftEyelidTopY: -24,
                rightEyelidTopY: -24,
                mouthState: .flat,
                mouthWidth: 40,
                mouthCurveDepth: 0,
                glowIntensity: 0.3,
                glowPulseRate: 2.0,
                glowColor: .red
            )
            
        case .sleep:
            return ExpressionComponents(
                leftEyebrowRotation: 8,
                rightEyebrowRotation: -8,
                leftEyebrowY: 6,
                rightEyebrowY: 6,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.0,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.0,
                leftEyelidTopY: 18,
                rightEyelidTopY: 18,
                mouthState: .flat,
                mouthWidth: 36,
                mouthCurveDepth: 0,
                glowIntensity: 0.1,
                glowPulseRate: 4.0,
                glowColor: .soft
            )
            
        case .jumpscare:
            return ExpressionComponents(
                leftEyebrowRotation: 0,
                rightEyebrowRotation: 0,
                leftEyebrowY: -12,
                rightEyebrowY: -12,
                leftEyeScaleX: 1.2,
                leftEyeScaleY: 1.3,
                rightEyeScaleX: 1.2,
                rightEyeScaleY: 1.3,
                leftPupilSize: 6,
                rightPupilSize: 6,
                leftEyelidTopY: -24,
                rightEyelidTopY: -24,
                mouthState: .open,
                mouthWidth: 16,
                mouthCurveDepth: 0,
                glowIntensity: 0.7,
                glowPulseRate: 1.0,
                glowColor: .intense
            )
            
        case .birthday:
            return ExpressionComponents(
                leftEyebrowRotation: -12,
                rightEyebrowRotation: 12,
                leftEyebrowY: 4,
                rightEyebrowY: 4,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.9,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.9,
                leftPupilSize: 11,
                rightPupilSize: 11,
                leftEyelidTopY: -18,
                rightEyelidTopY: -18,
                mouthState: .tight,
                mouthWidth: 38,
                mouthCurveDepth: 0,
                glowIntensity: 0.4,
                glowPulseRate: 1.5,
                glowColor: .red
            )
            
        case .threeAM:
            return ExpressionComponents(
                leftEyebrowRotation: -8,
                rightEyebrowRotation: 8,
                leftEyebrowY: 4,
                rightEyebrowY: 4,
                leftEyeScaleX: 1.0,
                leftEyeScaleY: 0.6,
                rightEyeScaleX: 1.0,
                rightEyeScaleY: 0.6,
                leftPupilSize: 10,
                rightPupilSize: 10,
                leftEyelidTopY: -8,
                rightEyelidTopY: -8,
                mouthState: .flat,
                mouthWidth: 36,
                mouthCurveDepth: 0,
                glowIntensity: 0.3,
                glowPulseRate: 3.0,
                glowColor: .soft
            )
        }
    }
}

struct ExpressionComponents {
    var leftEyebrowRotation: Double = 0
    var rightEyebrowRotation: Double = 0
    var leftEyebrowY: Double = 0
    var rightEyebrowY: Double = 0
    var leftEyebrowX: Double = 0
    var rightEyebrowX: Double = 0
    var leftEyeScaleX: Double = 1.0
    var leftEyeScaleY: Double = 1.0
    var rightEyeScaleX: Double = 1.0
    var rightEyeScaleY: Double = 1.0
    var leftPupilSize: Double = 12
    var rightPupilSize: Double = 12
    var leftEyelidTopY: Double = -24
    var rightEyelidTopY: Double = -24
    var leftEyelidBottomY: Double = 20
    var rightEyelidBottomY: Double = 20
    var mouthState: MouthState = .flat
    var mouthWidth: Double = 40
    var mouthCurveDepth: Double = 0
    var glowIntensity: Double = 0.4
    var glowPulseRate: Double = 2.0
    var glowColor: GlowColor = .red
}


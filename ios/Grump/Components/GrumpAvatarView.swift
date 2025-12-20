import SwiftUI

struct GrumpAvatarView: View {
    let animationState: AnimationState
    let isBlinking: Bool
    let blinkType: BlinkType
    let eyeTrackingPosition: CGFloat
    let scale: CGFloat
    let useSimplified: Bool
    
    init(
        animationState: AnimationState,
        isBlinking: Bool,
        eyeTrackingPosition: CGFloat = 0,
        blinkType: BlinkType = .standard,
        scale: CGFloat? = nil
    ) {
        self.animationState = animationState
        self.isBlinking = isBlinking
        self.eyeTrackingPosition = eyeTrackingPosition
        self.blinkType = blinkType
        self.scale = scale ?? DeviceSize.getScale()
        self.useSimplified = DeviceSize.shouldUseSimplifiedVersion()
    }
    
    var body: some View {
        if useSimplified {
            SimplifiedFaceRigView(
                animationState: animationState,
                isBlinking: isBlinking,
                scale: scale
            )
        } else {
            EnhancedFaceRigView(
                animationState: animationState,
                isBlinking: isBlinking,
                blinkType: blinkType,
                eyeTrackingPosition: eyeTrackingPosition,
                scale: scale
            )
        }
    }
}

struct SimplifiedFaceRigView: View {
    let animationState: AnimationState
    let isBlinking: Bool
    let scale: CGFloat
    
    var body: some View {
        ZStack {
            // Simplified: Just face base, eyes, pupils, eyebrows, mouth
            // No tech grid, no outer glow, no eyelids
            
            // Face base
            RoundedRectangle(cornerRadius: 48 * scale)
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "2A2A2A"), Color(hex: "1A1A1A")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 280 * scale, height: 280 * scale)
            
            // Eyes
            EyeWhiteView(side: .left, scaleX: animationState.leftEyeScaleX, scaleY: animationState.leftEyeScaleY, scale: scale)
            EyeWhiteView(side: .right, scaleX: animationState.rightEyeScaleX, scaleY: animationState.rightEyeScaleY, scale: scale)
            
            // Pupils
            if animationState.leftEyeScaleY > 0.1 {
                PupilView(side: .left, x: animationState.leftPupilX, y: animationState.leftPupilY, size: animationState.leftPupilSize, scale: scale)
            }
            if animationState.rightEyeScaleY > 0.1 {
                PupilView(side: .right, x: animationState.rightPupilX, y: animationState.rightPupilY, size: animationState.rightPupilSize, scale: scale)
            }
            
            // Eyebrows
            EnhancedEyebrowView(side: .left, rotation: animationState.leftEyebrowRotation, yOffset: animationState.leftEyebrowY, xOffset: animationState.leftEyebrowX, scale: scale)
            EnhancedEyebrowView(side: .right, rotation: animationState.rightEyebrowRotation, yOffset: animationState.rightEyebrowY, xOffset: animationState.rightEyebrowX, scale: scale)
            
            // Mouth
            EnhancedMouthView(state: animationState.mouthState, width: animationState.mouthWidth, curveDepth: animationState.mouthCurveDepth, scale: scale)
            
            // Inner glow only (no outer)
            MoodGlowInnerView(intensity: animationState.glowIntensity, pulseRate: animationState.glowPulseRate, color: animationState.glowColor, scale: scale)
        }
        .frame(width: 400 * scale, height: 400 * scale)
    }
}


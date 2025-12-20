import SwiftUI

struct EnhancedFaceRigView: View {
    let animationState: AnimationState
    let isBlinking: Bool
    let blinkType: BlinkType
    let eyeTrackingPosition: CGFloat
    let scale: CGFloat
    
    // Canvas: 1600x1600pt (4K support), Face: 1120x1120pt
    // Upgraded from 400x400pt for crisp rendering on high-DPI displays
    private let canvasSize: CGFloat = DeviceSize.getBaseCanvasSize()  // 1600pt
    private let faceSize: CGFloat = 1120  // Scaled proportionally (280 * 4)
    private let cornerRadius: CGFloat = 192  // Scaled proportionally (48 * 4)
    
    var body: some View {
        // Performance: Limit animated layers
        let animatedLayerCount = 15 // All layers potentially animated
        // In production, would track and limit based on PerformanceOptimizer.maxAnimatedLayers
        
        return ZStack {
            // Layer 0: FACE_BASE
            FaceBaseView(scale: scale, showTechGrid: !ReducedMotion.shouldDisable(.techGrid))
            
            // Layer 1: EYE_WHITE_LEFT
            EyeWhiteView(
                side: .left,
                scaleX: animationState.leftEyeScaleX,
                scaleY: animationState.leftEyeScaleY,
                scale: scale
            )
            
            // Layer 2: EYE_WHITE_RIGHT
            EyeWhiteView(
                side: .right,
                scaleX: animationState.rightEyeScaleX,
                scaleY: animationState.rightEyeScaleY,
                scale: scale
            )
            
            // Layer 3: PUPIL_LEFT
            if animationState.leftEyeScaleY > 0.1 {
                PupilView(
                    side: .left,
                    x: animationState.leftPupilX,
                    y: animationState.leftPupilY,
                    size: animationState.leftPupilSize,
                    scale: scale
                )
            }
            
            // Layer 4: PUPIL_RIGHT
            if animationState.rightEyeScaleY > 0.1 {
                PupilView(
                    side: .right,
                    x: animationState.rightPupilX,
                    y: animationState.rightPupilY,
                    size: animationState.rightPupilSize,
                    scale: scale
                )
            }
            
            // Layer 5: EYELID_BOTTOM_LEFT
            EyelidBottomView(
                side: .left,
                yOffset: animationState.leftEyelidBottomY,
                scale: scale
            )
            
            // Layer 6: EYELID_BOTTOM_RIGHT
            EyelidBottomView(
                side: .right,
                yOffset: animationState.rightEyelidBottomY,
                scale: scale
            )
            
            // Layer 7: EYELID_TOP_LEFT
            EyelidTopView(
                side: .left,
                yOffset: animationState.leftEyelidTopY,
                isBlinking: isBlinking,
                blinkType: blinkType,
                scale: scale
            )
            
            // Layer 8: EYELID_TOP_RIGHT
            EyelidTopView(
                side: .right,
                yOffset: animationState.rightEyelidTopY,
                isBlinking: isBlinking,
                blinkType: blinkType,
                scale: scale
            )
            
            // Layer 9: EYEBROW_LEFT
            EnhancedEyebrowView(
                side: .left,
                rotation: animationState.leftEyebrowRotation,
                yOffset: animationState.leftEyebrowY,
                xOffset: animationState.leftEyebrowX,
                scale: scale
            )
            
            // Layer 10: EYEBROW_RIGHT
            EnhancedEyebrowView(
                side: .right,
                rotation: animationState.rightEyebrowRotation,
                yOffset: animationState.rightEyebrowY,
                xOffset: animationState.rightEyebrowX,
                scale: scale
            )
            
            // Layer 11: MOOD_GLOW_INNER
            MoodGlowInnerView(
                intensity: animationState.glowIntensity,
                pulseRate: animationState.glowPulseRate,
                color: animationState.glowColor,
                scale: scale
            )
            
            // Layer 12: MOOD_GLOW_OUTER
            MoodGlowOuterView(
                intensity: animationState.glowIntensity,
                pulseRate: animationState.glowPulseRate,
                color: animationState.glowColor,
                scale: scale
            )
            
            // Layer 13: ACCESSORIES (conditional - party hat, coffee mug)
            if animationState.showAccessories {
                AccessoriesView(
                    accessoryType: animationState.accessoryType,
                    scale: scale
                )
            }
            
            // Mouth (Layer 1 in spec, but rendered after eyes for proper layering)
            EnhancedMouthView(
                state: animationState.mouthState,
                width: animationState.mouthWidth,
                curveDepth: animationState.mouthCurveDepth,
                scale: scale
            )
            
            // Layer 14: PARTICLE_EFFECTS (conditional - handled separately)
            // Particles are rendered in ParticleSystemView overlay
        }
        .frame(width: canvasSize * scale, height: canvasSize * scale)
        .overlay(
            // Particle effects overlay
            if animationState.particleType != nil {
                ParticleSystemView(
                    particleType: animationState.particleType!,
                    isActive: true
                )
                .scaleEffect(scale)
            }
        )
    }
}

struct FaceBaseView: View {
    let scale: CGFloat
    let showTechGrid: Bool
    
    var body: some View {
        RoundedRectangle(cornerRadius: 48 * scale)
            .fill(
                LinearGradient(
                    colors: [
                        Color(hex: "2A2A2A"),
                        Color(hex: "1A1A1A")
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .frame(width: 280 * scale, height: 280 * scale)
            .overlay(
                RoundedRectangle(cornerRadius: 48 * scale)
                    .stroke(Color.grumpBorder, lineWidth: 2 * scale)
            )
            .shadow(color: .black.opacity(0.3), radius: 24 * scale, x: 0, y: 8 * scale)
            .overlay(
                // Tech grid pattern (disabled in reduced motion)
                if showTechGrid {
                    TechGridView(isProcessing: false)
                        .scaleEffect(scale)
                }
            )
            .overlay(
                // Noise texture overlay (simulated with subtle opacity variation)
                RoundedRectangle(cornerRadius: 48 * scale)
                    .fill(Color.white.opacity(0.03))
            )
    }
}

struct EyeWhiteView: View {
    let side: EyeSide
    let scaleX: Double
    let scaleY: Double
    let scale: CGFloat
    
    private var eyeSize: CGSize {
        let baseWidth: CGFloat = 36
        let baseHeight: CGFloat = 36
        return CGSize(
            width: baseWidth * scaleX * scale,
            height: baseHeight * scaleY * scale
        )
    }
    
    private var eyePosition: CGPoint {
        let baseX: CGFloat = side == .left ? -32 : 32
        let baseY: CGFloat = -20
        return CGPoint(x: baseX * scale, y: baseY * scale)
    }
    
    var body: some View {
        Ellipse()
            .fill(Color(hex: "E0E0E0"))
            .frame(width: eyeSize.width, height: eyeSize.height)
            .offset(x: eyePosition.x, y: eyePosition.y)
    }
}

struct PupilView: View {
    let side: EyeSide
    let x: Double
    let y: Double
    let size: Double
    let scale: CGFloat
    
    private var eyeCenter: CGPoint {
        let baseX: CGFloat = side == .left ? -32 : 32
        let baseY: CGFloat = -20
        return CGPoint(x: baseX * scale, y: baseY * scale)
    }
    
    var body: some View {
        ZStack {
            // Pupil
            Circle()
                .fill(Color(hex: "1A1A1A"))
                .frame(width: size * scale, height: size * scale)
            
            // Highlight
            Circle()
                .fill(Color.white.opacity(0.4))
                .frame(width: 3 * scale, height: 3 * scale)
                .offset(x: 2 * scale, y: -2 * scale)
        }
        .offset(
            x: eyeCenter.x + CGFloat(x) * scale,
            y: eyeCenter.y + CGFloat(y) * scale
        )
    }
}

struct EyelidTopView: View {
    let side: EyeSide
    let yOffset: Double
    let isBlinking: Bool
    let blinkType: BlinkType
    let scale: CGFloat
    
    private var eyePosition: CGPoint {
        let baseX: CGFloat = side == .left ? -32 : 32
        let baseY: CGFloat = -20
        return CGPoint(x: baseX * scale, y: baseY * scale)
    }
    
    var body: some View {
        Path { path in
            // Curved eyelid shape (arc)
            let width: CGFloat = 44 * scale
            let height: CGFloat = 24 * scale
            let centerY = eyePosition.y + CGFloat(yOffset) * scale
            
            path.move(to: CGPoint(x: eyePosition.x - width/2, y: centerY))
            path.addQuadCurve(
                to: CGPoint(x: eyePosition.x + width/2, y: centerY),
                control: CGPoint(x: eyePosition.x, y: centerY - height)
            )
        }
        .fill(
            LinearGradient(
                colors: [Color(hex: "2A2A2A"), Color(hex: "1A1A1A")],
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
}

struct EyelidBottomView: View {
    let side: EyeSide
    let yOffset: Double
    let scale: CGFloat
    
    private var eyePosition: CGPoint {
        let baseX: CGFloat = side == .left ? -32 : 32
        let baseY: CGFloat = -20
        return CGPoint(x: baseX * scale, y: baseY * scale)
    }
    
    var body: some View {
        Path { path in
            // Inverted arc for bottom eyelid
            let width: CGFloat = 44 * scale
            let height: CGFloat = 16 * scale
            let centerY = eyePosition.y + CGFloat(yOffset) * scale
            
            path.move(to: CGPoint(x: eyePosition.x - width/2, y: centerY))
            path.addQuadCurve(
                to: CGPoint(x: eyePosition.x + width/2, y: centerY),
                control: CGPoint(x: eyePosition.x, y: centerY + height)
            )
        }
        .fill(
            LinearGradient(
                colors: [Color(hex: "2A2A2A"), Color(hex: "1A1A1A")],
                startPoint: .bottom,
                endPoint: .top
            )
        )
    }
}

struct EnhancedEyebrowView: View {
    let side: EyeSide
    let rotation: Double
    let yOffset: Double
    let xOffset: Double
    let scale: CGFloat
    
    private var anchorPoint: CGPoint {
        let baseX: CGFloat = side == .left ? -32 : 32
        let baseY: CGFloat = -52
        return CGPoint(x: baseX * scale, y: baseY * scale)
    }
    
    var body: some View {
        RoundedRectangle(cornerRadius: 4 * scale)
            .fill(Color(hex: "E0E0E0"))
            .frame(width: 40 * scale, height: 8 * scale)
            .rotationEffect(.degrees(rotation))
            .offset(
                x: anchorPoint.x + CGFloat(xOffset) * scale,
                y: anchorPoint.y + CGFloat(yOffset) * scale
            )
    }
}

struct MoodGlowInnerView: View {
    let intensity: Double
    let pulseRate: Double
    let color: GlowColor
    let scale: CGFloat
    
    var body: some View {
        TimelineView(.periodic(from: .now, by: 0.016)) { context in
            let time = context.date.timeIntervalSince1970
            let pulse = sin(time * pulseRate) * 0.15 + 0.85
            let opacity = intensity * pulse * 0.6
            
            RoundedRectangle(cornerRadius: 52 * scale)
                .stroke(glowColorForMood(color), lineWidth: 2 * scale)
                .frame(width: 288 * scale, height: 288 * scale)
                .blur(radius: 8 * scale)
                .opacity(opacity)
        }
    }
}

struct MoodGlowOuterView: View {
    let intensity: Double
    let pulseRate: Double
    let color: GlowColor
    let scale: CGFloat
    
    var body: some View {
        TimelineView(.periodic(from: .now, by: 0.016)) { context in
            let time = context.date.timeIntervalSince1970
            let pulse = sin(time * pulseRate) * 0.15 + 0.85
            let opacity = intensity * pulse * 0.4
            
            RoundedRectangle(cornerRadius: 52 * scale)
                .stroke(glowColorForMood(color), lineWidth: 4 * scale)
                .frame(width: 296 * scale, height: 296 * scale)
                .blur(radius: 16 * scale)
                .opacity(opacity)
        }
    }
}

struct AccessoriesView: View {
    let accessoryType: AccessoryType
    let scale: CGFloat
    
    var body: some View {
        Group {
            switch accessoryType {
            case .partyHat:
                PartyHatView(scale: scale)
            case .coffeeMug:
                CoffeeMugView(scale: scale)
            }
        }
    }
}

enum AccessoryType {
    case partyHat
    case coffeeMug
}

func glowColorForMood(_ color: GlowColor) -> Color {
    switch color {
    case .red:
        return Color.grumpAccent
    case .orange:
        return Color.orange
    case .soft:
        return Color.blue.opacity(0.6)
    case .intense:
        return Color.red
    }
}


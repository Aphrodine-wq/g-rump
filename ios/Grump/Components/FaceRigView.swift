import SwiftUI

struct FaceRigView: View {
    let animationState: AnimationState
    let isBlinking: Bool
    
    var body: some View {
        ZStack {
            // Head
            Circle()
                .fill(Color.grumpSurface)
                .frame(width: 80, height: 80)
                .overlay(
                    Circle()
                        .stroke(Color.grumpBorder, lineWidth: 2)
                )
            
            // Left eyebrow
            EyebrowView(
                rotation: animationState.leftEyebrowRotation,
                yOffset: animationState.leftEyebrowY,
                side: .left
            )
            
            // Right eyebrow
            EyebrowView(
                rotation: animationState.rightEyebrowRotation,
                yOffset: animationState.rightEyebrowY,
                side: .right
            )
            
            // Left eye
            EyeRigView(
                isBlinking: isBlinking,
                scale: animationState.leftEyeScale,
                pupilX: animationState.leftPupilX,
                pupilY: animationState.leftPupilY,
                side: .left
            )
            
            // Right eye
            EyeRigView(
                isBlinking: isBlinking,
                scale: animationState.rightEyeScale,
                pupilX: animationState.rightPupilX,
                pupilY: animationState.rightPupilY,
                side: .right
            )
            
            // Mouth
            MouthView(state: animationState.mouthState)
        }
    }
}

enum EyeSide {
    case left
    case right
}

struct EyebrowView: View {
    let rotation: Double
    let yOffset: Double
    let side: EyeSide
    
    var body: some View {
        Path { path in
            if side == .left {
                path.move(to: CGPoint(x: -10, y: -8))
                path.addLine(to: CGPoint(x: 10, y: -12))
            } else {
                path.move(to: CGPoint(x: -10, y: -12))
                path.addLine(to: CGPoint(x: 10, y: -8))
            }
        }
        .stroke(Color.grumpTextPrimary, lineWidth: 3)
        .rotationEffect(.degrees(rotation))
        .offset(x: side == .left ? -10 : 10, y: yOffset)
    }
}

struct EyeRigView: View {
    let isBlinking: Bool
    let scale: Double
    let pupilX: Double
    let pupilY: Double
    let side: EyeSide
    
    var body: some View {
        ZStack {
            if isBlinking || scale < 0.1 {
                // Closed eye
                Path { path in
                    path.move(to: CGPoint(x: -4, y: 0))
                    path.addLine(to: CGPoint(x: 4, y: 0))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2)
            } else {
                // Open eye with pupil
                Ellipse()
                    .fill(Color.grumpTextPrimary)
                    .frame(width: 8 * scale, height: 10 * scale)
                    .overlay(
                        // Pupil
                        Circle()
                            .fill(Color.grumpBackground)
                            .frame(width: 4 * scale, height: 4 * scale)
                            .offset(x: CGFloat(pupilX), y: CGFloat(pupilY))
                    )
            }
        }
        .frame(width: 12, height: 12)
        .offset(x: side == .left ? -8 : 8, y: 2)
    }
}

struct MouthView: View {
    let state: MouthState
    
    var body: some View {
        Group {
            switch state {
            case .flat:
                Path { path in
                    path.move(to: CGPoint(x: -8, y: 12))
                    path.addLine(to: CGPoint(x: 8, y: 12))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5)
                
            case .frown:
                Path { path in
                    path.move(to: CGPoint(x: -8, y: 12))
                    path.addQuadCurve(
                        to: CGPoint(x: 8, y: 12),
                        control: CGPoint(x: 0, y: 18)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5)
                
            case .slightFrown:
                Path { path in
                    path.move(to: CGPoint(x: -8, y: 12))
                    path.addQuadCurve(
                        to: CGPoint(x: 8, y: 12),
                        control: CGPoint(x: 0, y: 15)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5)
                
            case .smirk:
                Path { path in
                    path.move(to: CGPoint(x: -8, y: 12))
                    path.addQuadCurve(
                        to: CGPoint(x: 8, y: 10),
                        control: CGPoint(x: 2, y: 14)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5)
                
            case .open:
                Ellipse()
                    .stroke(Color.grumpTextPrimary, lineWidth: 2)
                    .frame(width: 12, height: 8)
                
            case .pursed:
                Ellipse()
                    .stroke(Color.grumpTextPrimary, lineWidth: 2.5)
                    .frame(width: 10, height: 6)
                
            case .tight:
                Path { path in
                    path.move(to: CGPoint(x: -6, y: 12))
                    path.addLine(to: CGPoint(x: 6, y: 12))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 3)
                
            case .almostSmile:
                Path { path in
                    path.move(to: CGPoint(x: -8, y: 12))
                    path.addQuadCurve(
                        to: CGPoint(x: 8, y: 12),
                        control: CGPoint(x: 0, y: 8)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5)
                
            case .part:
                Path { path in
                    path.move(to: CGPoint(x: -4, y: 12))
                    path.addLine(to: CGPoint(x: 4, y: 12))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2)
                
            case .muttering:
                Path { path in
                    path.move(to: CGPoint(x: -6, y: 12))
                    path.addQuadCurve(
                        to: CGPoint(x: 6, y: 12),
                        control: CGPoint(x: 0, y: 14)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2)
                
            case .exaggeratedFrown:
                Path { path in
                    path.move(to: CGPoint(x: -8, y: 12))
                    path.addQuadCurve(
                        to: CGPoint(x: 8, y: 12),
                        control: CGPoint(x: 0, y: 22)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 3)
                
            case .neutral:
                Path { path in
                    path.move(to: CGPoint(x: -8, y: 12))
                    path.addLine(to: CGPoint(x: 8, y: 12))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2)
            }
        }
        .offset(y: 12)
    }
}


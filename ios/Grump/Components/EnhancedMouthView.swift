import SwiftUI

struct EnhancedMouthView: View {
    let state: MouthState
    let width: Double
    let curveDepth: Double
    let scale: CGFloat
    
    var body: some View {
        Group {
            switch state {
            case .flat:
                Path { path in
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addLine(to: CGPoint(x: width/2 * scale, y: 36 * scale))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5 * scale)
                
            case .frown:
                Path { path in
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addQuadCurve(
                        to: CGPoint(x: width/2 * scale, y: 36 * scale),
                        control: CGPoint(x: 0, y: (36 + 18) * scale)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5 * scale)
                
            case .slightFrown:
                Path { path in
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addQuadCurve(
                        to: CGPoint(x: width/2 * scale, y: 36 * scale),
                        control: CGPoint(x: 0, y: (36 + 15) * scale)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5 * scale)
                
            case .smirk:
                Path { path in
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addQuadCurve(
                        to: CGPoint(x: width/2 * scale, y: (36 - 2) * scale),
                        control: CGPoint(x: 2 * scale, y: (36 + 14) * scale)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5 * scale)
                
            case .open:
                Ellipse()
                    .stroke(Color.grumpTextPrimary, lineWidth: 2 * scale)
                    .frame(width: width * scale, height: 8 * scale)
                    .offset(y: 36 * scale)
                
            case .pursed:
                Ellipse()
                    .stroke(Color.grumpTextPrimary, lineWidth: 2.5 * scale)
                    .frame(width: width * scale, height: 6 * scale)
                    .offset(y: 36 * scale)
                
            case .tight:
                Path { path in
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addLine(to: CGPoint(x: width/2 * scale, y: 36 * scale))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 3 * scale)
                
            case .almostSmile:
                Path { path in
                    let depth = min(abs(curveDepth), 6.0) * scale
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addQuadCurve(
                        to: CGPoint(x: width/2 * scale, y: 36 * scale),
                        control: CGPoint(x: 0, y: (36 - depth) * scale)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5 * scale)
                
            case .part:
                Path { path in
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addLine(to: CGPoint(x: width/2 * scale, y: 36 * scale))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2 * scale)
                
            case .muttering:
                Path { path in
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addQuadCurve(
                        to: CGPoint(x: width/2 * scale, y: 36 * scale),
                        control: CGPoint(x: 0, y: (36 + 14) * scale)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2 * scale)
                
            case .exaggeratedFrown:
                Path { path in
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addQuadCurve(
                        to: CGPoint(x: width/2 * scale, y: 36 * scale),
                        control: CGPoint(x: 0, y: (36 + 22) * scale)
                    )
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 3 * scale)
                
            case .neutral:
                Path { path in
                    path.move(to: CGPoint(x: -width/2 * scale, y: 36 * scale))
                    path.addLine(to: CGPoint(x: width/2 * scale, y: 36 * scale))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2 * scale)
                
            case .wavy:
                Path { path in
                    let waveCount = 3
                    let waveWidth = width / Double(waveCount) * scale
                    for i in 0..<waveCount {
                        let startX = -width/2 + Double(i) * (width / Double(waveCount))
                        let midX = startX + waveWidth / 2
                        let endX = startX + waveWidth
                        path.move(to: CGPoint(x: startX * scale, y: 36 * scale))
                        path.addQuadCurve(
                            to: CGPoint(x: endX * scale, y: 36 * scale),
                            control: CGPoint(x: midX * scale, y: (36 + 2) * scale)
                        )
                    }
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2.5 * scale)
            }
        }
        .offset(y: 0)
    }
}


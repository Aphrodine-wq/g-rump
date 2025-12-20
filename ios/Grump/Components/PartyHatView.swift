import SwiftUI

struct PartyHatView: View {
    let scale: CGFloat
    
    var body: some View {
        ZStack {
            // Party hat (too small, tilted)
            Path { path in
                // Triangle hat
                path.move(to: CGPoint(x: 0, y: -140 * scale))
                path.addLine(to: CGPoint(x: -15 * scale, y: -120 * scale))
                path.addLine(to: CGPoint(x: 15 * scale, y: -120 * scale))
                path.closeSubpath()
            }
            .fill(Color.grumpAccent)
            .rotationEffect(.degrees(-5)) // Tilted, annoyed
            
            // Elastic band
            Path { path in
                path.move(to: CGPoint(x: -20 * scale, y: -115 * scale))
                path.addLine(to: CGPoint(x: 20 * scale, y: -115 * scale))
            }
            .stroke(Color.grumpTextSecondary, lineWidth: 1 * scale)
        }
    }
}

struct CoffeeMugView: View {
    let scale: CGFloat
    
    var body: some View {
        // Coffee mug positioned bottom right
        ZStack {
            // Mug body
            RoundedRectangle(cornerRadius: 4 * scale)
                .fill(Color.grumpSurface)
                .frame(width: 24 * scale, height: 20 * scale)
                .offset(x: 120 * scale, y: 120 * scale)
            
            // Handle
            Path { path in
                path.addArc(
                    center: CGPoint(x: 130 * scale, y: 120 * scale),
                    radius: 6 * scale,
                    startAngle: .degrees(0),
                    endAngle: .degrees(180),
                    clockwise: false
                )
            }
            .stroke(Color.grumpBorder, lineWidth: 2 * scale)
        }
    }
}


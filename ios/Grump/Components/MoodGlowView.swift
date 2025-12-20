import SwiftUI

struct MoodGlowView: View {
    let intensity: Double
    let pulseRate: Double
    let color: GlowColor
    
    var body: some View {
        TimelineView(.periodic(from: .now, by: 0.016)) { context in
            let time = context.date.timeIntervalSince1970
            let pulse = sin(time * pulseRate) * 0.2 + 0.8
            let opacity = intensity * pulse
            
            Circle()
                .fill(
                    RadialGradient(
                        colors: glowColors(opacity: opacity),
                        center: .center,
                        startRadius: 20,
                        endRadius: 60
                    )
                )
                .frame(width: 120, height: 120)
        }
    }
    
    private func glowColors(opacity: Double) -> [Color] {
        let baseColor: Color
        switch color {
        case .red:
            baseColor = Color.grumpAccent
        case .orange:
            baseColor = Color.orange
        case .soft:
            baseColor = Color.blue.opacity(0.6)
        case .intense:
            baseColor = Color.red
        }
        
        return [
            baseColor.opacity(opacity),
            baseColor.opacity(0.0)
        ]
    }
}


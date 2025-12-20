import SwiftUI

struct TechGridView: View {
    let isProcessing: Bool
    @State private var scrollOffset: CGFloat = 0
    
    var body: some View {
        if ReducedMotion.shouldDisable(.techGrid) {
            EmptyView()
        } else {
            TimelineView(.periodic(from: .now, by: 0.016)) { context in
            let time = context.date.timeIntervalSince1970
            let speed: CGFloat = isProcessing ? 2.0 : 0.5
            let offset = CGFloat(time.truncatingRemainder(dividingBy: 1000)) * speed
            
            Canvas { context, size in
                let lineSpacing: CGFloat = 8
                let lineColor = Color.grumpAccent.opacity(0.08)
                let lineWidth: CGFloat = 1
                
                // Draw diagonal lines at 45 degrees
                let diagonalLength = sqrt(size.width * size.width + size.height * size.height)
                let lineCount = Int(diagonalLength / lineSpacing) + 2
                
                for i in -2..<lineCount {
                    let baseOffset = CGFloat(i) * lineSpacing
                    let currentOffset = (baseOffset + offset).truncatingRemainder(dividingBy: lineSpacing * 2)
                    
                    context.stroke(
                        Path { path in
                            // Diagonal line from top-left to bottom-right
                            path.move(to: CGPoint(x: -size.height + currentOffset, y: 0))
                            path.addLine(to: CGPoint(x: currentOffset, y: size.height))
                        },
                        with: .color(lineColor),
                        lineWidth: lineWidth
                    )
                }
            }
            .frame(width: 280, height: 280)
        }
    }
}


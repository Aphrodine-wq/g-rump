import SwiftUI

struct LaunchSequenceView: View {
    @Binding var isComplete: Bool
    @State private var phase: LaunchPhase = .black
    @State private var eyesVisible = false
    @State private var eyesOpen = false
    @State private var faceVisible = false
    @State private var uiVisible = false
    @State private var hasBlinked = false
    
    enum LaunchPhase {
        case black
        case eyesAppear
        case eyesOpen
        case faceFadeIn
        case uiSlideUp
        case complete
    }
    
    var body: some View {
        ZStack {
            Color.grumpBackground
                .ignoresSafeArea()
            
            if phase == .black {
                Color.black
                    .ignoresSafeArea()
            } else {
                VStack(spacing: 0) {
                    // Avatar area
                    ZStack {
                        if eyesVisible {
                            // Eyes first
                            EyesOnlyView(isOpen: eyesOpen)
                                .frame(width: 120, height: 120)
                                .opacity(eyesVisible ? 1.0 : 0.0)
                        }
                        
                        if faceVisible {
                            // Full face
                            GrumpAvatarView(
                                animationState: AnimationState(),
                                isBlinking: false,
                                eyeTrackingPosition: 0
                            )
                            .frame(width: AnimationConstants.avatarSize, height: AnimationConstants.avatarSize)
                            .opacity(faceVisible ? 1.0 : 0.0)
                    }
                    .padding(.top, 100)
                    
                    Spacer()
                    
                    // UI elements
                    if uiVisible {
                        VStack(spacing: 16) {
                            Text(launchText)
                                .font(.title2)
                                .foregroundColor(.grumpTextPrimary)
                                .opacity(uiVisible ? 1.0 : 0.0)
                            
                            Text("Tap to continue")
                                .font(.caption)
                                .foregroundColor(.grumpTextSecondary)
                                .opacity(uiVisible ? 1.0 : 0.0)
                        }
                        .padding(.bottom, 100)
                        .offset(y: uiVisible ? 0 : 50)
                    }
                }
            }
        }
        .onAppear {
            startLaunchSequence()
        }
        .onTapGesture {
            if phase == .complete {
                isComplete = true
            }
        }
    }
    
    private var launchText: String {
        // Check if first launch or return user
        let isFirstLaunch = !UserDefaults.standard.bool(forKey: "hasLaunchedBefore")
        if isFirstLaunch {
            UserDefaults.standard.set(true, forKey: "hasLaunchedBefore")
            return "Oh. It's you. Great."
        } else {
            let texts = ["You're back. Wonderful.", "Again? Okay.", "Oh good. You're here."]
            return texts.randomElement() ?? texts[0]
        }
    }
    
    private func startLaunchSequence() {
        // Phase 1: Darkness (0-300ms): Black screen, noise texture
        // Already set in view
        
        // Phase 2: Eyes Appear (300-700ms): Pupils fade in, grow to size
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            withAnimation(.easeOut(duration: 0.4)) {
                phase = .eyesAppear
                eyesVisible = true
            }
        }
        
        // Phase 3: Eyes Open (700-1000ms): Eyelids lift, pupils dilate, first blink
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.7) {
            withAnimation(.easeInOut(duration: 0.3)) {
                phase = .eyesOpen
                eyesOpen = true
            }
            // Pupil dilation
            HapticService.shared.appLaunch()
        }
        
        // Phase 4: Face Reveals (1000-1400ms): Face container fades, all elements visible, scale pop
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                phase = .faceFadeIn
                faceVisible = true
            }
        }
        
        // Phase 5: UI Slides Up (1400-1800ms): Chat area and input slide up, settling blink
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                phase = .uiSlideUp
                uiVisible = true
            }
        }
        
        // Phase 6: Complete (1800ms): Settling blink, ready
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.8) {
            phase = .complete
            SoundService.shared.playSound(.appOpen)
            
            // Settling blink
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                withAnimation(.easeInOut(duration: 0.15)) {
                    hasBlinked = true
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                    withAnimation(.easeInOut(duration: 0.15)) {
                        hasBlinked = false
                    }
                }
            }
        }
    }
}

struct EyesOnlyView: View {
    let isOpen: Bool
    
    var body: some View {
        HStack(spacing: 16) {
            // Left eye
            if isOpen {
                Ellipse()
                    .fill(Color.grumpTextPrimary)
                    .frame(width: 8, height: 10)
            } else {
                Path { path in
                    path.move(to: CGPoint(x: -4, y: 0))
                    path.addLine(to: CGPoint(x: 4, y: 0))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2)
            }
            
            // Right eye
            if isOpen {
                Ellipse()
                    .fill(Color.grumpTextPrimary)
                    .frame(width: 8, height: 10)
            } else {
                Path { path in
                    path.move(to: CGPoint(x: -4, y: 0))
                    path.addLine(to: CGPoint(x: 4, y: 0))
                }
                .stroke(Color.grumpTextPrimary, lineWidth: 2)
            }
        }
    }
}


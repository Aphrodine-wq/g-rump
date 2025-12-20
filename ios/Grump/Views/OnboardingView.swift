import SwiftUI

struct OnboardingView: View {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @State private var currentPage = 0
    
    let pages = [
        OnboardingPage(
            title: "Oh good. You're here.",
            description: "I'm Grump. The world's crankiest AI. I'll help, but I won't be happy about it.",
            showAvatar: true
        ),
        OnboardingPage(
            title: "I'm not mean.",
            description: "Just perpetually unimpressed. But I'll help anyway.",
            showAvatar: true
        ),
        OnboardingPage(
            title: "Ready? I guess.",
            description: "Ask me anything. I'll complain, but I'll help.",
            showAvatar: true
        )
    ]
    
    var body: some View {
        ZStack {
            Color.grumpBackground
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Skip button
                HStack {
                    Spacer()
                    Button("Skip") {
                        completeOnboarding()
                    }
                    .foregroundColor(.grumpTextSecondary)
                    .padding()
                }
                
                // Content
                TabView(selection: $currentPage) {
                    ForEach(0..<pages.count, id: \.self) { index in
                        OnboardingPageView(page: pages[index])
                            .tag(index)
                    }
                }
                .tabViewStyle(.page)
                .indexViewStyle(.page(backgroundDisplayMode: .always))
                
                // Continue button
                Button(action: {
                    if currentPage < pages.count - 1 {
                        withAnimation {
                            currentPage += 1
                        }
                    } else {
                        completeOnboarding()
                    }
                }) {
                    Text(currentPage < pages.count - 1 ? "Continue" : "Get Started")
                        .font(.headline)
                        .foregroundColor(.grumpBackground)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.grumpAccent)
                        .cornerRadius(12)
                }
                .padding(.horizontal, 32)
                .padding(.bottom, 40)
            }
        }
    }
    
    private func completeOnboarding() {
        UserDefaults.standard.set(true, forKey: "hasCompletedOnboarding")
        withAnimation {
            hasCompletedOnboarding = true
        }
    }
}

struct OnboardingPage {
    let title: String
    let description: String
    let showAvatar: Bool
}

struct OnboardingPageView: View {
    let page: OnboardingPage
    
    var body: some View {
        VStack(spacing: 40) {
            Spacer()
            
            if page.showAvatar {
                GrumpAvatarView(
                    animationState: AnimationState(),
                    isBlinking: false,
                    eyeTrackingPosition: 0,
                    blinkType: .standard
                )
                .frame(width: 150, height: 150)
            }
            
            VStack(spacing: 16) {
                Text(page.title)
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.grumpTextPrimary)
                    .multilineTextAlignment(.center)
                
                Text(page.description)
                    .font(.body)
                    .foregroundColor(.grumpTextSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }
            
            Spacer()
        }
        .padding()
    }
}


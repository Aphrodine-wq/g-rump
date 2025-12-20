import SwiftUI
import SwiftData

@main
struct GrumpApp: App {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @State private var showLaunchSequence = true
    @State private var launchSequenceComplete = false
    
    var body: some Scene {
        WindowGroup {
            ZStack {
                if showLaunchSequence && !launchSequenceComplete {
                    LaunchSequenceView(isComplete: $launchSequenceComplete)
                        .onChange(of: launchSequenceComplete) { _, complete in
                            if complete {
                                withAnimation {
                                    showLaunchSequence = false
                                }
                            }
                        }
                } else if hasCompletedOnboarding {
                    ContentView()
                } else {
                    OnboardingView()
                }
            }
        }
        .modelContainer(for: [ChatSession.self, Message.self])
    }
}


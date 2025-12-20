import UIKit

class HapticService {
    static let shared = HapticService()
    
    private let lightImpact = UIImpactFeedbackGenerator(style: .light)
    private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
    private let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
    private let notificationFeedback = UINotificationFeedbackGenerator()
    private let selectionFeedback = UISelectionFeedbackGenerator()
    
    private init() {
        // Prepare generators for immediate use
        lightImpact.prepare()
        mediumImpact.prepare()
        heavyImpact.prepare()
    }
    
    func sendMessage() {
        lightImpact.impactOccurred()
        lightImpact.prepare()
    }
    
    func grumpMessageLands() {
        mediumImpact.impactOccurred()
        mediumImpact.prepare()
    }
    
    func eyeRoll() {
        lightImpact.impactOccurred()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.lightImpact.impactOccurred()
        }
        lightImpact.prepare()
    }
    
    func impressed() {
        notificationFeedback.notificationOccurred(.success)
        notificationFeedback.prepare()
    }
    
    func maximumGrump() {
        heavyImpact.impactOccurred()
        heavyImpact.prepare()
    }
    
    func appLaunch() {
        lightImpact.impactOccurred()
        lightImpact.prepare()
    }
    
    func pullToRefresh() {
        selectionFeedback.selectionChanged()
        selectionFeedback.prepare()
    }
    
    func easterEgg() {
        // Special pattern: light-medium-light
        lightImpact.impactOccurred()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
            self.mediumImpact.impactOccurred()
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            self.lightImpact.impactOccurred()
        }
        lightImpact.prepare()
        mediumImpact.prepare()
    }
    
    func screenShake() {
        heavyImpact.impactOccurred()
        heavyImpact.prepare()
    }
}


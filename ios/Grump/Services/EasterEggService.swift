import Foundation

@MainActor
class EasterEggService: ObservableObject {
    static let shared = EasterEggService()
    
    @Published var currentEasterEgg: EasterEggType? = nil
    @Published var isSleepMode = false
    @Published var lastInteractionTime: Date = Date()
    
    enum EasterEggType {
        case sleep
        case jumpscare
        case birthday
        case threeAM
    }
    
    private var sleepTimer: Timer?
    private var idleCheckTimer: Timer?
    
    init() {
        startIdleTracking()
    }
    
    func checkForEasterEggs() -> EasterEggType? {
        let hour = Calendar.current.component(.hour, from: Date())
        
        // 3 AM Grump (2-5 AM)
        if hour >= 2 && hour < 5 {
            return .threeAM
        }
        
        // Birthday (would need user to share birthday - placeholder)
        // if isUserBirthday() {
        //     return .birthday
        // }
        
        return nil
    }
    
    func triggerJumpscare() {
        currentEasterEgg = .jumpscare
        HapticService.shared.easterEgg()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.currentEasterEgg = nil
        }
    }
    
    func updateInteractionTime() {
        lastInteractionTime = Date()
        if isSleepMode {
            wakeFromSleep()
        }
    }
    
    private func startIdleTracking() {
        idleCheckTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            
            let idleTime = Date().timeIntervalSince(self.lastInteractionTime)
            
            // Sleep mode after 2 minutes of no interaction
            if idleTime > 120 && !self.isSleepMode {
                self.enterSleepMode()
            }
        }
    }
    
    private func enterSleepMode() {
        isSleepMode = true
        currentEasterEgg = .sleep
    }
    
    private func wakeFromSleep() {
        isSleepMode = false
        currentEasterEgg = nil
        HapticService.shared.appLaunch()
    }
    
    func checkTimeBasedEasterEgg() -> EasterEggType? {
        return checkForEasterEggs()
    }
    
    deinit {
        sleepTimer?.invalidate()
        idleCheckTimer?.invalidate()
    }
}


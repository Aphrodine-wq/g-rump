import SwiftUI

struct DeviceSize {
    static func getAvatarSize() -> CGFloat {
        #if os(iOS)
        let screenWidth = UIScreen.main.bounds.width
        
        // iPhone SE (320pt width)
        if screenWidth <= 375 {
            return 100
        }
        // iPhone 14 (390pt width)
        else if screenWidth <= 430 {
            return 120
        }
        // iPhone 14 Pro Max (428pt width)
        else if screenWidth <= 500 {
            return 140
        }
        // iPad
        else if screenWidth <= 1024 {
            return 200  // Larger for iPad
        }
        // 4K displays and larger (iPad Pro, external 4K monitors)
        else {
            return 280  // High resolution for 4K displays
        }
        #else
        return 120
        #endif
    }
    
    static func getScale() -> CGFloat {
        let avatarSize = getAvatarSize()
        // Base canvas is 1600pt for 4K support (upgraded from 400pt)
        // This provides 4x the resolution for crisp rendering on high-DPI displays
        return avatarSize / 1600.0
    }
    
    // Get the base canvas size (upgraded for 4K support)
    static func getBaseCanvasSize() -> CGFloat {
        return 1600.0  // Upgraded from 400pt for 4K resolution support
    }
    
    static func shouldUseSimplifiedVersion() -> Bool {
        return getAvatarSize() <= 40
    }
    
    // Check if device supports 4K/high-DPI rendering
    static func supportsHighResolution() -> Bool {
        #if os(iOS)
        let scale = UIScreen.main.scale
        return scale >= 3.0  // Retina displays and higher
        #else
        return true
        #endif
    }
}


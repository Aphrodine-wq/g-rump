import Foundation

// Simple Perlin noise implementation for micro-movements
class PerlinNoise {
    private var seed: Int
    
    init(seed: Int = 0) {
        self.seed = seed
    }
    
    func noise1D(_ x: Double) -> Double {
        let i = Int(x) & 255
        let xf = x - floor(x)
        let u = fade(xf)
        
        let a = hash(i) & 15
        let b = hash(i + 1) & 15
        
        let gradA = grad1D(a, xf)
        let gradB = grad1D(b, xf - 1.0)
        
        return lerp(u, gradA, gradB)
    }
    
    func noise2D(_ x: Double, _ y: Double) -> Double {
        let X = Int(floor(x)) & 255
        let Y = Int(floor(y)) & 255
        
        let xf = x - floor(x)
        let yf = y - floor(y)
        
        let u = fade(xf)
        let v = fade(yf)
        
        let a = hash(X + seed) + Y
        let aa = hash(a) & 7
        let ab = hash(a + 1) & 7
        let b = hash(X + 1 + seed) + Y
        let ba = hash(b) & 7
        let bb = hash(b + 1) & 7
        
        let gradAA = grad2D(aa, xf, yf)
        let gradBA = grad2D(ba, xf - 1.0, yf)
        let gradAB = grad2D(ab, xf, yf - 1.0)
        let gradBB = grad2D(bb, xf - 1.0, yf - 1.0)
        
        let lerp1 = lerp(u, gradAA, gradBA)
        let lerp2 = lerp(u, gradAB, gradBB)
        
        return lerp(v, lerp1, lerp2)
    }
    
    private func fade(_ t: Double) -> Double {
        return t * t * t * (t * (t * 6 - 15) + 10)
    }
    
    private func lerp(_ t: Double, _ a: Double, _ b: Double) -> Double {
        return a + t * (b - a)
    }
    
    private func grad1D(_ hash: Int, _ x: Double) -> Double {
        let h = hash & 1
        return h == 0 ? x : -x
    }
    
    private func grad2D(_ hash: Int, _ x: Double, _ y: Double) -> Double {
        let h = hash & 3
        switch h {
        case 0: return x + y
        case 1: return -x + y
        case 2: return x - y
        default: return -x - y
        }
    }
    
    private func hash(_ i: Int) -> Int {
        // Simple hash function
        var h = i
        h = ((h << 16) ^ h) * 0x45d9f3b
        h = ((h << 16) ^ h) * 0x45d9f3b
        h = (h << 16) ^ h
        return abs(h)
    }
}


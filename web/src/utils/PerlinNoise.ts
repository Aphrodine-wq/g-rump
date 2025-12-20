/**
 * Simplified Perlin Noise implementation for natural micro-movements
 * Based on Ken Perlin's improved noise algorithm
 */

class PerlinNoise {
  private permutation: number[]
  private p: number[]

  constructor(seed: number = 0) {
    // Create permutation array
    this.permutation = []
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i
    }

    // Shuffle based on seed
    let rng = this.seededRandom(seed)
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]]
    }

    // Extend permutation array
    this.p = []
    for (let i = 0; i < 512; i++) {
      this.p[i] = this.permutation[i % 256]
    }
  }

  private seededRandom(seed: number): () => number {
    let value = seed
    return () => {
      value = (value * 9301 + 49297) % 233280
      return value / 233280
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a)
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  noise(x: number, y: number = 0, z: number = 0): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const Z = Math.floor(z) & 255

    x -= Math.floor(x)
    y -= Math.floor(y)
    z -= Math.floor(z)

    const u = this.fade(x)
    const v = this.fade(y)
    const w = this.fade(z)

    const A = this.p[X] + Y
    const AA = this.p[A] + Z
    const AB = this.p[A + 1] + Z
    const B = this.p[X + 1] + Y
    const BA = this.p[B] + Z
    const BB = this.p[B + 1] + Z

    return this.lerp(
      this.lerp(
        this.lerp(
          this.grad(this.p[AA], x, y, z),
          this.grad(this.p[BA], x - 1, y, z),
          u
        ),
        this.lerp(
          this.grad(this.p[AB], x, y - 1, z),
          this.grad(this.p[BB], x - 1, y - 1, z),
          u
        ),
        v
      ),
      this.lerp(
        this.lerp(
          this.grad(this.p[AA + 1], x, y, z - 1),
          this.grad(this.p[BA + 1], x - 1, y, z - 1),
          u
        ),
        this.lerp(
          this.grad(this.p[AB + 1], x, y - 1, z - 1),
          this.grad(this.p[BB + 1], x - 1, y - 1, z - 1),
          u
        ),
        v
      ),
      w
    )
  }

  // 1D noise for simpler use cases
  noise1D(x: number): number {
    return this.noise(x, 0, 0)
  }

  // 2D noise
  noise2D(x: number, y: number): number {
    return this.noise(x, y, 0)
  }
}

// Create independent noise generators for different micro-movements
export const createNoiseGenerator = (seed: number = 0) => new PerlinNoise(seed)

// Pre-created generators for different movement types
export const pupilNoise = createNoiseGenerator(100)
export const eyebrowNoise = createNoiseGenerator(200)
export const headNoise = createNoiseGenerator(300)
export const mouthNoise = createNoiseGenerator(400)

/**
 * Get a smooth noise value for micro-movements
 * @param noiseGenerator - The noise generator to use
 * @param time - Current time in seconds
 * @param frequency - How fast the noise changes (default: 0.1)
 * @param amplitude - Maximum value range (default: 1.0)
 * @returns Noise value between -amplitude and +amplitude
 */
export function getMicroMovement(
  noiseGenerator: PerlinNoise,
  time: number,
  frequency: number = 0.1,
  amplitude: number = 1.0
): number {
  return noiseGenerator.noise1D(time * frequency) * amplitude
}

/**
 * Get 2D noise for X/Y movements (like pupil drift)
 */
export function getMicroMovement2D(
  noiseGenerator: PerlinNoise,
  time: number,
  frequency: number = 0.1,
  amplitude: number = 1.0
): { x: number; y: number } {
  return {
    x: noiseGenerator.noise2D(time * frequency, 0) * amplitude,
    y: noiseGenerator.noise2D(0, time * frequency) * amplitude
  }
}


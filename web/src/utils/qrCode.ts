// Simple QR code generator using canvas
// For production, consider using a library like 'qrcode' or 'qrcode.react'

export function generateQRCode(text: string, size: number = 200): string {
  // Create a canvas element
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return ''
  
  // Simple QR-like pattern (for production, use a proper QR library)
  // This creates a basic pattern that looks like a QR code
  const moduleSize = size / 25 // 25x25 grid
  ctx.fillStyle = '#000000'
  
  // Draw finder patterns (corners)
  drawFinderPattern(ctx, 0, 0, moduleSize)
  drawFinderPattern(ctx, size - 7 * moduleSize, 0, moduleSize)
  drawFinderPattern(ctx, 0, size - 7 * moduleSize, moduleSize)
  
  // Draw data modules based on text hash
  const hash = simpleHash(text)
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      // Skip finder pattern areas
      if ((i < 7 && j < 7) || 
          (i < 7 && j >= 18) || 
          (i >= 18 && j < 7)) {
        continue
      }
      
      // Use hash to determine if module should be filled
      const shouldFill = (hash + i * 31 + j * 17) % 3 === 0
      if (shouldFill) {
        ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
      }
    }
  }
  
  return canvas.toDataURL()
}

function drawFinderPattern(ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) {
  // Outer square
  ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize)
  // Inner white square
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)
  // Center black square
  ctx.fillStyle = '#000000'
  ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export function downloadQRCode(dataUrl: string, filename: string = 'qr-code.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}


// Animation API Service - Connects frontend to backend animation endpoints

import axios from 'axios'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'

export interface AnimationRequest {
  prompt: string
  style?: string
  format?: string
}

export interface Animation {
  id: string
  preview: string | { url: string; format?: string }
  code: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  prompt: string
  style?: string
  format?: string
  createdAt: string
}

export interface ExportRequest {
  format: 'gif' | 'mp4' | 'webm' | 'apng' | 'lottie' | 'sprite' | 'css' | 'code'
  resolution?: '720p' | '1080p' | '4k'
  quality?: 'low' | 'high' | 'max'
  loop?: boolean
  background?: 'transparent' | 'white' | 'black'
  watermark?: boolean
}

export interface ExportResult {
  url: string
  format: string
  size: number
  downloadUrl: string
}

// Mock Data for fallback
const MOCK_ANIMATIONS: Animation[] = [
  {
    id: 'mock-1',
    preview: { url: 'https://via.placeholder.com/300x200?text=Bouncing+Logo', format: 'gif' },
    code: '.logo { animation: bounce 1s infinite; }',
    status: 'completed',
    prompt: 'Make a bouncing logo',
    style: 'css',
    format: 'css',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'mock-2',
    preview: { url: 'https://via.placeholder.com/300x200?text=Loading+Spinner', format: 'gif' },
    code: '.spinner { animation: spin 1s linear infinite; }',
    status: 'completed',
    prompt: 'Create a loading spinner',
    style: 'css',
    format: 'css',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'mock-3',
    preview: { url: 'https://via.placeholder.com/300x200?text=Fade+In', format: 'gif' },
    code: '.fade { animation: fadeIn 0.5s ease-in; }',
    status: 'completed',
    prompt: 'Fade in text effect',
    style: 'css',
    format: 'css',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
]

class AnimationApi {
  private baseUrl: string

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/animation`
  }

  /**
   * Create an animation from natural language prompt
   */
  async createAnimation(request: AnimationRequest): Promise<Animation> {
    try {
      const response = await axios.post(`${this.baseUrl}/create`, request)
      return response.data.animation
    } catch (error: any) {
      console.warn('Backend unavailable, using mock response for createAnimation')
      return {
        id: `mock-${Date.now()}`,
        preview: { url: 'https://via.placeholder.com/300x200?text=Generated+Animation', format: 'gif' },
        code: `/* Generated from: ${request.prompt} */\n.element { animation: custom 1s infinite; }`,
        status: 'completed',
        prompt: request.prompt,
        style: request.style || 'default',
        format: request.format || 'css',
        createdAt: new Date().toISOString()
      }
    }
  }

  /**
   * Get animation by ID
   */
  async getAnimation(id: string): Promise<Animation> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data.animation
    } catch (error: any) {
      console.warn('Backend unavailable, using mock response for getAnimation')
      return MOCK_ANIMATIONS[0]
    }
  }

  /**
   * Export animation to specified format
   */
  async exportAnimation(id: string, exportRequest: ExportRequest): Promise<ExportResult> {
    try {
      const response = await axios.post(`${this.baseUrl}/${id}/export`, exportRequest)
      return response.data.export
    } catch (error: any) {
      console.warn('Backend unavailable, using mock response for exportAnimation')
      return {
        url: 'https://via.placeholder.com/download',
        format: exportRequest.format,
        size: 1024,
        downloadUrl: '#'
      }
    }
  }

  /**
   * Get user's animation history
   */
  async getHistory(limit: number = 20, offset: number = 0): Promise<Animation[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/history`, {
        params: { limit, offset }
      })
      return response.data.history || []
    } catch (error: any) {
      console.warn('Backend unavailable, using mock history')
      // Return mock data so the dashboard isn't empty
      return MOCK_ANIMATIONS
    }
  }

  /**
   * Check if message is requesting an animation
   */
  isAnimationRequest(message: string): boolean {
    const animationKeywords = [
      'make', 'create', 'generate', 'animate', 'animation',
      'spinner', 'loading', 'bounce', 'fade', 'slide',
      'button', 'logo', 'icon', 'sprite', 'effect',
      'transition', 'motion', 'move', 'rotate', 'scale'
    ]
    const lowerMessage = message.toLowerCase()
    return animationKeywords.some(keyword => lowerMessage.includes(keyword))
  }
}

export const animationApi = new AnimationApi()

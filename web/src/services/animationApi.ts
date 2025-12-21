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
      console.error('Animation creation error:', error)
      throw new Error(error.response?.data?.error || 'Failed to create animation')
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
      console.error('Get animation error:', error)
      throw new Error(error.response?.data?.error || 'Failed to get animation')
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
      console.error('Export error:', error)
      throw new Error(error.response?.data?.error || 'Failed to export animation')
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
      console.error('Get history error:', error)
      // Return empty array on error (user might not have any animations yet)
      return []
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


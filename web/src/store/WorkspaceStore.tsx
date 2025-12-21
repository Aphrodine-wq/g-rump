import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'

export interface AnimationData {
  name?: string
  frames: (string | React.ReactNode)[]
  fps?: number
}

export type WorkspaceStatus = 'idle' | 'working' | 'rendering' | 'done'

interface WorkspaceState {
  animation: AnimationData | null
  status: WorkspaceStatus
  progress: number
  currentTask: string
}

interface WorkspaceContextType {
  state: WorkspaceState
  setAnimation: (animation: AnimationData | null) => void
  setStatus: (status: WorkspaceStatus) => void
  setProgress: (progress: number) => void
  setCurrentTask: (task: string) => void
  reset: () => void
  exportAnimation: () => void
}

const initialState: WorkspaceState = {
  animation: null,
  status: 'idle',
  progress: 0,
  currentTask: ''
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(initialState)

  const setAnimation = useCallback((animation: AnimationData | null) => {
    setState(prev => ({ ...prev, animation }))
  }, [])

  const setStatus = useCallback((status: WorkspaceStatus) => {
    setState(prev => ({ ...prev, status }))
  }, [])

  const setProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress: Math.max(0, Math.min(100, progress)) }))
  }, [])

  const setCurrentTask = useCallback((currentTask: string) => {
    setState(prev => ({ ...prev, currentTask }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  const exportAnimation = useCallback(() => {
    if (!state.animation) {
      console.warn('No animation to export')
      return
    }
    
    // Export animation data as JSON
    const animationData = {
      name: state.animation.name || 'Untitled Animation',
      frames: state.animation.frames.length,
      fps: state.animation.fps || 60,
      data: state.animation
    }
    
    const dataStr = JSON.stringify(animationData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${animationData.name.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('Animation exported:', animationData.name)
  }, [state.animation])

  const contextValue = useMemo(() => ({
    state,
    setAnimation,
    setStatus,
    setProgress,
    setCurrentTask,
    reset,
    exportAnimation
  }), [state, setAnimation, setStatus, setProgress, setCurrentTask, reset, exportAnimation])

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  }
  return context
}


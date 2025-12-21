// Loading Skeleton Component
// Provides better perceived performance during loading states

import './LoadingSkeleton.css'

interface LoadingSkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  variant?: 'text' | 'circle' | 'rect' | 'avatar'
}

export default function LoadingSkeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  variant = 'rect'
}: LoadingSkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
    />
  )
}

// Pre-built skeleton components
export function MessageSkeleton() {
  return (
    <div className="message-skeleton">
      <LoadingSkeleton variant="circle" width={40} height={40} />
      <div className="message-skeleton-content">
        <LoadingSkeleton width="60%" height={16} />
        <LoadingSkeleton width="80%" height={16} />
        <LoadingSkeleton width="40%" height={16} />
      </div>
    </div>
  )
}

export function GamePreviewSkeleton() {
  return (
    <div className="game-preview-skeleton">
      <LoadingSkeleton variant="rect" width="100%" height={400} />
    </div>
  )
}

export function ProjectListSkeleton() {
  return (
    <div className="project-list-skeleton">
      {[1, 2, 3].map(i => (
        <div key={i} className="project-skeleton-item">
          <LoadingSkeleton width="60%" height={20} />
          <LoadingSkeleton width="40%" height={14} />
        </div>
      ))}
    </div>
  )
}


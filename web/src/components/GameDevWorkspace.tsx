// Game Development Workspace - Full-featured game development environment

import React, { useState, useEffect, useRef, useCallback } from 'react'
import './GameDevWorkspace.css'
import GrumpAvatarWrapper from './GrumpAvatarWrapper'

interface GameProject {
  id: string
  name: string
  code: string
  lastModified: Date
  target: 'web' | 'ios' | 'android' | 'flutter'
}

interface Entity {
  name: string
  components: string[]
  systems: string[]
}

interface GameDevWorkspaceProps {
  projectId?: string
  templateCode?: string
  onNavigate?: (view: string) => void
  onExport?: (code: string, target: string) => void
}

export default function GameDevWorkspace({ 
  projectId, 
  templateCode,
  onNavigate,
  onExport 
}: GameDevWorkspaceProps) {
  const [code, setCode] = useState(templateCode || getDefaultGameCode())
  const [isCompiling, setIsCompiling] = useState(false)
  const [compileError, setCompileError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'code' | 'preview' | 'entities' | 'assets'>('code')
  const [splitView, setSplitView] = useState(true)
  const [entities, setEntities] = useState<Entity[]>([])
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [targetPlatform, setTargetPlatform] = useState<'web' | 'ios' | 'android' | 'flutter'>('web')
  const [projectName, setProjectName] = useState('My Game')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [fps, setFps] = useState(60)
  const [showStats, setShowStats] = useState(true)
  
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)
  const gameLoopRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number>(0)

  // Parse entities from code
  useEffect(() => {
    const parsed = parseEntities(code)
    setEntities(parsed)
  }, [code])

  // Game loop
  useEffect(() => {
    if (!isRunning || !previewCanvasRef.current) return

    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gameLoop = (currentTime: number) => {
      const delta = (currentTime - lastFrameTimeRef.current) / 1000
      lastFrameTimeRef.current = currentTime

      // Clear canvas
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      if (showGrid) {
        drawGrid(ctx, canvas.width, canvas.height)
      }

      // Draw placeholder game content
      drawPlaceholderGame(ctx, canvas.width, canvas.height, delta)

      // Draw stats
      if (showStats) {
        drawStats(ctx, delta, fps)
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    lastFrameTimeRef.current = performance.now()
    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [isRunning, showGrid, showStats, fps])

  const handleCompile = async () => {
    setIsCompiling(true)
    setCompileError(null)

    try {
      const response = await fetch('/api/game/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, target: targetPlatform })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Compilation failed')
      }

      const result = await response.json()
      console.log('Compilation successful:', result)
      setIsRunning(true)
    } catch (error: any) {
      setCompileError(error.message || 'Compilation failed')
    } finally {
      setIsCompiling(false)
    }
  }

  const handleRun = () => {
    if (!isRunning) {
      setIsRunning(true)
    } else {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setCompileError(null)
    if (previewCanvasRef.current) {
      const ctx = previewCanvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height)
      }
    }
  }

  const handleSave = () => {
    // Save project logic
    setShowSaveDialog(false)
    // In real implementation, save to backend/localStorage
  }

  const handleExport = () => {
    if (onExport) {
      onExport(code, targetPlatform)
    }
  }

  return (
    <div className="game-dev-workspace">
      {/* Header */}
      <div className="gamedev-header">
        <div className="gamedev-window-controls">
          <div className="window-dot red" />
          <div className="window-dot yellow" />
          <div className="window-dot green" />
        </div>

        <div className="gamedev-title-section">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="gamedev-project-name"
            placeholder="My Game"
          />
          <span className="gamedev-badge">{targetPlatform.toUpperCase()}</span>
        </div>

        <div className="gamedev-header-actions">
          <select
            value={targetPlatform}
            onChange={(e) => setTargetPlatform(e.target.value as any)}
            className="gamedev-platform-select"
          >
            <option value="web">Web</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
            <option value="flutter">Flutter</option>
          </select>
          
          <button className="gamedev-btn secondary" onClick={() => setShowSaveDialog(true)}>
            Save
          </button>
          <button 
            className="gamedev-btn primary" 
            onClick={handleCompile}
            disabled={isCompiling}
          >
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="gamedev-toolbar">
        <div className="gamedev-tabs">
          <button
            className={`gamedev-tab ${selectedTab === 'code' ? 'active' : ''}`}
            onClick={() => setSelectedTab('code')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Code
          </button>
          <button
            className={`gamedev-tab ${selectedTab === 'preview' ? 'active' : ''}`}
            onClick={() => setSelectedTab('preview')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Preview
          </button>
          <button
            className={`gamedev-tab ${selectedTab === 'entities' ? 'active' : ''}`}
            onClick={() => setSelectedTab('entities')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Entities
          </button>
          <button
            className={`gamedev-tab ${selectedTab === 'assets' ? 'active' : ''}`}
            onClick={() => setSelectedTab('assets')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Assets
          </button>
        </div>

        <div className="gamedev-controls">
          <button
            className={`gamedev-control-btn ${isRunning ? 'active' : ''}`}
            onClick={handleRun}
          >
            {isRunning ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Run
              </>
            )}
          </button>
          <button className="gamedev-control-btn" onClick={handleReset}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <div className="gamedev-divider" />
          <label className="gamedev-checkbox-label">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            Grid
          </label>
          <label className="gamedev-checkbox-label">
            <input
              type="checkbox"
              checked={showStats}
              onChange={(e) => setShowStats(e.target.checked)}
            />
            Stats
          </label>
          <div className="gamedev-divider" />
          <div className="gamedev-zoom-controls">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>−</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.25))}>+</button>
          </div>
          <button className="gamedev-btn secondary" onClick={handleExport}>
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="gamedev-content">
        {selectedTab === 'code' && (
          <div className="gamedev-code-section">
            {splitView && (
              <div className="gamedev-code-editor">
                <div className="gamedev-editor-header">
                  <span>main.grump</span>
                  <div className="gamedev-editor-actions">
                    <button onClick={() => setCode(getDefaultGameCode())}>Reset</button>
                    <button onClick={() => navigator.clipboard.writeText(code)}>Copy</button>
                  </div>
                </div>
                <textarea
                  ref={codeEditorRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="gamedev-code-textarea"
                  spellCheck={false}
                  placeholder="// Start coding your game..."
                />
                {compileError && (
                  <div className="gamedev-error">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {compileError}
                  </div>
                )}
              </div>
            )}
            {splitView && <div className="gamedev-split-divider" />}
            <div className="gamedev-preview-section">
              <div className="gamedev-preview-header">
                <span>Game Preview</span>
                <button onClick={() => setSplitView(!splitView)}>
                  {splitView ? 'Fullscreen' : 'Split'}
                </button>
              </div>
              <div className="gamedev-canvas-container" style={{ transform: `scale(${zoom})` }}>
                <canvas
                  ref={previewCanvasRef}
                  width={800}
                  height={600}
                  className="gamedev-preview-canvas"
                />
                {!isRunning && (
                  <div className="gamedev-preview-overlay">
                    <div className="gamedev-preview-placeholder">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>Click Run to start the game</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'preview' && (
          <div className="gamedev-preview-full">
            <div className="gamedev-canvas-container" style={{ transform: `scale(${zoom})` }}>
              <canvas
                ref={previewCanvasRef}
                width={800}
                height={600}
                className="gamedev-preview-canvas"
              />
            </div>
          </div>
        )}

        {selectedTab === 'entities' && (
          <div className="gamedev-entities-section">
            <div className="gamedev-entities-sidebar">
              <h3>Entities ({entities.length})</h3>
              <div className="gamedev-entities-list">
                {entities.map((entity, idx) => (
                  <div
                    key={idx}
                    className={`gamedev-entity-item ${selectedEntity === entity.name ? 'active' : ''}`}
                    onClick={() => setSelectedEntity(entity.name)}
                  >
                    <div className="gamedev-entity-icon">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="gamedev-entity-info">
                      <div className="gamedev-entity-name">{entity.name}</div>
                      <div className="gamedev-entity-meta">
                        {entity.components.length} components, {entity.systems.length} systems
                      </div>
                    </div>
                  </div>
                ))}
                {entities.length === 0 && (
                  <div className="gamedev-empty-state">
                    <p>No entities found. Define entities in your code.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="gamedev-entity-details">
              {selectedEntity ? (
                <>
                  <h3>{selectedEntity}</h3>
                  {entities.find(e => e.name === selectedEntity) && (
                    <>
                      <div className="gamedev-detail-section">
                        <h4>Components</h4>
                        <div className="gamedev-tag-list">
                          {entities.find(e => e.name === selectedEntity)!.components.map((comp, idx) => (
                            <span key={idx} className="gamedev-tag">{comp}</span>
                          ))}
                        </div>
                      </div>
                      <div className="gamedev-detail-section">
                        <h4>Systems</h4>
                        <div className="gamedev-tag-list">
                          {entities.find(e => e.name === selectedEntity)!.systems.map((sys, idx) => (
                            <span key={idx} className="gamedev-tag">{sys}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="gamedev-empty-state">
                  <p>Select an entity to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'assets' && (
          <div className="gamedev-assets-section">
            <div className="gamedev-assets-header">
              <h3>Assets</h3>
              <button className="gamedev-btn primary">Upload</button>
            </div>
            <div className="gamedev-assets-grid">
              <div className="gamedev-asset-placeholder">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p>Upload sprites, sounds, and other assets</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="gamedev-modal-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="gamedev-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Save Project</h3>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              className="gamedev-modal-input"
            />
            <div className="gamedev-modal-actions">
              <button className="gamedev-btn secondary" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </button>
              <button className="gamedev-btn primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getDefaultGameCode(): string {
  return `// G-Rump Game Template
// Animation-first game development

@app "My Game"
@version "1.0.0"
@target [web]
@fps 60

state {
    score: int = 0
    gameState: enum(ready, playing, paused) = ready
}

world {
    gravity: (0, 980)
}

entity Player {
    sprite: "player.png"
    position: (screen.center.x, screen.center.y)
    
    physics {
        body: circle(16)
        gravity: true
    }
    
    update {
        if input.left {
            velocity.x = -200
        } else if input.right {
            velocity.x = 200
        } else {
            velocity.x = 0
        }
        
        if input.jump && is_grounded() {
            velocity.y = -400
        }
    }
}

system movement() {
    let entities = world.query(Position, Velocity)
    for entity in entities {
        entity.position += entity.velocity * deltaTime()
    }
}

scene Main {
    background: #1a1a1a
    
    Player()
    
    layer ui {
        Text("Score: {score}") {
            position: (20, 20)
            font: "Arial"
            size: 24
            color: #ffffff
        }
    }
}
`
}

function parseEntities(code: string): Entity[] {
  const entities: Entity[] = []
  const entityRegex = /entity\s+(\w+)\s*\{([^}]+)\}/g
  let match

  while ((match = entityRegex.exec(code)) !== null) {
    const name = match[1]
    const body = match[2]
    
    // Extract components (simplified parsing)
    const components: string[] = []
    const componentMatches = body.match(/(\w+):\s*[^\n]+/g) || []
    componentMatches.forEach(m => {
      const compName = m.split(':')[0].trim()
      if (compName && !['sprite', 'position', 'update'].includes(compName)) {
        components.push(compName)
      }
    })

    // Extract systems (look for system calls)
    const systems: string[] = []
    if (body.includes('physics')) systems.push('physics')
    if (body.includes('update')) systems.push('update')
    if (body.includes('animate')) systems.push('animation')

    entities.push({ name, components, systems })
  }

  return entities
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1

  const gridSize = 20
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

function drawPlaceholderGame(ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) {
  // Draw a simple placeholder game
  const centerX = width / 2
  const centerY = height / 2
  const time = Date.now() / 1000

  // Draw player circle
  ctx.fillStyle = '#4ade80'
  ctx.beginPath()
  ctx.arc(centerX, centerY + Math.sin(time * 2) * 20, 20, 0, Math.PI * 2)
  ctx.fill()

  // Draw some particles
  for (let i = 0; i < 10; i++) {
    const angle = (time + i) * 0.5
    const radius = 100 + Math.sin(time + i) * 20
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    ctx.fillStyle = `rgba(96, 165, 250, ${0.5 + Math.sin(time + i) * 0.3})`
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawStats(ctx: CanvasRenderingContext2D, delta: number, targetFps: number) {
  const actualFps = Math.round(1 / delta)
  const x = 10
  let y = 20

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(x - 5, y - 15, 150, 50)

  ctx.fillStyle = '#ffffff'
  ctx.font = '12px monospace'
  ctx.fillText(`FPS: ${actualFps} / ${targetFps}`, x, y)
  ctx.fillText(`Delta: ${(delta * 1000).toFixed(2)}ms`, x, y + 15)
  ctx.fillText(`Entities: 0`, x, y + 30)
}


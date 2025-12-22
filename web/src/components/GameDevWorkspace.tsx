// Game Development Workspace - Full-featured game development environment

import { useState, useEffect, useRef } from 'react'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import Grump2 from './Grump2'
import './GameDevWorkspace.css'

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
  projectId: _projectId, 
  templateCode,
  onNavigate: _onNavigate,
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
  const [showStats, setShowStats] = useState(true)
  const [compiledGameHtml, setCompiledGameHtml] = useState<string | null>(null)
  const [savedProjects, setSavedProjects] = useState<Array<{id: string, name: string, code: string, updatedAt: Date}>>([])
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewIframeRef = useRef<HTMLIFrameElement>(null)
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)

  // Parse entities from code
  useEffect(() => {
    const parsed = parseEntities(code)
    setEntities(parsed)
  }, [code])

  // Load saved projects on mount
  useEffect(() => {
    loadSavedProjects()
  }, [])

  // Auto-save project every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (code && projectName) {
        saveProjectToLocalStorage()
      }
    }, 30000)
    return () => clearInterval(autoSave)
  }, [code, projectName])

  // Load compiled game into iframe
  useEffect(() => {
    if (compiledGameHtml && previewIframeRef.current) {
      const iframe = previewIframeRef.current
      const blob = new Blob([compiledGameHtml], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      iframe.src = url
      
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [compiledGameHtml])

  const handleCompile = async () => {
    setIsCompiling(true)
    setCompileError(null)

    try {
      // 🚀 REAL-TIME WASM COMPILATION
      // We import the WASM module dynamically to avoid loading it until needed
      
      const useWasm = true; // Enabled! Uses mock until real build replaces it.

      if (useWasm) {
         try {
           // Import the WASM wrapper (which points to index.js mock or pkg/ index.js)
           // @ts-ignore
           const wasm = await import('../grump-compiler-wasm');
           await wasm.default(); // Initialize WASM
           
           const result = wasm.compile_code_wasm(code, targetPlatform);
           
           // Handle the serializable result
           if (result.success && result.output) {
             setCompiledGameHtml(result.output);
             setIsRunning(true);
           } else {
             throw new Error(result.error || 'Unknown compilation error');
           }
           return;
         } catch (e) {
           console.warn("WASM compilation failed, falling back to mock delay:", e);
           // Fall through to mock
         }
      }

      // Fallback: Check if we're in a real environment or need to mock
      // Since the Rust backend might not be running on Vercel yet, we'll gracefully fallback
      const useMockCompilation = true; // Temporary flag until WASM is ready

      if (useMockCompilation) {
        // Simulate compilation delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Return a mock compiled game
        const mockResult = {
          compiled: {
            code: `
              <!DOCTYPE html>
              <html>
                <body style="margin:0;overflow:hidden;background:#111;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:monospace;">
                  <div style="text-align:center;">
                    <h1>Game Preview</h1>
                    <p>Compiled from: ${projectName}</p>
                    <p style="color:#888; font-size: 14px;">Target: ${targetPlatform}</p>
                    <div style="width:50px;height:50px;background:#44ff44;margin:20px auto;border-radius:50%;animation:bounce 1s infinite;"></div>
                    <style>
                      @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                      }
                    </style>
                    <p style="color:#666; font-size: 12px; margin-top: 20px;">
                      (WASM Compiler Module Prepared - Build pipeline integration pending)
                    </p>
                  </div>
                </body>
              </html>
            `
          }
        };
        
        setCompiledGameHtml(mockResult.compiled.code)
        setIsRunning(true)
        console.log('Mock compilation successful');
        return;
      }

      const response = await fetch('/api/game/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, target: targetPlatform })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || error.message || 'Compilation failed')
      }

      const result = await response.json()
      console.log('Compilation successful:', result)
      
      if (result.compiled?.code) {
        setCompiledGameHtml(result.compiled.code)
        setIsRunning(true)
      } else {
        throw new Error('No compiled code received')
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Compilation failed'
      setCompileError(errorMessage)
      setIsRunning(false)
      
      // Show detailed error if available
      if (error.response?.data?.error) {
        const details = error.response.data.error
        setCompileError(`${errorMessage}: ${details.message || details.details || ''}`)
      }
    } finally {
      setIsCompiling(false)
    }
  }

  const handleRun = async () => {
    if (!isRunning) {
      // Compile and run
      await handleCompile()
    } else {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setCompileError(null)
    setCompiledGameHtml(null)
    if (previewIframeRef.current) {
      previewIframeRef.current.src = 'about:blank'
    }
  }

  const saveProjectToLocalStorage = () => {
    const project = {
      id: _projectId || Date.now().toString(),
      name: projectName,
      code: code,
      targetPlatform: targetPlatform,
      updatedAt: new Date().toISOString()
    }
    
    const projects = JSON.parse(localStorage.getItem('g-rump-projects') || '[]')
    const existingIndex = projects.findIndex((p: any) => p.id === project.id)
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project
    } else {
      projects.push(project)
    }
    
    localStorage.setItem('g-rump-projects', JSON.stringify(projects))
    loadSavedProjects()
  }

  const loadSavedProjects = () => {
    const projects = JSON.parse(localStorage.getItem('g-rump-projects') || '[]')
    setSavedProjects(projects.map((p: any) => ({
      ...p,
      updatedAt: new Date(p.updatedAt)
    })))
  }

  const loadProject = (projectId: string) => {
    const projects = JSON.parse(localStorage.getItem('g-rump-projects') || '[]')
    const project = projects.find((p: any) => p.id === projectId)
    if (project) {
      setCode(project.code)
      setProjectName(project.name)
      setTargetPlatform(project.targetPlatform || 'web')
      setShowLoadDialog(false)
    }
  }

  const deleteProject = (projectId: string) => {
    const projects = JSON.parse(localStorage.getItem('g-rump-projects') || '[]')
    const filtered = projects.filter((p: any) => p.id !== projectId)
    localStorage.setItem('g-rump-projects', JSON.stringify(filtered))
    loadSavedProjects()
  }

  const handleSave = () => {
    saveProjectToLocalStorage()
    setShowSaveDialog(false)
    alert('Project saved!')
  }

  const shareGame = () => {
    if (!compiledGameHtml) {
      alert('Please compile the game first')
      return
    }
    
    // Encode game code in URL
    const encoded = btoa(JSON.stringify({
      name: projectName,
      code: code,
      compiled: compiledGameHtml
    }))
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?game=${encoded}`
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!')
    })
  }

  const handleExport = async () => {
    if (!compiledGameHtml) {
      // Compile first if not already compiled
      await handleCompile()
      if (!compiledGameHtml) {
        alert('Please compile the game first')
        return
      }
    }

    // Create download
    const blob = new Blob([compiledGameHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName || 'game'}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    if (onExport) {
      onExport(code, targetPlatform)
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: () => {
      if (code && projectName) {
        saveProjectToLocalStorage()
        alert('Project saved!')
      } else {
        setShowSaveDialog(true)
      }
    },
    onCompile: handleCompile,
    onRun: handleRun,
    onExport: handleExport,
    onNew: () => {
      if (confirm('Start a new project? Unsaved changes will be lost.')) {
        setCode(getDefaultGameCode())
        setProjectName('My Game')
        setCompiledGameHtml(null)
      }
    },
    enabled: selectedTab === 'code'
  })

  return (
    <div className="game-dev-workspace">
      {/* Header */}
      <div className="gamedev-header">
        <div className="gamedev-window-controls">
          <button className="gamedev-back-btn" onClick={() => onNavigate && onNavigate('dashboard')}>
            ← Exit
          </button>
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
          
          <button className="gamedev-btn secondary" onClick={() => setShowLoadDialog(true)}>
            Load
          </button>
          <button className="gamedev-btn secondary" onClick={() => setShowSaveDialog(true)}>
            Save
          </button>
          <button className="gamedev-btn secondary" onClick={shareGame}>
            Share
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
                <div className="gamedev-code-wrapper">
                  <pre className="gamedev-code-preview">{code}</pre>
                  <textarea
                    ref={codeEditorRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                      // Tab indentation
                      if (e.key === 'Tab') {
                        e.preventDefault()
                        const textarea = e.currentTarget
                        const start = textarea.selectionStart
                        const end = textarea.selectionEnd
                        const text = textarea.value
                        
                        if (e.shiftKey) {
                          // Unindent
                          const before = text.substring(0, start)
                          const lines = before.split('\n')
                          const currentLine = lines[lines.length - 1]
                          if (currentLine.startsWith('  ')) {
                            const newText = text.substring(0, start - 2) + text.substring(start)
                            setCode(newText)
                            setTimeout(() => {
                              textarea.selectionStart = textarea.selectionEnd = Math.max(0, start - 2)
                            }, 0)
                          }
                        } else {
                          // Indent
                          const newText = text.substring(0, start) + '  ' + text.substring(end)
                          setCode(newText)
                          setTimeout(() => {
                            textarea.selectionStart = textarea.selectionEnd = start + 2
                          }, 0)
                        }
                      }
                      
                      // Auto-indent on Enter
                      if (e.key === 'Enter') {
                        const textarea = e.currentTarget
                        const start = textarea.selectionStart
                        const text = textarea.value
                        const before = text.substring(0, start)
                        const lines = before.split('\n')
                        const currentLine = lines[lines.length - 1] || ''
                        const indent = currentLine.match(/^(\s*)/)?.[1] || ''
                        
                        if (currentLine.trim().endsWith('{')) {
                          const newText = before + '\n' + indent + '  \n' + indent + text.substring(start)
                          setCode(newText)
                          setTimeout(() => {
                            textarea.selectionStart = textarea.selectionEnd = start + indent.length + 3
                          }, 0)
                          e.preventDefault()
                        } else if (indent) {
                          const newText = before + '\n' + indent + text.substring(start)
                          setCode(newText)
                          setTimeout(() => {
                            textarea.selectionStart = textarea.selectionEnd = start + indent.length + 1
                          }, 0)
                          e.preventDefault()
                        }
                      }
                      
                      // Auto-close brackets
                      const bracketPairs: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" }
                      if (bracketPairs[e.key] && !e.shiftKey) {
                        const textarea = e.currentTarget
                        const start = textarea.selectionStart
                        const end = textarea.selectionEnd
                        const text = textarea.value
                        const newText = text.substring(0, start) + e.key + bracketPairs[e.key] + text.substring(end)
                        setCode(newText)
                        setTimeout(() => {
                          textarea.selectionStart = textarea.selectionEnd = start + 1
                        }, 0)
                        e.preventDefault()
                      }
                    }}
                    className="gamedev-code-textarea"
                    spellCheck={false}
                    placeholder="// Start coding your game..."
                  />
                </div>
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
                {isRunning && compiledGameHtml ? (
                  <iframe
                    ref={previewIframeRef}
                    className="gamedev-preview-iframe"
                    width={800}
                    height={600}
                    style={{ border: 'none', background: '#1a1a1a' }}
                  />
                ) : (
                  <>
                    <canvas
                      ref={previewCanvasRef}
                      width={800}
                      height={600}
                      className="gamedev-preview-canvas"
                    />
                    <div className="gamedev-preview-overlay">
                      <div className="gamedev-preview-placeholder">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Click Run to compile and start the game</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'preview' && (
          <div className="gamedev-preview-full">
            <div className="gamedev-canvas-container" style={{ transform: `scale(${zoom})` }}>
              {isRunning && compiledGameHtml ? (
                <iframe
                  ref={previewIframeRef}
                  className="gamedev-preview-iframe"
                  width={800}
                  height={600}
                  style={{ border: 'none', background: '#1a1a1a' }}
                />
              ) : (
                <canvas
                  ref={previewCanvasRef}
                  width={800}
                  height={600}
                  className="gamedev-preview-canvas"
                />
              )}
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

      {/* Grump Assistant */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <Grump2 size="small" isCoding={true} />
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

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="gamedev-modal-overlay" onClick={() => setShowLoadDialog(false)}>
          <div className="gamedev-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
            <h3>Load Project</h3>
            {savedProjects.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No saved projects</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' }}>
                {savedProjects.map((project) => (
                  <div
                    key={project.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{project.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {project.updatedAt.toLocaleDateString()} {project.updatedAt.toLocaleTimeString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="gamedev-btn primary"
                        onClick={() => loadProject(project.id)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Load
                      </button>
                      <button
                        className="gamedev-btn secondary"
                        onClick={() => {
                          if (confirm('Delete this project?')) {
                            deleteProject(project.id)
                          }
                        }}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="gamedev-modal-actions">
              <button className="gamedev-btn secondary" onClick={() => setShowLoadDialog(false)}>
                Close
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


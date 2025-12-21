// Keyboard Shortcuts Hook
// Provides keyboard shortcuts for the app

import { useEffect } from 'react'

interface KeyboardShortcutsOptions {
  onSave?: () => void
  onNew?: () => void
  onSearch?: () => void
  onCompile?: () => void
  onRun?: () => void
  onExport?: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const {
    onSave,
    onNew,
    onSearch,
    onCompile,
    onRun,
    onExport,
    enabled = true
  } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S - Save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        onSave?.()
        return
      }

      // Cmd/Ctrl + K - Search/Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onSearch?.()
        return
      }

      // Cmd/Ctrl + N - New
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        onNew?.()
        return
      }

      // Cmd/Ctrl + B - Build/Compile
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        onCompile?.()
        return
      }

      // Cmd/Ctrl + R - Run
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault()
        onRun?.()
        return
      }

      // Cmd/Ctrl + E - Export
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        onExport?.()
        return
      }

      // Escape - Close modals
      if (e.key === 'Escape') {
        // Close any open modals (handled by components)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onSave, onNew, onSearch, onCompile, onRun, onExport])
}


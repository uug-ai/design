import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

export function usePopup(disabled = false, width?: number) {
  const [isOpen, setOpen] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const open = isOpen && !disabled

  useLayoutEffect(() => {
    if (disabled) setOpen(false)
    if (!open) return
    const position = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const panelWidth = Math.min(width ?? Math.max(rect.width, 240), window.innerWidth - 24)
      const below = window.innerHeight - rect.bottom - 20
      const above = rect.top - 20
      const flip = below < 240 && above > below
      setStyle({
        position: 'fixed', width: panelWidth,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - panelWidth - 12)),
        top: flip ? 'auto' : rect.bottom + 8,
        bottom: flip ? window.innerHeight - rect.top + 8 : 'auto',
        maxHeight: Math.max(80, flip ? above : below),
      })
    }
    const outside = (event: Event) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
    }
    position()
    document.addEventListener('pointerdown', outside)
    document.addEventListener('focusin', outside)
    document.addEventListener('keydown', escape, true)
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('focusin', outside)
      document.removeEventListener('keydown', escape, true)
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
    }
  }, [open, disabled, width])

  return { open, setOpen, rootRef, triggerRef, panelRef, style }
}

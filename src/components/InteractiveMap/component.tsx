import { useEffect, useId, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Camera, Minus, Plus, Refresh, Spark } from 'iconoir-react'
import './component.css'

type MapNodeTone = 'primary' | 'secondary' | 'accent'

interface MapNode {
  id: string
  left: string
  top: string
  tone?: MapNodeTone
  label?: string
}

interface MapAnnotation {
  id: string
  title: string
  description: string
  left: string
  top: string
  icon: 'camera' | 'spark'
  emphasis?: 'default' | 'pulse'
}

interface InteractiveMapProps {
  title?: string
  description?: string
  minScale?: number
  maxScale?: number
  initialScale?: number
  nodes?: MapNode[]
  annotations?: MapAnnotation[]
  className?: string
}

const DEFAULT_NODES: MapNode[] = [
  { id: 'north-america-west', left: '8%', top: '42%' },
  { id: 'north-america-central', left: '26%', top: '48%', tone: 'secondary' },
  { id: 'north-america-east', left: '34%', top: '33%' },
  { id: 'south-america-north', left: '18%', top: '59%' },
  { id: 'south-america-east', left: '35%', top: '75%', tone: 'accent' },
  { id: 'europe-west', left: '46%', top: '32%' },
  { id: 'europe-central', left: '51%', top: '35%' },
  { id: 'europe-north', left: '54%', top: '22%', tone: 'secondary' },
  { id: 'middle-east', left: '61%', top: '55%' },
  { id: 'africa-east', left: '47%', top: '64%' },
  { id: 'central-asia', left: '71%', top: '40%' },
  { id: 'east-asia-north', left: '86%', top: '48%', tone: 'accent' },
  { id: 'east-asia-south', left: '77%', top: '55%' },
  { id: 'south-america-south', left: '29%', top: '87%' },
  { id: 'southern-africa', left: '56%', top: '85%', tone: 'accent' },
  { id: 'australia', left: '92%', top: '80%' },
]

const DEFAULT_ANNOTATIONS: MapAnnotation[] = [
  {
    id: 'camera-sites',
    title: 'Smart + Outdoor',
    description: 'Devices active in 25 sites',
    left: '5%',
    top: '18%',
    icon: 'camera',
  },
  {
    id: 'routing-live',
    title: 'AI routing live',
    description: 'Vision streams synchronized',
    left: '69%',
    top: '16%',
    icon: 'spark',
    emphasis: 'pulse',
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function InteractiveMap({
  title = 'Global activity map',
  description = 'Scroll to zoom, drag to pan, and reset the view at any time.',
  minScale = 1,
  maxScale = 2.8,
  initialScale = 1,
  nodes = DEFAULT_NODES,
  annotations = DEFAULT_ANNOTATIONS,
  className = '',
}: InteractiveMapProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const pointerStateRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)
  const [scale, setScale] = useState(clamp(initialScale, minScale, maxScale))
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const titleId = useId()
  const descriptionId = useId()

  const zoomPercent = useMemo(
    () => `${Math.round((scale / initialScale) * 100)}%`,
    [initialScale, scale],
  )

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const handleNativeWheel = (event: WheelEvent) => {
      event.preventDefault()

      const zoomStep = event.deltaY < 0 ? 0.16 : -0.16
      applyZoom(scale + zoomStep, event.clientX, event.clientY)
    }

    viewport.addEventListener('wheel', handleNativeWheel, { passive: false })

    return () => {
      viewport.removeEventListener('wheel', handleNativeWheel)
    }
  }, [scale, minScale, maxScale, initialScale])

  const applyZoom = (nextScale: number, clientX?: number, clientY?: number) => {
    const viewport = viewportRef.current
    const clampedScale = clamp(nextScale, minScale, maxScale)

    if (!viewport) {
      setScale(clampedScale)
      return
    }

    const rect = viewport.getBoundingClientRect()
    const pointerX = clientX ?? rect.left + rect.width / 2
    const pointerY = clientY ?? rect.top + rect.height / 2
    const relativeX = pointerX - rect.left - rect.width / 2
    const relativeY = pointerY - rect.top - rect.height / 2

    setOffset((currentOffset) => {
      const worldX = (relativeX - currentOffset.x) / scale
      const worldY = (relativeY - currentOffset.y) / scale

      return {
        x: relativeX - worldX * clampedScale,
        y: relativeY - worldY * clampedScale,
      }
    })
    setScale(clampedScale)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    pointerStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointerState = pointerStateRef.current

    if (!pointerState || pointerState.pointerId !== event.pointerId) {
      return
    }

    setOffset({
      x: pointerState.originX + event.clientX - pointerState.startX,
      y: pointerState.originY + event.clientY - pointerState.startY,
    })
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStateRef.current?.pointerId === event.pointerId) {
      pointerStateRef.current = null
      setIsDragging(false)
    }
  }

  const handleReset = () => {
    setScale(clamp(initialScale, minScale, maxScale))
    setOffset({ x: 0, y: 0 })
  }

  return (
    <section
      className={['interactive-map', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="interactive-map__toolbar">
        <div className="interactive-map__heading">
          <p className="interactive-map__eyebrow">Interactive visual</p>
          <h3 id={titleId}>{title}</h3>
          <p id={descriptionId}>{description}</p>
        </div>

        <div className="interactive-map__controls" aria-label="Map controls">
          <span className="interactive-map__zoom-readout">{zoomPercent}</span>
          <button
            type="button"
            className="interactive-map__control-button"
            aria-label="Zoom out"
            onClick={() => applyZoom(scale - 0.2)}
          >
            <Minus width={18} height={18} />
          </button>
          <button
            type="button"
            className="interactive-map__control-button"
            aria-label="Zoom in"
            onClick={() => applyZoom(scale + 0.2)}
          >
            <Plus width={18} height={18} />
          </button>
          <button
            type="button"
            className="interactive-map__control-button"
            aria-label="Reset map view"
            onClick={handleReset}
          >
            <Refresh width={18} height={18} />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`interactive-map__viewport ${isDragging ? 'is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
      >
        <div className="interactive-map__hint">
          <span>Scroll to zoom</span>
          <span>Drag to explore</span>
        </div>

        <div
          className="interactive-map__scene"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
          aria-hidden="true"
        >
          <div className="interactive-map__glow interactive-map__glow--left" />
          <div className="interactive-map__glow interactive-map__glow--right" />
          <div className="interactive-map__grid" />

          {nodes.map((node) => (
            <span
              key={node.id}
              className={`interactive-map__node interactive-map__node--${node.tone ?? 'primary'}`}
              style={{ left: node.left, top: node.top }}
              title={node.label ?? node.id}
            />
          ))}

          {annotations.map((annotation) => (
            <article
              key={annotation.id}
              className="interactive-map__annotation"
              style={{ left: annotation.left, top: annotation.top }}
            >
              <div
                className={`interactive-map__annotation-icon ${
                  annotation.emphasis === 'pulse' ? 'interactive-map__annotation-icon--pulse' : ''
                }`}
              >
                {annotation.icon === 'camera' ? (
                  <Camera width={18} height={18} />
                ) : (
                  <Spark width={18} height={18} />
                )}
              </div>
              <div>
                <strong>{annotation.title}</strong>
                <span>{annotation.description}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export type { InteractiveMapProps, MapAnnotation, MapNode, MapNodeTone }
export default InteractiveMap

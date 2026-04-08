import { useEffect, useId, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Minus, Plus, Refresh } from 'iconoir-react'
import MapAnnotationCard from '../MapAnnotationCard'
import MapBadge from '../MapBadge'
import './component.css'

type InteractiveMapTheme = 'auto' | 'light' | 'dark'

interface MapBadge {
  id: string
  left: string
  top: string
  shortLabel: string
  tone?: 'primary' | 'secondary' | 'accent'
  label?: string
  cardTitle?: string
  cardDescription?: string
}

interface MapAnnotation {
  id: string
  title: string
  description: string
  left: string
  top: string
}

interface InteractiveMapProps {
  title?: string
  description?: string
  minScale?: number
  maxScale?: number
  initialScale?: number
  badges?: MapBadge[]
  annotations?: MapAnnotation[]
  theme?: InteractiveMapTheme
  hiddenBadgeAreaLeftPercent?: number
  className?: string
}

const DEFAULT_BADGES: MapBadge[] = [
  { id: 'north-america-west', shortLabel: 'SF', left: '8%', top: '34%', label: 'San Francisco', cardTitle: 'San Francisco CCTV wall', cardDescription: 'Live perimeter cameras, loading dock alerts, and after-hours access events.' },
  { id: 'north-america-east', shortLabel: 'NY', left: '22%', top: '34%', label: 'New York', cardTitle: 'New York command center', cardDescription: 'High-density city surveillance with incident review, playback, and operator handoff.' },
  { id: 'south-america-north', shortLabel: 'BO', left: '20.0%', top: '54%', label: 'Bogota', cardTitle: 'Bogota partner rollout', cardDescription: 'Remote CCTV oversight for logistics yards, gates, and fenced perimeter breaches.' },
  { id: 'south-america-east', shortLabel: 'SP', left: '30%', top: '69%', label: 'Sao Paulo', cardTitle: 'Sao Paulo control room', cardDescription: 'Retail camera monitoring with people flow, intrusion alerts, and evidence export.' },
  { id: 'europe-west', shortLabel: 'LD', left: '43.6%', top: '28.1%', label: 'London', cardTitle: 'London security desk', cardDescription: 'Multi-site alarm queues, video verification, and operator dispatch coordination.' },
  { id: 'europe-central', shortLabel: 'UH', left: '45.7%', top: '28.4%', label: 'Ghent', cardTitle: 'UUG headquarters', cardDescription: 'Headquarters monitoring for camera health, intrusion review, and secure campus watchlists.' },
  { id: 'europe-north', shortLabel: 'OS', left: '46.8%', top: '23.5%', label: 'Oslo', cardTitle: 'Oslo resilience lab', cardDescription: 'Outdoor camera validation for low-light scenes, snow cover, and critical access points.' },
  { id: 'middle-east', shortLabel: 'DX', left: '59.8%', top: '42.4%', label: 'Dubai', cardTitle: 'Dubai SOC layer', cardDescription: 'Integrated video monitoring across compounds, lobbies, and vehicle checkpoints.' },
  { id: 'africa-east', shortLabel: 'NR', left: '54.4%', top: '56.9%', label: 'Nairobi', cardTitle: 'Nairobi field monitoring', cardDescription: 'Infrastructure cameras tracking trespass, roadside incidents, and perimeter movement.' },
  { id: 'central-asia', shortLabel: 'AL', left: '66.1%', top: '32.6%', label: 'Almaty', cardTitle: 'Almaty transit watch', cardDescription: 'Station and corridor surveillance with rapid review of suspicious movement patterns.' },
  { id: 'east-asia-north', shortLabel: 'TK', left: '89.4%', top: '36.7%', label: 'Tokyo', cardTitle: 'Tokyo dense-camera mesh', cardDescription: 'High-volume CCTV feeds with low-latency alerting for entrances and restricted zones.' },
  { id: 'east-asia-south', shortLabel: 'SG', left: '79.0%', top: '55.4%', label: 'Singapore', cardTitle: 'Singapore video bridge', cardDescription: 'Hybrid monitoring for campuses, access control events, and remote guard response.' },
  { id: 'south-america-south', shortLabel: 'BA', left: '26.6%', top: '75.0%', label: 'Buenos Aires', cardTitle: 'Buenos Aires patrol view', cardDescription: 'Compact control surface for patrol teams reviewing overnight camera incidents.' },
  { id: 'southern-africa', shortLabel: 'CT', left: '50.0%', top: '74.7%', label: 'Cape Town', cardTitle: 'Cape Town failover site', cardDescription: 'Redundant video monitoring for critical facilities, coastline assets, and backup response.' },
  { id: 'australia', shortLabel: 'SY', left: '92.8%', top: '74.6%', label: 'Sydney', cardTitle: 'Sydney regional watch', cardDescription: 'Regional security monitoring for ports, depots, and remote perimeter cameras.' },
]

const DEFAULT_ANNOTATIONS: MapAnnotation[] = []

const DEFAULT_ACTIVE_BADGE_ID = 'europe-central'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function clampOffset(
  nextOffset: { x: number; y: number },
  scale: number,
  viewport: HTMLDivElement | null,
) {
  if (!viewport) {
    return nextOffset
  }

  const rect = viewport.getBoundingClientRect()
  const maxOffsetX = Math.max(0, ((rect.width * scale) - rect.width) / 2)
  const maxOffsetY = Math.max(0, ((rect.height * scale) - rect.height) / 2)

  return {
    x: clamp(nextOffset.x, -maxOffsetX, maxOffsetX),
    y: clamp(nextOffset.y, -maxOffsetY, maxOffsetY),
  }
}

function InteractiveMap({
  title = 'Global activity map',
  description = 'Scroll to zoom, drag to pan, and reset the view at any time.',
  minScale = 1,
  maxScale = 2.8,
  initialScale = 1,
  badges = DEFAULT_BADGES,
  annotations = DEFAULT_ANNOTATIONS,
  theme = 'auto',
  hiddenBadgeAreaLeftPercent = 0,
  className = '',
}: InteractiveMapProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const badgeRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
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
  const [activeBadgeId, setActiveBadgeId] = useState<string | null>(() => (
    badges.some((badge) => badge.id === DEFAULT_ACTIVE_BADGE_ID) ? DEFAULT_ACTIVE_BADGE_ID : null
  ))
  const [flippedBadgeIds, setFlippedBadgeIds] = useState<Record<string, boolean>>({})
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const titleId = useId()
  const descriptionId = useId()
  const hiddenBadgeAreaBoundary = (viewportSize.width * clamp(hiddenBadgeAreaLeftPercent, 0, 95)) / 100

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

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      const { width, height } = entry.contentRect
      setViewportSize({ width, height })
    })

    resizeObserver.observe(viewport)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!activeBadgeId) {
      return
    }

    const viewport = viewportRef.current
    const badgeElement = badgeRefs.current[activeBadgeId]
    const cardElement = cardRefs.current[activeBadgeId]

    if (!viewport || !badgeElement || !cardElement) {
      return
    }

    const viewportRect = viewport.getBoundingClientRect()
    const badgeRect = badgeElement.getBoundingClientRect()
    const cardRect = cardElement.getBoundingClientRect()
    const badgeCenterX = badgeRect.left + (badgeRect.width / 2)
    const projectedLeftEdge = badgeCenterX + 18 - cardRect.width
    const shouldFlip = projectedLeftEdge < viewportRect.left + hiddenBadgeAreaBoundary + 8

    setFlippedBadgeIds((current) => (
      current[activeBadgeId] === shouldFlip
        ? current
        : { ...current, [activeBadgeId]: shouldFlip }
    ))
  }, [activeBadgeId, hiddenBadgeAreaBoundary, offset, scale])

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

      return clampOffset({
        x: relativeX - worldX * clampedScale,
        y: relativeY - worldY * clampedScale,
      }, clampedScale, viewport)
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

    setOffset(clampOffset({
      x: pointerState.originX + event.clientX - pointerState.startX,
      y: pointerState.originY + event.clientY - pointerState.startY,
    }, scale, viewportRef.current))
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
    setActiveBadgeId(badges.some((badge) => badge.id === DEFAULT_ACTIVE_BADGE_ID) ? DEFAULT_ACTIVE_BADGE_ID : null)
  }

  const getBadgePlacement = (badge: MapBadge) => {
    const top = Number.parseFloat(badge.top)
    return top >= 70 ? 'above' : 'below'
  }

  const getBadgeScreenPosition = (badge: MapBadge) => {
    const leftPercent = Number.parseFloat(badge.left) / 100
    const topPercent = Number.parseFloat(badge.top) / 100
    const localX = viewportSize.width * leftPercent
    const localY = viewportSize.height * topPercent
    const viewportCenterX = viewportSize.width / 2
    const viewportCenterY = viewportSize.height / 2

    return {
      x: viewportCenterX + offset.x + ((localX - viewportCenterX) * scale),
      y: viewportCenterY + offset.y + ((localY - viewportCenterY) * scale),
    }
  }

  return (
    <section
      className={['interactive-map', className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-theme={theme}
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
        onClick={() => {
          setActiveBadgeId(null)
        }}
      >
        <div className="interactive-map__hint">
          <span>Scroll to zoom</span>
          <span>Drag to explore</span>
        </div>

        <div className="interactive-map__badge-layer">
          {badges.map((badge) => {
            const isActive = activeBadgeId === badge.id
            const badgePosition = getBadgeScreenPosition(badge)
            const isHidden = badgePosition.x < hiddenBadgeAreaBoundary

            return (
              <div
                key={badge.id}
                className={[
                  'interactive-map__badge',
                  isActive ? 'is-active' : '',
                  isHidden ? 'is-hidden' : '',
                ].filter(Boolean).join(' ')}
                style={{
                  left: `${badgePosition.x}px`,
                  top: `${badgePosition.y}px`,
                  '--interactive-map-badge-scale': scale,
                } as React.CSSProperties}
                ref={(element) => {
                  badgeRefs.current[badge.id] = element
                }}
              >
                <button
                  type="button"
                  className={`interactive-map__badge-trigger ${isActive ? 'is-active' : ''}`}
                  aria-expanded={isActive}
                  aria-label={isActive ? `Close ${badge.label ?? badge.id}` : `Open ${badge.label ?? badge.id}`}
                  tabIndex={isHidden ? -1 : 0}
                  disabled={isHidden}
                  onPointerDown={(event) => {
                    event.stopPropagation()
                  }}
                  onClick={(event) => {
                    event.stopPropagation()
                    setActiveBadgeId((currentId) => (currentId === badge.id ? null : badge.id))
                  }}
                >
                  <MapBadge
                    label={badge.shortLabel}
                    title={badge.label ?? badge.id}
                    tone={badge.tone ?? 'primary'}
                    size={32}
                    theme={theme}
                    interactive={false}
                  />
                </button>

                {isActive && !isHidden ? (
                  <div
                    className={[
                      'interactive-map__badge-card',
                      `interactive-map__badge-card--${getBadgePlacement(badge)}`,
                      flippedBadgeIds[badge.id] ? 'interactive-map__badge-card--flipped' : '',
                    ].filter(Boolean).join(' ')}
                    ref={(element) => {
                      cardRefs.current[badge.id] = element
                    }}
                    onPointerDown={(event) => {
                      event.stopPropagation()
                    }}
                    onClick={(event) => {
                      event.stopPropagation()
                    }}
                  >
                    <MapAnnotationCard
                      title={badge.cardTitle ?? badge.label ?? badge.id}
                      description={badge.cardDescription ?? 'Regional node active and synchronized.'}
                      theme={theme}
                    />
                  </div>
                ) : null}
              </div>
            )
          })}
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
          <div className="interactive-map__surface">
            <img
              className="interactive-map__map-image"
              src="/worldmap.svg"
              alt=""
              aria-hidden="true"
            />
          </div>

          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="interactive-map__annotation"
              style={{ left: annotation.left, top: annotation.top }}
            >
              <MapAnnotationCard
                title={annotation.title}
                description={annotation.description}
                theme={theme}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export type { InteractiveMapProps, InteractiveMapTheme, MapAnnotation, MapBadge }
export default InteractiveMap

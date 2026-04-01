import { useId } from 'react'
import './component.css'

type MapBadgeTone = 'primary' | 'secondary' | 'accent'
type MapBadgeVariant = 'site' | 'cluster'
type MapBadgeTheme = 'auto' | 'light' | 'dark'

interface MapBadgeProps {
  label: string
  title?: string
  tone?: MapBadgeTone
  size?: number
  interactive?: boolean
  variant?: MapBadgeVariant
  theme?: MapBadgeTheme
  className?: string
}

const GRADIENT_START = 'hsla(278, 30%, 48%, 1)'
const GRADIENT_END = 'hsla(2, 48%, 39%, 1)'

const TONE_COLORS: Record<MapBadgeTone, string> = {
  primary: '#a22aff',
  secondary: '#2713ff',
  accent: '#ff0059',
}

function MapBadge({
  label,
  title,
  tone = 'primary',
  size = 32,
  interactive = true,
  variant = 'cluster',
  theme = 'auto',
  className = '',
}: MapBadgeProps) {
  const gradientId = useId()
  const toneColor = TONE_COLORS[tone]
  const classes = ['map-badge', `map-badge--${tone}`, interactive ? 'map-badge--interactive' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={classes}
      aria-label={title ?? label}
      title={title ?? label}
      style={{ '--map-badge-size': `${size}px` } as React.CSSProperties}
      data-theme={theme}
    >
      <svg
        className="map-badge__svg"
        width={size}
        height={size}
        viewBox="0 0 28 28"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GRADIENT_START} />
            <stop offset="100%" stopColor={GRADIENT_END} />
          </linearGradient>
        </defs>
        {variant === 'cluster' ? (
          <circle className="map-badge__face" cx="14" cy="14" r="13" fill="#ffffff" stroke={`url(#${gradientId})`} strokeWidth="2" />
        ) : (
          <>
            <circle className="map-badge__halo" cx="14" cy="14" r="13" />
            <circle
              className="map-badge__site-face"
              cx="14"
              cy="14"
              r="13"
              fill="var(--map-badge-surface)"
              stroke={toneColor}
              strokeWidth="2"
            />
          </>
        )}
        <text
          className="map-badge__text"
          x="14"
          y="15"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--map-badge-text)"
        >
          {label}
        </text>
      </svg>
    </span>
  )
}

export type { MapBadgeProps, MapBadgeTheme, MapBadgeTone, MapBadgeVariant }
export default MapBadge

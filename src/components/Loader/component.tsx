import { useId } from 'react'
import './component.css'

type LoaderSize = 'sm' | 'md' | 'lg'
type LoaderTone = 'neutral' | 'primary' | 'secondary' | 'accent'

interface LoaderProps {
  size?: LoaderSize
  tone?: LoaderTone
  inline?: boolean
  inverted?: boolean
  label?: string
  className?: string
}

function Loader({
  size = 'md',
  tone = 'accent',
  inline = false,
  inverted = false,
  label = 'Loading',
  className = '',
}: LoaderProps) {
  const gradientId = useId()
  const classes = [
    'loader',
    `loader--${size}`,
    `loader--${tone}`,
    inline ? 'loader--inline' : '',
    inverted ? 'loader--inverted' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} role="status" aria-live="polite" aria-label={label}>
      <span className="loader__spinner" aria-hidden="true">
        <svg className="loader__svg" viewBox="0 0 100 100" focusable="false">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--loader-gradient-start)" />
              <stop offset="100%" stopColor="var(--loader-gradient-end)" />
            </linearGradient>
          </defs>
          <circle className="loader__track-circle" cx="50" cy="50" r="42" />
          <circle
            className="loader__indicator-circle"
            cx="50"
            cy="50"
            r="42"
            pathLength="100"
            style={{ stroke: `url(#${gradientId})` }}
          />
        </svg>
      </span>
      {inline ? <span className="loader__label">{label}</span> : <span className="loader__sr-only">{label}</span>}
    </span>
  )
}

export default Loader
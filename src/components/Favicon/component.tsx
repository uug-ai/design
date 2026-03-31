import './component.css'

type FaviconTone = 'surface' | 'contrast'

interface FaviconProps {
  size?: number
  tone?: FaviconTone
  label?: string
  className?: string
}

function Favicon({
  size = 32,
  tone = 'surface',
  label = 'UUG favicon',
  className = '',
}: FaviconProps) {
  const classes = ['favicon-tile', `favicon-tile--${tone}`, className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      style={{ '--favicon-size': `${size}px` } as React.CSSProperties}
      aria-label={label}
    >
      <img
        className="favicon-tile__image"
        src={`${import.meta.env.BASE_URL}favicon-32x32.png`}
        alt={label}
        width={size}
        height={size}
      />
    </div>
  )
}

export default Favicon
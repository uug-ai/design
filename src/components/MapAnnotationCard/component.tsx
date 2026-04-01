import './component.css'

type MapAnnotationCardTheme = 'auto' | 'light' | 'dark'

interface MapAnnotationCardProps {
  title: string
  description: string
  theme?: MapAnnotationCardTheme
  className?: string
}

function MapAnnotationCard({
  title,
  description,
  theme = 'auto',
  className = '',
}: MapAnnotationCardProps) {
  const classes = ['map-annotation-card', className].filter(Boolean).join(' ')

  return (
    <article className={classes} data-theme={theme}>
      <div className="map-annotation-card__shell">
        <div className="map-annotation-card__content">
          <strong>{title}</strong>
          <span>{description}</span>
        </div>
      </div>
    </article>
  )
}

export type { MapAnnotationCardProps, MapAnnotationCardTheme }
export default MapAnnotationCard

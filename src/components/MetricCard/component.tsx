import './component.css'

export interface MetricCardProps {
  label: string
  /** Preformatted by the caller, including localized numbers and durations. */
  value: string | number
  unit?: string
  description?: string
  trend?: { label: string; tone: 'neutral' | 'success' | 'danger' }
  loading?: boolean
  loadingLabel?: string
}

export default function MetricCard({
  label,
  value,
  unit,
  description,
  trend,
  loading = false,
  loadingLabel = 'Loading',
}: MetricCardProps) {
  return (
    <dl className="metric-card" aria-busy={loading}>
      <dt className="metric-card__label">{label}</dt>
      <dd className="metric-card__value">
        {loading ? (
          <span className="metric-card__loading">{loadingLabel}</span>
        ) : (
          <>
            <span className="metric-card__number">{value}{unit && <span className="metric-card__unit">{unit}</span>}</span>
            {trend && <span className={`metric-card__trend metric-card__trend--${trend.tone}`}>{trend.label}</span>}
          </>
        )}
      </dd>
      {description && <dd className="metric-card__description">{description}</dd>}
    </dl>
  )
}

import search from './icons/search.svg?raw'
import info from './icons/info-circle.svg?raw'
import warning from './icons/exclamation-circle.svg?raw'
import success from './icons/shield-check.svg?raw'

const icons = { search, info, warning, success }

/** Trusted, repository-owned SVGs from Hub's icon assets and registry. */
export default function HubIcon({ name, className = '' }: {
  name: keyof typeof icons
  className?: string
}) {
  return <span className={`hub-icon ${className}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] }} />
}

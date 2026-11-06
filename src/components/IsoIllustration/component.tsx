import { useId, useMemo } from 'react'
import { renderIsoSvg, type IsoFigure, type IsoRenderOptions } from './figures'
import './component.css'

type IsoGlow = 'auto' | 'on' | 'off'

interface IsoIllustrationProps {
  figure: IsoFigure
  glow?: IsoGlow
  label?: string
  className?: string
  /** Ecosystem figure only: a URL per product zone, which turns that zone into a link. */
  links?: IsoRenderOptions['links']
}

// Isometric line-art illustration. Faces use the neutral surface tokens and only
// live parts use the accent (--iso-accent, the accent colour by default). With
// glow="auto" lit parts glow in the dark theme and stay flat in the light one.
// Decorative unless a label is given.
function IsoIllustration({
  figure,
  glow = 'auto',
  label,
  className = '',
  links,
}: IsoIllustrationProps) {
  // React ids contain colons, which would break the url(#…) filter references.
  const id = `iso-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  // The markup is static and built from ./figures, never from user input.
  const svg = useMemo(() => renderIsoSvg(figure, id, { links }), [figure, id, links])
  const classes = ['iso-illustration', `iso-illustration--glow-${glow}`, className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      // With links the zones stay reachable: a group, not an image that hides them.
      role={label ? (links ? 'group' : 'img') : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default IsoIllustration

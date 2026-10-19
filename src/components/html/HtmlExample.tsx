import { useEffect, useId, useRef } from 'react'
import { enhanceComponents } from './behaviors.js'

/** Renders trusted repository HTML; React only hosts the native example. */
export default function HtmlExample({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const namespacedHtml = html.replace(/\b(id|for|aria-labelledby|aria-describedby)="([^"]+)"/g,
    (_, attribute: string, value: string) => `${attribute}="${value.split(' ').map((token) => `${id}-${token}`).join(' ')}"`)

  useEffect(() => {
    if (ref.current) return enhanceComponents(ref.current)
  }, [namespacedHtml])

  return <div ref={ref} className="hub-ui" data-ui-example dangerouslySetInnerHTML={{ __html: namespacedHtml }} />
}

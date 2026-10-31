import { CATEGORIES, emailHtml, figureUrl, type EmailContent } from './emails'
import { renderEmailFigure } from './figures'

/** The email's figure as an SVG data URI, in its category colours. */
export function figureSrc(email: EmailContent) {
  const { accent, tint } = CATEGORIES[email.category]
  return `data:image/svg+xml,${encodeURIComponent(renderEmailFigure(email.figure, accent, tint))}`
}

/** The email's HTML template for previews: it points at the PNG export on uug.ai, so swap in the SVG it is made from. */
export const previewHtml = (email: EmailContent) => emailHtml(email).replace(figureUrl(email.figure), figureSrc(email))

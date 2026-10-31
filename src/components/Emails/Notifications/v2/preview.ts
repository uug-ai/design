import { CATEGORIES, emailHtml, figureUrl, type NotificationEmailV2 } from './emails'
import { renderEmailFigure } from './figures'
import logo from '../../assets/uug-circle-256.png?inline'

/** The email's figure as an SVG data URI, in its category colours. */
export function figureSrc(email: NotificationEmailV2) {
  const { accent, tint } = CATEGORIES[email.category]
  return `data:image/svg+xml,${encodeURIComponent(renderEmailFigure(email.figure, accent, tint, logo))}`
}

/** The email's HTML template for previews: it points at the PNG export on uug.ai, so swap in the SVG it is made from. */
export const previewHtml = (email: NotificationEmailV2) => emailHtml(email).replace(figureUrl(email.figure), figureSrc(email))

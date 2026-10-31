import { useState } from 'react'
import { fill } from '../fill'
import { CATEGORIES, EMAILS, emailHtml, emailText, figureUrl } from './emails'
import { EMAIL_FIGURES, renderEmailFigure, type EmailFigure } from './figures'

export type NotificationEmailV2Props = {
  template: EmailFigure
  values: Record<string, string>
}

const figureSrc = (figure: EmailFigure) =>
  `data:image/svg+xml,${encodeURIComponent(renderEmailFigure(figure, CATEGORIES[EMAILS[figure].category].accent))}`

export function NotificationEmailV2({ template, values }: NotificationEmailV2Props) {
  const [height, setHeight] = useState(1000)
  // The template points at the PNG export on uug.ai; preview the SVG it is made from.
  const html = emailHtml(EMAILS[template]).replace(figureUrl(template), figureSrc(template))
  return <iframe
    title={`${template} email`}
    srcDoc={fill(html, values)}
    onLoad={event => {
      const document = event.currentTarget.contentDocument
      if (document) setHeight(document.documentElement.scrollHeight)
    }}
    style={{ display: 'block', width: '100%', maxWidth: 640, height, border: 0, borderRadius: 12, background: '#f7f6fa' }}
  />
}

export function NotificationEmailV2Text({ template, values }: NotificationEmailV2Props) {
  return <pre style={{ margin: 0, maxWidth: 640, padding: 24, borderRadius: 12, background: '#f7f6fa', color: '#0b0b12', font: '13px/1.6 Menlo, Consolas, monospace', whiteSpace: 'pre-wrap' }}>
    {fill(emailText(EMAILS[template]), values).trim()}
  </pre>
}

export function NotificationFiguresV2() {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, fontFamily: 'Inter, Arial, sans-serif' }}>
    {EMAIL_FIGURES.map(figure => {
      const { label, accent, tint } = CATEGORIES[EMAILS[figure].category]
      return <figure key={figure} style={{ margin: 0, padding: 16, borderRadius: 12, background: tint }}>
        <img src={figureSrc(figure)} alt="" style={{ display: 'block', width: '100%', height: 130, objectFit: 'contain' }} />
        <figcaption style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: accent }}>{label}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0b0b12', marginTop: 2 }}>{EMAILS[figure].title.replace('{{title}}', 'Detection')}</div>
          <code style={{ fontSize: 12, color: '#626676' }}>{figure}</code>
        </figcaption>
      </figure>
    })}
  </div>
}

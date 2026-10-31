import { useState } from 'react'
import { CATEGORIES, EMAILS, emailText, LICENSE_EMAILS } from './emails'
import { fill } from './fill'
import type { EmailFigure } from './figures'
import { figureSrc, previewHtml } from './preview'
import { render } from './render'

export type EmailProps = {
  template: EmailFigure
  values: Record<string, string>
}

// License templates are filled like hub-license fills them ($name, escaped in the HTML),
// the others like hub-pipeline-notification ({{name}}).
const isLicense = (template: EmailFigure) => template in LICENSE_EMAILS
const fillFor = (template: EmailFigure, body: string, values: Record<string, string>, html: boolean) =>
  isLicense(template) ? render(body, values, html) : fill(body, values)

export function Email({ template, values }: EmailProps) {
  const [height, setHeight] = useState(900)
  return <iframe
    title={`${template} email`}
    srcDoc={fillFor(template, previewHtml(EMAILS[template]), values, true)}
    onLoad={event => {
      const document = event.currentTarget.contentDocument
      if (document) setHeight(document.body.offsetHeight)
    }}
    style={{ display: 'block', width: '100%', maxWidth: 640, height, border: 0, borderRadius: 12, background: '#f7f6fa' }}
  />
}

export function EmailText({ template, values }: EmailProps) {
  return <pre style={{ margin: 0, maxWidth: 640, padding: 24, borderRadius: 12, background: '#f7f6fa', color: '#0b0b12', font: '13px/1.6 Menlo, Consolas, monospace', whiteSpace: 'pre-wrap' }}>
    {fillFor(template, emailText(EMAILS[template]), values, false).trim()}
  </pre>
}

export function EmailOverview() {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, fontFamily: 'Inter, Arial, sans-serif' }}>
    {(Object.keys(EMAILS) as EmailFigure[]).map(figure => {
      const { label, accent, tint } = CATEGORIES[EMAILS[figure].category]
      return <figure key={figure} style={{ margin: 0, padding: 12, borderRadius: 12, background: tint }}>
        <img src={figureSrc(EMAILS[figure])} alt="" style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', borderRadius: 8 }} />
        <figcaption style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: accent }}>{label}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0b0b12', marginTop: 2 }}>{EMAILS[figure].title.replace('{{title}}', 'Detection')}</div>
          <code style={{ fontSize: 12, color: '#626676' }}>{figure}</code>
        </figcaption>
      </figure>
    })}
  </div>
}

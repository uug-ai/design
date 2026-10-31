import html from './template.html?raw'
import text from './template.txt?raw'
import { useState } from 'react'
import { emailText, LICENSE_EMAILS } from '../Notifications/v2/emails'
import { previewHtml } from '../Notifications/v2/preview'
import { licenseValues, render, type LicenseEmailProps } from './render'

// Copies of uug-ai/hub-license .github/license-email/template.{html,txt}.
export function LicenseEmail(props: LicenseEmailProps) {
  return <iframe
    title={`Augment Vision license email for ${props.company}`}
    srcDoc={render(html, licenseValues(props), true)}
    style={{ display: 'block', width: '100%', maxWidth: 640, height: 720, border: 0, borderRadius: 12, background: '#f7f6fa' }}
  />
}

export function LicenseEmailText(props: LicenseEmailProps) {
  return <pre style={{ margin: 0, maxWidth: 640, padding: 24, borderRadius: 12, background: '#f7f6fa', color: '#0b0b12', font: '13px/1.6 Menlo, Consolas, monospace', whiteSpace: 'pre-wrap' }}>
    {render(text, licenseValues(props), false)}
  </pre>
}

export type LicenseEmailV2Props = LicenseEmailProps & { kind: keyof typeof LICENSE_EMAILS }

// The v2 license emails, on the layout of Emails / Notifications v2.
export function LicenseEmailV2({ kind, ...props }: LicenseEmailV2Props) {
  const [height, setHeight] = useState(900)
  return <iframe
    title={`Augment Vision license email (${kind}) for ${props.company}`}
    srcDoc={render(previewHtml(LICENSE_EMAILS[kind]), licenseValues(props), true)}
    onLoad={event => {
      const document = event.currentTarget.contentDocument
      if (document) setHeight(document.body.offsetHeight)
    }}
    style={{ display: 'block', width: '100%', maxWidth: 640, height, border: 0, borderRadius: 12, background: '#f7f6fa' }}
  />
}

export function LicenseEmailV2Text({ kind, ...props }: LicenseEmailV2Props) {
  return <pre style={{ margin: 0, maxWidth: 640, padding: 24, borderRadius: 12, background: '#f7f6fa', color: '#0b0b12', font: '13px/1.6 Menlo, Consolas, monospace', whiteSpace: 'pre-wrap' }}>
    {render(emailText(LICENSE_EMAILS[kind]), licenseValues(props), false).trim()}
  </pre>
}

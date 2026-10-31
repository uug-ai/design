import { useState } from 'react'

// Copies of the TEMPLATE_* strings in uug-ai/hub-pipeline-notification templates/*.go, saved
// under the names the service looks them up by (templates.GetTemplate).
const html = import.meta.glob<string>('./templates/*.html', { query: '?raw', import: 'default', eager: true })
const text = import.meta.glob<string>('./templates/*.txt', { query: '?raw', import: 'default', eager: true })

export type NotificationTemplate =
  | 'welcome' | 'activate' | 'forgot' | 'newip' | 'detection' | 'device' | 'device_group'
  | 'disable' | 'highupload' | 'share' | 'share_case' | 'share_case_otp' | 'assign_task'

export type NotificationEmailProps = {
  template: NotificationTemplate
  values: Record<string, string>
}

// Mirrors channels/smtp.go ReplaceValues: the tab titles are always cleared and every
// {{key}} with a value is replaced. Placeholders without a value stay in the email, as
// they do when the service sends it.
function render(body: string, values: Record<string, string>) {
  return body.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (match, key: string) => {
    if (key === 'tab1_title' || key === 'tab2_title') return ''
    return values[key] ?? match
  })
}

export function NotificationEmail({ template, values }: NotificationEmailProps) {
  const [height, setHeight] = useState(900)
  return <iframe
    title={`${template} email`}
    srcDoc={render(html[`./templates/${template}.html`], values)}
    onLoad={event => {
      const document = event.currentTarget.contentDocument
      if (document) setHeight(document.documentElement.scrollHeight)
    }}
    style={{ display: 'block', width: '100%', maxWidth: 720, height, border: 0, borderRadius: 12, background: '#ffffff' }}
  />
}

export function NotificationEmailText({ template, values }: NotificationEmailProps) {
  return <pre style={{ margin: 0, maxWidth: 720, padding: 24, borderRadius: 12, background: '#f7f6fa', color: '#0b0b12', font: '13px/1.6 Menlo, Consolas, monospace', whiteSpace: 'pre-wrap' }}>
    {render(text[`./templates/${template}.txt`], values).trim()}
  </pre>
}

import html from './template.html?raw'
import text from './template.txt?raw'

// Copies of uug-ai/hub-license .github/license-email/template.{html,txt}, rendered there with
// Python's string.Template: $name is a placeholder and $$ a literal dollar sign.
export type LicenseEmailProps = { company: string; cameras: number; issued: string; validity: string }

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')

function render(template: string, props: LicenseEmailProps, escapeValues: boolean) {
  const values: Record<string, string> = {
    subject: `Your Augment Vision license for ${props.company}`,
    company: props.company,
    cameras: String(props.cameras),
    vaults: '1',
    sites: '1',
    issued: props.issued,
    validity: props.validity,
  }
  return template.replace(/\$(\$|[a-z_]+)/g, (match, name: string) => {
    if (name === '$') return '$'
    const value = values[name]
    if (value === undefined) return match
    return escapeValues ? escape(value) : value
  })
}

export function LicenseEmail(props: LicenseEmailProps) {
  return <iframe
    title={`Augment Vision license email for ${props.company}`}
    srcDoc={render(html, props, true)}
    style={{ display: 'block', width: '100%', maxWidth: 640, height: 720, border: 0, borderRadius: 12, background: '#f7f6fa' }}
  />
}

export function LicenseEmailText(props: LicenseEmailProps) {
  return <pre style={{ margin: 0, maxWidth: 640, padding: 24, borderRadius: 12, background: '#f7f6fa', color: '#0b0b12', font: '13px/1.6 Menlo, Consolas, monospace', whiteSpace: 'pre-wrap' }}>
    {render(text, props, false)}
  </pre>
}

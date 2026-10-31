// hub-license renders its email templates with Python's string.Template: $name is a
// placeholder and $$ a literal dollar sign. Values go into the HTML version escaped.
export type LicenseEmailProps = { company: string; cameras: number; issued: string; validity: string; expires?: string }

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')

export const licenseValues = (props: LicenseEmailProps): Record<string, string> => ({
  subject: `Your Augment Vision license for ${props.company}`,
  company: props.company,
  cameras: String(props.cameras),
  vaults: '1',
  sites: '1',
  issued: props.issued,
  validity: props.validity,
  ...(props.expires ? { expires: props.expires } : {}),
})

export function render(template: string, values: Record<string, string>, escapeValues: boolean) {
  return template.replace(/\$(\$|[a-z_]+)/g, (match, name: string) => {
    if (name === '$') return '$'
    const value = values[name]
    if (value === undefined) return match
    return escapeValues ? escape(value) : value
  })
}

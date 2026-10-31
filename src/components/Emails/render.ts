// hub-license renders its email templates with Python's string.Template: $name is a
// placeholder and $$ a literal dollar sign. Values go into the HTML version escaped.
const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')

export function render(template: string, values: Record<string, string>, escapeValues: boolean) {
  return template.replace(/\$(\$|[a-z_]+)/g, (match, name: string) => {
    if (name === '$') return '$'
    const value = values[name]
    if (value === undefined) return match
    return escapeValues ? escape(value) : value
  })
}

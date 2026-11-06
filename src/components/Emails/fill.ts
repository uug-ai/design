// Mirrors hub-pipeline-notification channels/smtp.go ReplaceValues: the tab titles are
// always cleared and every {{key}} with a value is replaced. Placeholders without a
// value stay in the email, as they do when the service sends it.
export function fill(body: string, values: Record<string, string>) {
  return body.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (match, key: string) => {
    if (key === 'tab1_title' || key === 'tab2_title') return ''
    return values[key] ?? match
  })
}

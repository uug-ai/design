import { createElement } from 'react'
import { EmailText, type EmailProps } from './component'
import { EMAILS } from './emails'
import type { EmailFigure } from './figures'
import { SAMPLES } from './samples'

// Shared pieces for the per-email stories under Emails/<email>.

/** Story args: the template with its sample values, overridden by `values`. */
export const example = (template: EmailFigure, values: Record<string, string> = {}): EmailProps =>
  ({ template, values: { ...SAMPLES[template], ...values } })

/** Docs parameters for an email page: what the email is for, plus its subject line(s). */
export function about(purpose: string, ...templates: EmailFigure[]) {
  const subjects = templates.map(template => `“${EMAILS[template].subject}”`).join(', ')
  return { docs: { description: { component: `${purpose} Subject: ${subjects}. Edit \`values\` in Controls to try other content.` } } }
}

/** A story showing the text/plain alternative of `template` with its sample values. */
export const plainText = (template: EmailFigure, values: Record<string, string> = {}) => ({
  args: example(template, values),
  parameters: { docs: { description: { story: 'The text/plain alternative, generated from the same content as the HTML.' } } },
  render: (args: EmailProps) => createElement(EmailText, args),
})

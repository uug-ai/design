import type { EmailFigure } from './figures'

// The v2 notification emails: the license email's layout, with a category colour and a
// spot illustration per email so its purpose reads at a glance. Placeholders are the
// ones hub-pipeline-notification already fills ({{user}}, {{link}}, ...), so the
// generated templates can replace the current ones name for name.

export type EmailCategory = 'account' | 'security' | 'detections' | 'cameras' | 'usage' | 'sharing' | 'tasks'

export const CATEGORIES: Record<EmailCategory, { label: string; accent: string; tint: string }> = {
  account: { label: 'Account', accent: '#2713ff', tint: '#efedff' },
  security: { label: 'Security', accent: '#d10650', tint: '#fdeaf1' },
  detections: { label: 'Detection', accent: '#7426ff', tint: '#f3ecff' },
  cameras: { label: 'Camera status', accent: '#d9480f', tint: '#fff0e8' },
  usage: { label: 'Usage', accent: '#b45309', tint: '#fdf3e3' },
  sharing: { label: 'Sharing', accent: '#0b7fb3', tint: '#e6f5fc' },
  tasks: { label: 'Tasks', accent: '#2f855a', tint: '#e8f6ee' },
}

export interface NotificationEmailV2 {
  figure: EmailFigure
  category: EmailCategory
  subject: string
  title: string
  intro: string
  rows?: [string, string][]
  // Raw HTML for the block under the details, e.g. a thumbnail or the device sections.
  block?: string
  blockText?: string
  body?: string
  cta?: { label: string; href: string }
  secondary?: { label: string; href: string }
}

const code = (value: string) => `<span style="font-family:Menlo,Consolas,monospace;font-size:13px;">${value}</span>`

export const EMAILS: Record<EmailFigure, NotificationEmailV2> = {
  welcome: {
    figure: 'welcome', category: 'account',
    subject: 'Welcome to Hub',
    title: 'Welcome to Hub',
    intro: 'Hi {{user}}, your account is almost ready.<br>Activate it to get started.',
    body: 'With Hub you watch your cameras from anywhere, get alerts when something happens and search through your recordings.',
    cta: { label: 'Activate your account', href: '{{link}}' },
  },
  activate: {
    figure: 'activate', category: 'account',
    subject: 'Your Hub account is active',
    title: 'Your account is active',
    intro: 'Hi {{user}}, you are all set.<br>Sign in to start exploring Hub.',
    body: 'Try the features you need first; when you are ready, pick the plan that fits and pay only for what you use.',
    cta: { label: 'Sign in to Hub', href: '{{link}}' },
  },
  forgot: {
    figure: 'forgot', category: 'security',
    subject: 'Your new Hub password',
    title: 'Your new password',
    intro: 'Hi {{user}}, someone asked for a new password<br>for your account. We hope it was you.',
    rows: [['New password', code('{{password}}')], ['Requested from', '{{ipaddress}}']],
    body: 'Your current password keeps working until you sign in with the new one. If you did not ask for this, you can ignore this email.',
  },
  newip: {
    figure: 'newip', category: 'security',
    subject: 'New sign-in to your Hub account',
    title: 'New sign-in to your account',
    intro: 'Hi {{user}}, someone signed in to your account<br>from a new location.',
    rows: [['IP address', '{{ipaddress}}']],
    body: 'If this was you, there is nothing to do. If it was not, change your password right away.',
    cta: { label: 'Change your password', href: '{{link}}' },
  },
  detection: {
    figure: 'detection', category: 'detections',
    subject: '{{title}} on {{devicename}}',
    title: '{{title}}',
    intro: '{{text}}',
    rows: [['Camera', '{{devicename}}'], ['Detected', '{{datetime}}']],
    block: '<div style="border-radius:8px;overflow:hidden;line-height:0;">{{thumbnail}}</div>',
    body: 'Getting alerts you do not need? Change the alert conditions in Hub.',
    cta: { label: 'Watch recording', href: '{{link}}' },
    secondary: { label: 'Open media page', href: '{{medialink}}' },
  },
  device: {
    figure: 'device', category: 'cameras',
    subject: 'A camera changed status',
    title: 'A camera changed status',
    intro: 'Hi {{user}}, {{text}}',
    body: 'Cameras usually go offline when the machine running their Agent loses power or internet, or when the camera is disconnected or damaged. Check the latest recordings and the Agent connection in Hub.',
    cta: { label: 'Open cameras', href: '{{link}}' },
  },
  device_group: {
    figure: 'device_group', category: 'cameras',
    subject: 'Several cameras changed status',
    title: 'Several cameras changed status',
    intro: 'Hi {{user}}, {{text}}',
    block: '{{sections}}',
    blockText: '{{sectionsText}}',
    body: 'Cameras that change status together usually share a cause, such as a site losing or regaining its internet connection or power.',
    cta: { label: 'Open cameras', href: '{{link}}' },
  },
  disable: {
    figure: 'disable', category: 'usage',
    subject: 'Daily upload limit reached',
    title: 'Daily upload limit reached',
    intro: 'Hi {{user}}, your account reached its daily limit,<br>so uploads are paused for 6 hours.',
    rows: [['Uploaded today', '{{dataUsage}} GB'], ['Uploads resume', 'in 6 hours']],
    body: 'Until then, new recordings are not uploaded to Hub. If you reach the limit often, a larger plan avoids the pause.',
    cta: { label: 'View your plan', href: '{{link}}' },
  },
  highupload: {
    figure: 'highupload', category: 'usage',
    subject: 'Unusually many uploads',
    title: 'Unusually many uploads',
    intro: 'Hi {{user}}, your Agents uploaded more recordings<br>than usual and your high upload alert went off.',
    body: 'This can mean something unusual is happening on site. If it is a false alarm, raise the threshold in the alert settings.',
    cta: { label: 'Open Hub', href: '{{link}}' },
  },
  share: {
    figure: 'share', category: 'sharing',
    subject: '{{user}} shared a recording with you',
    title: 'A recording was shared with you',
    intro: '{{user}} sent you a recording:<br><strong style="color:#0b0b12;font-weight:600;">{{title}}</strong>',
    block: '<div style="padding:14px 18px;border-left:3px solid #e0dced;background-color:#f7f6fa;border-radius:0 8px 8px 0;font-size:15px;line-height:24px;color:#0b0b12;">{{body}}</div>',
    blockText: '"{{body}}"',
    cta: { label: 'Watch recording', href: '{{url}}' },
  },
  share_case: {
    figure: 'share_case', category: 'sharing',
    subject: '{{user}} shared a case with you',
    title: 'A case was shared with you',
    intro: '{{user}} shared a case with you. The share page<br>asks for a one-time code before it opens.',
    rows: [['Link expires in', '{{expiry}}']],
    cta: { label: 'Open case', href: '{{url}}' },
  },
  share_case_otp: {
    figure: 'share_case_otp', category: 'sharing',
    subject: 'Your verification code',
    title: 'Your verification code',
    intro: 'Enter this code on the share page<br>to open the case.',
    block: '<div style="padding:18px;text-align:center;background-color:#f7f6fa;border-radius:8px;font-family:Menlo,Consolas,monospace;font-size:30px;line-height:36px;font-weight:600;letter-spacing:0.3em;color:#0b0b12;">{{code}}</div>',
    blockText: '{{code}}',
    body: 'The code expires in {{expiry}}. Did not request it? You can ignore this email.',
  },
  assign_task: {
    figure: 'assign_task', category: 'tasks',
    subject: 'New task: {{task_name}}',
    title: 'You have a new task',
    intro: 'Hi {{assignee}}, {{user}} assigned<br>a task to you in Hub.',
    rows: [['Task', '{{task_name}}'], ['Assigned by', '{{user}}']],
    cta: { label: 'View task', href: '{{link}}' },
  },
}

// Where the PNG exports of the figures are served from once the emails go live.
export const figureUrl = (figure: EmailFigure) => `https://uug.ai/email/${figure}.png`

const row = ([label, value]: [string, string], last: boolean) => {
  const edge = `border-top:1px solid #f0eef5;${last ? 'border-bottom:1px solid #f0eef5;' : ''}`
  return `<tr><td style="padding:10px 0;color:#626676;${edge}">${label}</td><td style="padding:10px 0;text-align:right;${edge}">${value}</td></tr>`
}

/** The email's HTML template, with the service placeholders still in it. */
export function emailHtml(email: NotificationEmailV2) {
  const { accent, tint, label } = CATEGORIES[email.category]
  const rows = email.rows?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:20px;margin-bottom:28px;">\n${email.rows.map((r, i) => row(r, i === email.rows!.length - 1)).join('\n')}\n</table>`
    : ''
  const block = email.block ? `<div style="margin-bottom:28px;">${email.block}</div>` : ''
  const body = email.body ? `<p style="margin:0 0 28px;font-size:15px;line-height:24px;">${email.body}</p>` : ''
  const secondary = email.secondary
    ? `<td style="padding-left:16px;"><a href="${email.secondary.href}" style="font-size:14px;font-weight:500;color:${accent};text-decoration:none;">${email.secondary.label} &rarr;</a></td>`
    : ''
  const cta = email.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;"><tr><td style="border-radius:8px;background-color:${accent};">
<a href="${email.cta.href}" style="display:inline-block;padding:11px 20px;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:8px;">${email.cta.label}</a>
</td>${secondary}</tr></table>`
    : ''
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${email.subject}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#f7f6fa;">
<div style="display:none;max-height:0;overflow:hidden;">${email.intro.replace(/<br>/g, ' ').replace(/<[^>]+>/g, '')}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f6fa;">
<tr><td align="center" style="padding:48px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0b0b12;">
<tr><td style="height:4px;line-height:4px;font-size:0;border-radius:12px 12px 0 0;background-color:${accent};">&nbsp;</td></tr>
<tr><td style="background-color:#ffffff;border:1px solid #ebe8f2;border-top:0;border-radius:0 0 12px 12px;padding:28px 40px 8px;">
<div style="background-color:${tint};border-radius:10px;padding:12px 24px;margin-bottom:28px;text-align:center;line-height:0;"><img src="${figureUrl(email.figure)}" width="200" alt="" style="display:inline-block;width:100%;max-width:200px;height:auto;border:0;"></div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr>
<td style="vertical-align:middle;padding-right:20px;">
<div style="display:inline-block;padding:3px 10px;border-radius:999px;background-color:${tint};color:${accent};font-size:12px;line-height:18px;font-weight:600;letter-spacing:0.02em;">${label}</div>
<div style="font-family:Outfit,Inter,Arial,sans-serif;font-size:24px;line-height:30px;font-weight:600;margin-top:12px;">${email.title}</div>
<p style="margin:8px 0 0;font-size:15px;line-height:24px;color:#626676;">${email.intro}</p>
</td>
<td align="right" width="56" style="vertical-align:middle;"><img src="https://uug.ai/brand/uug-circle-128.png" width="56" height="56" alt="UUG" style="display:block;border:0;border-radius:50%;"></td>
</tr></table>
${rows}
${block}
${body}
${cta}
<p style="margin:0 0 32px;font-size:15px;line-height:24px;color:#626676;">Questions? Just reply to this email.<br>The Augment Vision team</p>
</td></tr>
<tr><td style="padding:24px 4px 0;font-size:12px;line-height:18px;color:#8a8d9c;">You receive this email because of your Hub notification settings. &middot; <a href="https://uug.ai" style="color:#8a8d9c;">uug.ai</a></td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`
}

const plain = (html: string) => html.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '').replace(/&rarr;/g, '->')

/** The text/plain alternative, built from the same content as the HTML. */
export function emailText(email: NotificationEmailV2) {
  const parts = [
    `${CATEGORIES[email.category].label.toUpperCase()}: ${plain(email.title)}`,
    plain(email.intro),
    email.rows?.map(([label, value]) => `  ${label}: ${plain(value)}`).join('\n'),
    email.blockText ?? (email.block && !email.block.includes('{{thumbnail}}') ? plain(email.block) : undefined),
    email.body && plain(email.body),
    email.cta && `${email.cta.label}: ${email.cta.href}`,
    email.secondary && `${email.secondary.label}: ${email.secondary.href}`,
    'Questions? Just reply to this email.\nThe Augment Vision team',
    '--\nYou receive this email because of your Hub notification settings. https://uug.ai',
  ]
  return parts.filter(Boolean).join('\n\n') + '\n'
}

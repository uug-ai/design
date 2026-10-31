import type { NotificationTemplate } from './component'

// Sample values for the notification stories, keyed by template name.

// The {{sections}} markup hub-monitor-device renders for device_group (grouping.go renderSectionsHTML).
const font = 'font-family: Inter, Arial, sans-serif; font-style: normal; letter-spacing: 0em; text-align: left;'
const sections = [
  { title: 'Site Bijlokehof · Offline · all 3 cameras', cameras: [['Entrance', 'no response for 12 min'], ['Parking', 'no response for 12 min'], ['Loading dock', 'no response for 11 min']] },
  { title: 'Other cameras · Back online · 1 camera', cameras: [['Warehouse', 'online']] },
]
const sectionsHTML = sections.map(section =>
  `<p style="${font} font-size: 14px; font-weight: 600; line-height: 24px; color: #262424; margin: 16px 0 4px 0;">${section.title}</p>\n`
  + '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">\n'
  + section.cameras.map(([name, detail]) =>
    `<tr><td style="${font} font-size: 14px; line-height: 24px; color: #262424; padding: 6px 0; border-top: 1px solid #EEEEEE;">${name}</td>`
    + `<td style="${font} font-size: 14px; line-height: 24px; color: #6D6666; padding: 6px 0; border-top: 1px solid #EEEEEE; text-align: right;">${detail}</td></tr>\n`).join('')
  + '</table>\n').join('')
const sectionsText = sections.map(section => [section.title, ...section.cameras.map(([name, detail]) => `- ${name} (${detail})`)].join('\n')).join('\n\n')

// Stands in for the recording thumbnail the service embeds as cid:thumbnail.png.
const thumbnail = `<img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#2b2b33"/><rect x="250" y="90" width="120" height="200" rx="12" fill="none" stroke="#19c6ff" stroke-width="4"/><text x="254" y="82" fill="#19c6ff" font-family="Arial" font-size="18">person 0.94</text><text x="20" y="340" fill="#ffffff" font-family="Arial" font-size="16">Entrance · 2026-10-31 14:32:05</text></svg>')}" width="100%" height="auto" />`

const user = 'jane.doe'
const app = 'https://app.kerberos.io'

export const SAMPLES: Record<NotificationTemplate, Record<string, string>> = {
  welcome: { user, link: `${app}/activate/3f9c2a` },
  activate: { user, link: `${app}/login` },
  forgot: { user, password: 'k7Rt-29xq-Lm4p', ipaddress: '84.198.12.40' },
  newip: { user, ipaddress: '84.198.12.40', link: `${app}/settings` },
  detection: { user, title: 'Person detected', text: 'A person was detected on Entrance.', devicename: 'Entrance', datetime: '2026-10-31 14:32:05', thumbnail, link: `${app}/media/6543e1f0`, medialink: `${app}/media/6543e1f0` },
  device: { user, text: 'Entrance went offline: no response for 12 min.', link: `${app}/devices` },
  device_group: { user, text: '4 cameras changed status: 3 offline, 1 back online.', sections: sectionsHTML, sectionsText, link: `${app}/devices` },
  disable: { user, dataUsage: '50', text: 'Your account uploaded 50 GB of recordings today.', link: `${app}/subscription` },
  highupload: { user, link: `${app}/alerts` },
  share: { user, title: 'Entrance, 31 October 14:32', body: 'Can you check who this is?', url: `${app}/share/9b1d4e` },
  share_case: { user, url: `${app}/cases/share/c81f07`, expiry: '7 days' },
  share_case_otp: { code: '482913', expiry: '10 minutes' },
  assign_task: { user, assignee: 'sam.peeters', task_name: 'Review entrance footage', link: `${app}/tasks/71aa3c` },
}

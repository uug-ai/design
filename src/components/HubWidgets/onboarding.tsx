import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Building, Check, CreditCard, Folder, Group, Home, Mail, Plus, Trash, User, WarningCircle } from 'iconoir-react'
import IsoIllustration from '../IsoIllustration'
import { HubButton, HubInput, HubSelect, HubTextarea, HubToggle } from './controls'
import type { HubOption } from './controls'
import { ONBOARDING_ROLES, emptyOnboardingData } from './onboarding-data'
import type { HubOnboardingContact, HubOnboardingData, HubOnboardingInvitation, HubOnboardingInvite, HubOnboardingStep, HubOnboardingTask } from './onboarding-data'
import { HubInfobox } from './feedback'
import './onboarding.css'

export type { HubOnboardingStep, HubOnboardingData, HubOnboardingInvitation, HubOnboardingTask } from './onboarding-data'

/**
 * The first sign-in of an account without an organisation (hub-api
 * ONBOARDING_ENABLED). A welcome that offers pending invitations, then a
 * wizard that sets up the profile, the organisation, its billing contact, the
 * first members and the first project, a review, and the creation itself.
 *
 * Only the organisation name and the project name are required; every other
 * field can be left for later in the settings. Each field maps to what the API
 * stores today (uug-ai/models): the user's firstname, lastname and timezone;
 * the organisation's name, description, company details, regional settings,
 * financial and technical contacts and billing address; invitations with one
 * built-in role assignment; the project's name and description.
 */
const WIZARD: { step: HubOnboardingStep; label: string; icon: ReactNode; optional?: boolean }[] = [
  { step: 'profile', label: 'Your profile', icon: <User />, optional: true },
  { step: 'organisation', label: 'Organisation', icon: <Building /> },
  { step: 'billing', label: 'Billing & contacts', icon: <CreditCard />, optional: true },
  { step: 'team', label: 'Invite your team', icon: <Group />, optional: true },
  { step: 'project', label: 'First project', icon: <Folder /> },
  { step: 'review', label: 'Review', icon: <Check /> },
]

const TIMEZONES: HubOption[] = ['Europe/Brussels', 'Europe/Amsterdam', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
  'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'America/Santiago', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney', 'UTC']
  .map(zone => ({ value: zone, text: zone.replace('_', ' ') }))
const LANGUAGES: HubOption[] = [['en', 'English'], ['nl', 'Nederlands'], ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español'], ['it', 'Italiano'],
  ['pt', 'Português'], ['sv', 'Svenska'], ['pl', 'Polski'], ['tr', 'Türkçe'], ['ar', 'العربية'], ['hi', 'हिन्दी'], ['ja', '日本語'], ['zh', '中文']]
  .map(([value, text]) => ({ value, text }))
const LOCALES: HubOption[] = [['en-GB', 'English (United Kingdom)'], ['en-US', 'English (United States)'], ['nl-BE', 'Nederlands (België)'],
  ['nl-NL', 'Nederlands (Nederland)'], ['fr-BE', 'Français (Belgique)'], ['fr-FR', 'Français (France)'], ['de-DE', 'Deutsch (Deutschland)'], ['es-ES', 'Español (España)']]
  .map(([value, text]) => ({ value, text }))
const CURRENCIES: HubOption[] = ['EUR', 'USD', 'GBP', 'CHF', 'SEK', 'PLN', 'JPY', 'AUD'].map(code => ({ value: code, text: code }))
const INDUSTRIES: HubOption[] = ['Security & surveillance', 'Retail', 'Logistics & transport', 'Manufacturing', 'Construction', 'Education',
  'Healthcare', 'Public sector', 'Hospitality', 'Real estate', 'Other'].map(text => ({ value: text, text }))
const COUNTRIES: HubOption[] = [['BE', 'Belgium'], ['NL', 'Netherlands'], ['LU', 'Luxembourg'], ['FR', 'France'], ['DE', 'Germany'], ['GB', 'United Kingdom'],
  ['ES', 'Spain'], ['IT', 'Italy'], ['US', 'United States'], ['CL', 'Chile'], ['AU', 'Australia'], ['JP', 'Japan']]
  .map(([value, text]) => ({ value, text }))

const roleText = (value: string) => ONBOARDING_ROLES.find(role => role.value === value)?.text ?? value
const filled = (invites: HubOnboardingInvite[]) => invites.filter(invite => invite.email.trim())
const emailLike = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

/** The default project's short name: the API mints it (models.DefaultProjectSlug) and keeps it, whatever the project is called. */
const PROJECT_SLUG = 'project-1'

/** Hub onboarding: welcome, wizard and creation for an account without an organisation. */
export function HubOnboarding({
  account, invitations = [], step: initialStep = 'welcome', data: initialData, errors: initialErrors = {},
  tasks, canCreate = true, onFinish, onSignOut, brand = 'Hub',
}: {
  account: { username: string; email: string }
  /** Open invitations to the account's own address (GET /onboarding). */
  invitations?: HubOnboardingInvitation[]
  step?: HubOnboardingStep
  data?: HubOnboardingData
  /** Field errors by path, e.g. { 'organisation.name': '…' }, as the API answers them. */
  errors?: Record<string, string>
  /** The creation progress shown on the creating and done steps. */
  tasks?: HubOnboardingTask[]
  /** False when the deployment turns organisation creation off: only invitations remain. */
  canCreate?: boolean
  onFinish?: (data: HubOnboardingData) => void
  onSignOut?: () => void
  brand?: string
}) {
  const [step, setStep] = useState<HubOnboardingStep>(initialStep)
  const [data, setData] = useState<HubOnboardingData>(initialData ?? emptyOnboardingData())
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors)
  const [joined, setJoined] = useState<HubOnboardingInvitation | null>(null)

  const set = <K extends keyof HubOnboardingData>(section: K, patch: Partial<HubOnboardingData[K]>) =>
    setData(current => ({ ...current, [section]: { ...(current[section] as object), ...patch } }))
  const field = (path: string) => errors[path]

  const personal = data.organisation.kind === 'personal'
  // Personal use has no company and no one else to bill: no billing step.
  const steps = WIZARD.filter(entry => !(personal && entry.step === 'billing'))
  const index = steps.findIndex(entry => entry.step === step)
  const go = (next: HubOnboardingStep) => { setErrors({}); setStep(next) }
  const back = () => go(index > 0 ? steps[index - 1].step : 'welcome')

  const validate = (): Record<string, string> => {
    const found: Record<string, string> = {}
    if (step === 'organisation' && !data.organisation.name.trim()) found['organisation.name'] = 'Give your organisation a name.'
    if (step === 'organisation' && data.organisation.name.length > 100) found['organisation.name'] = 'Use at most 100 characters.'
    if (step === 'billing' && !data.billing.financialIsMe && data.billing.financial.email && !emailLike(data.billing.financial.email)) {
      found['billing.financial.email'] = 'Enter an email address, like finance@company.com.'
    }
    if (step === 'team') {
      data.invites.forEach((invite, i) => {
        if (invite.email.trim() && !emailLike(invite.email)) found[`invites.${i}.email`] = 'Enter an email address.'
        if (invite.email.trim().toLowerCase() === account.email.toLowerCase()) found[`invites.${i}.email`] = 'That is your own address.'
      })
    }
    if (step === 'project' && !data.project.name.trim()) found['project.name'] = 'Give your first project a name.'
    return found
  }

  const next = (event?: FormEvent) => {
    event?.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return
    if (step === 'review') { onFinish?.(data); setStep('creating'); return }
    go(steps[index + 1].step)
  }

  if (step === 'welcome' || joined) {
    return <Welcome account={account} invitations={invitations} canCreate={canCreate} joined={joined}
      onJoin={setJoined} onCreate={() => go('profile')} onSignOut={onSignOut} brand={brand} />
  }
  if (step === 'creating' || step === 'done') {
    return <Creating data={data} tasks={tasks ?? defaultTasks(data, step === 'done')} brand={brand} />
  }

  const current = steps[index]
  return (
    <div className="hub-onboarding">
      <main className="hub-onboarding-card hub-onboarding-card--wizard">
        <aside className="hub-onboarding-rail" aria-label="Set-up steps">
          <p className="hub-onboarding-brand">Set up {brand}</p>
          <ol className="hub-onboarding-steps">
            {steps.map((entry, i) => (
              <li key={entry.step} className={`hub-onboarding-step ${i < index ? 'is-done' : ''} ${i === index ? 'is-current' : ''}`}
                aria-current={i === index ? 'step' : undefined}>
                <button type="button" disabled={i > index} onClick={() => go(entry.step)}>
                  <span className="hub-onboarding-step-icon" aria-hidden="true">{i < index ? <Check /> : entry.icon}</span>
                  <span className="hub-onboarding-step-text">
                    {entry.label}{entry.optional && <small>Optional</small>}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="hub-onboarding-account">Signed in as <strong>{account.email}</strong></p>
        </aside>

        <form className="hub-onboarding-panel" onSubmit={next} noValidate>
          <div className="hub-onboarding-progress" aria-hidden="true">
            <span>Step {index + 1} of {steps.length}</span>
            <span className="hub-onboarding-progress-bar"><span style={{ width: `${((index + 1) / steps.length) * 100}%` }} /></span>
          </div>
          <header className="hub-onboarding-head">
            <h1>{step === 'organisation' && personal ? 'Create your personal organisation' : TITLES[current.step].title}</h1>
            <p>{step === 'organisation' && personal ? 'A personal organisation holds your own projects and subscription, without company details. You become its owner and can invite others later.' : TITLES[current.step].text}</p>
          </header>

          <div className="hub-onboarding-body">
            {step === 'profile' && <>
              <div className="hub-onboarding-grid">
                <HubInput label="First name" autoComplete="given-name" value={data.profile.firstName} autoFocus
                  onChange={e => set('profile', { firstName: e.target.value })} />
                <HubInput label="Last name" autoComplete="family-name" value={data.profile.lastName}
                  onChange={e => set('profile', { lastName: e.target.value })} />
                <HubSelect label="Time zone" options={TIMEZONES} value={data.profile.timezone}
                  onChange={timezone => set('profile', { timezone })} />
                <HubSelect label="Language" options={LANGUAGES} value={data.profile.language}
                  onChange={language => set('profile', { language })} />
              </div>
              <p className="hub-onboarding-hint">Recordings and events show in your time zone. You can change all of this later in your profile.</p>
            </>}

            {step === 'organisation' && <>
              <fieldset className="hub-onboarding-kind">
                <legend>What kind of organisation?</legend>
                {KINDS.map(kind => (
                  <label key={kind.value} className={`hub-onboarding-kind-option ${data.organisation.kind === kind.value ? 'is-selected' : ''}`}>
                    <input type="radio" name="kind" value={kind.value} checked={data.organisation.kind === kind.value}
                      onChange={() => set('organisation', { kind: kind.value })} />
                    <span className="hub-onboarding-kind-icon" aria-hidden="true">{kind.icon}</span>
                    <span className="hub-onboarding-kind-text"><strong>{kind.title}</strong><small>{kind.text}</small></span>
                  </label>
                ))}
              </fieldset>
              <HubInput label="Organisation name" required maxLength={100} value={data.organisation.name}
                placeholder={personal ? 'e.g. Sarah\'s home' : 'e.g. Acme Security'} error={field('organisation.name')}
                onChange={e => set('organisation', { name: e.target.value })} />
              <HubTextarea label="Description (optional)" rows={2} value={data.organisation.description}
                placeholder={personal ? 'e.g. House and holiday home' : 'What the organisation monitors, for whom'}
                onChange={e => set('organisation', { description: e.target.value })} />
              {!personal && <Section title="Company details" note="Shown on invoices. Leave empty if you are not a company.">
                <div className="hub-onboarding-grid">
                  <HubInput label="Legal name" value={data.organisation.legalName} placeholder="Acme Security NV"
                    onChange={e => set('organisation', { legalName: e.target.value })} />
                  <HubInput label="Trading name" value={data.organisation.tradingName}
                    onChange={e => set('organisation', { tradingName: e.target.value })} />
                  <HubInput label="VAT number" value={data.organisation.vatNumber} placeholder="BE0123456789"
                    onChange={e => set('organisation', { vatNumber: e.target.value })} />
                  <HubInput label="Registration number" value={data.organisation.registrationNumber}
                    onChange={e => set('organisation', { registrationNumber: e.target.value })} />
                  <HubSelect label="Industry" options={INDUSTRIES} value={data.organisation.industry}
                    onChange={industry => set('organisation', { industry })} />
                  <HubInput label="Website" type="url" value={data.organisation.website} placeholder="https://"
                    onChange={e => set('organisation', { website: e.target.value })} />
                </div>
              </Section>}
              <Section title="Regional defaults" note={personal ? 'How dates, times and prices show.' : 'Used for everyone in the organisation, unless members set their own.'}>
                <div className="hub-onboarding-grid hub-onboarding-grid--three">
                  <HubSelect label="Time zone" options={TIMEZONES} value={data.organisation.timezone}
                    onChange={timezone => set('organisation', { timezone })} />
                  <HubSelect label="Locale" options={LOCALES} value={data.organisation.locale}
                    onChange={locale => set('organisation', { locale })} />
                  <HubSelect label="Currency" options={CURRENCIES} value={data.organisation.currency}
                    onChange={currency => set('organisation', { currency })} />
                </div>
              </Section>
            </>}

            {step === 'billing' && <>
              <Section title="Financial contact" note="Receives invoices and payment reminders.">
                <HubToggle label="That's me" description={account.email} checked={data.billing.financialIsMe}
                  onChange={e => set('billing', { financialIsMe: e.target.checked })} />
                {!data.billing.financialIsMe && <ContactFields value={data.billing.financial} prefix="billing.financial" errors={errors}
                  onChange={financial => set('billing', { financial })} />}
              </Section>
              <Section title="Technical contact" note="Hears about outages, maintenance and security notices.">
                <HubToggle label="That's me" description={account.email} checked={data.billing.technicalIsMe}
                  onChange={e => set('billing', { technicalIsMe: e.target.checked })} />
                {!data.billing.technicalIsMe && <ContactFields value={data.billing.technical} prefix="billing.technical" errors={errors}
                  onChange={technical => set('billing', { technical })} />}
              </Section>
              <Section title="Billing address" note="Needed before the first invoice, not now.">
                <div className="hub-onboarding-grid hub-onboarding-grid--address">
                  <HubInput label="Street" autoComplete="address-line1" value={data.billing.address.street}
                    onChange={e => set('billing', { address: { ...data.billing.address, street: e.target.value } })} />
                  <HubInput label="Number" value={data.billing.address.streetNumber}
                    onChange={e => set('billing', { address: { ...data.billing.address, streetNumber: e.target.value } })} />
                  <HubInput label="Postal code" autoComplete="postal-code" value={data.billing.address.postalCode}
                    onChange={e => set('billing', { address: { ...data.billing.address, postalCode: e.target.value } })} />
                  <HubInput label="City" autoComplete="address-level2" value={data.billing.address.city}
                    onChange={e => set('billing', { address: { ...data.billing.address, city: e.target.value } })} />
                  <HubInput label="Region" value={data.billing.address.region}
                    onChange={e => set('billing', { address: { ...data.billing.address, region: e.target.value } })} />
                  <HubSelect label="Country" options={COUNTRIES} value={data.billing.address.country}
                    onChange={country => set('billing', { address: { ...data.billing.address, country } })} />
                </div>
              </Section>
            </>}

            {step === 'team' && <>
              <ul className="hub-onboarding-invites">
                {data.invites.map((invite, i) => (
                  <li key={i} className="hub-onboarding-invite">
                    <HubInput label={i === 0 ? 'Email' : `Email ${i + 1}`} type="email" autoComplete="off" value={invite.email}
                      placeholder="colleague@company.com" error={field(`invites.${i}.email`)}
                      onChange={e => setData(d => ({ ...d, invites: d.invites.map((x, j) => j === i ? { ...x, email: e.target.value } : x) }))} />
                    <HubSelect label="Role" options={ONBOARDING_ROLES} value={invite.role} searchable={false}
                      onChange={role => setData(d => ({ ...d, invites: d.invites.map((x, j) => j === i ? { ...x, role } : x) }))} />
                    <HubButton variant="borderless" icon={<Trash />} aria-label={`Remove invitation ${i + 1}`}
                      disabled={data.invites.length === 1 && !invite.email}
                      onClick={() => setData(d => ({ ...d, invites: d.invites.length === 1 ? [{ email: '', role: 'editor' }] : d.invites.filter((_, j) => j !== i) }))} />
                    <p className="hub-onboarding-role-note">
                      {ONBOARDING_ROLES.find(role => role.value === invite.role)?.description}
                      {ONBOARDING_ROLES.find(role => role.value === invite.role)?.level === 'project' && ` Given in ${data.project.name}.`}
                    </p>
                  </li>
                ))}
              </ul>
              <HubButton variant="outlined" icon={<Plus />} onClick={() => setData(d => ({ ...d, invites: [...d.invites, { email: '', role: 'editor' }] }))}>
                Add another
              </HubButton>
              <p className="hub-onboarding-hint"><Mail width={16} height={16} aria-hidden="true" />
                Invitations are emailed once the organisation exists and stay open for 7 days. Give access to other projects later in the settings.</p>
            </>}

            {step === 'project' && <>
              <HubInfobox tone="info">Cameras, recordings, sites and alerts live in a project. Start with one; add more for other locations or customers later.</HubInfobox>
              <HubInput label="Project name" required maxLength={100} autoFocus value={data.project.name}
                error={field('project.name')} onChange={e => set('project', { name: e.target.value })} />
              <p className="hub-onboarding-slug">Short name <code>{PROJECT_SLUG}</code></p>
              <HubTextarea label="Description (optional)" rows={3} value={data.project.description}
                placeholder="e.g. Head office, Antwerp: entrance, parking and warehouse"
                onChange={e => set('project', { description: e.target.value })} />
            </>}

            {step === 'review' && <Review data={data} account={account} onEdit={go} errors={errors} />}
          </div>

          <footer className="hub-onboarding-actions">
            <HubButton variant="outlined" onClick={back}>Back</HubButton>
            <span className="hub-onboarding-actions-gap" />
            {current.optional && <HubButton variant="borderless" onClick={() => go(steps[index + 1].step)}>Skip for now</HubButton>}
            <HubButton type="submit">{step === 'review' ? `Create ${data.organisation.name || 'organisation'}` : 'Continue'}</HubButton>
          </footer>
        </form>
      </main>
    </div>
  )
}

const KINDS: { value: 'business' | 'personal'; title: string; text: string; icon: ReactNode }[] = [
  { value: 'business', title: 'Business organisation', text: 'Company details on invoices, a financial contact, a team.', icon: <Building /> },
  { value: 'personal', title: 'Personal organisation', text: 'For your own home or property. No company details, and you are the contact.', icon: <Home /> },
]

const TITLES: Record<HubOnboardingStep, { title: string; text: string }> = {
  welcome: { title: '', text: '' },
  profile: { title: 'Tell us about you', text: 'How your name shows to the people you work with. Everything here is optional.' },
  organisation: { title: 'Create your organisation', text: 'Your organisation holds your projects, members and subscription. You become its owner.' },
  billing: { title: 'Billing and contacts', text: 'Who we contact about invoices and the service. You can fill this in later.' },
  team: { title: 'Invite your team', text: 'Give colleagues access from the start, each with a built-in role.' },
  project: { title: 'Name your first project', text: 'Your first cameras go here. You can rename it any time.' },
  review: { title: 'Ready to create', text: 'Check the details. You can change all of them later in the settings.' },
  creating: { title: '', text: '' },
  done: { title: '', text: '' },
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="hub-onboarding-section">
      <h2>{title}</h2>
      {note && <p>{note}</p>}
      {children}
    </section>
  )
}

function ContactFields({ value, prefix, errors, onChange }: {
  value: HubOnboardingContact; prefix: string; errors: Record<string, string>; onChange: (value: HubOnboardingContact) => void
}) {
  return (
    <div className="hub-onboarding-grid">
      <HubInput label="Name" value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} />
      <HubInput label="Job title" value={value.role} onChange={e => onChange({ ...value, role: e.target.value })} />
      <HubInput label="Email" type="email" value={value.email} error={errors[`${prefix}.email`]}
        onChange={e => onChange({ ...value, email: e.target.value })} />
      <HubInput label="Phone" type="tel" value={value.phone} onChange={e => onChange({ ...value, phone: e.target.value })} />
    </div>
  )
}

function Review({ data, account, onEdit, errors }: {
  data: HubOnboardingData; account: { email: string }; onEdit: (step: HubOnboardingStep) => void; errors: Record<string, string>
}) {
  const name = [data.profile.firstName, data.profile.lastName].filter(Boolean).join(' ')
  const invites = filled(data.invites)
  const contact = (isMe: boolean, contact: HubOnboardingContact) => isMe ? `You (${account.email})` : [contact.name, contact.email].filter(Boolean).join(', ') || 'Not set'
  const personal = data.organisation.kind === 'personal'
  const rows: { step: HubOnboardingStep; title: string; lines: string[] }[] = [
    { step: 'profile', title: 'Your profile', lines: [name || 'No name yet', `${data.profile.timezone} · ${LANGUAGES.find(l => l.value === data.profile.language)?.text}`] },
    { step: 'organisation', title: 'Organisation', lines: [data.organisation.name,
      personal ? 'Personal organisation' : [data.organisation.legalName, data.organisation.vatNumber].filter(Boolean).join(' · ') || 'No company details',
      `${data.organisation.timezone} · ${data.organisation.locale} · ${data.organisation.currency}`] },
    { step: 'billing', title: 'Billing & contacts', lines: [`Financial: ${contact(data.billing.financialIsMe, data.billing.financial)}`,
      `Technical: ${contact(data.billing.technicalIsMe, data.billing.technical)}`,
      [data.billing.address.street, data.billing.address.streetNumber, data.billing.address.postalCode, data.billing.address.city].filter(Boolean).join(' ') || 'No billing address yet'] },
    { step: 'team', title: 'Invitations', lines: invites.length ? invites.map(invite => `${invite.email} · ${roleText(invite.role)}`) : ['Nobody yet'] },
    { step: 'project', title: 'First project', lines: [`${data.project.name} (${PROJECT_SLUG})`, data.project.description || 'No description'] },
  ]
  return <>
    {errors.create && <HubInfobox tone="error">{errors.create}</HubInfobox>}
    <dl className="hub-onboarding-review">
      {rows.filter(row => !(personal && row.step === 'billing')).map(row => (
        <div key={row.step} className="hub-onboarding-review-row">
          <dt>{row.title}</dt>
          <dd>{row.lines.map((line, i) => <span key={i}>{line}</span>)}</dd>
          <HubButton variant="borderless" onClick={() => onEdit(row.step)} aria-label={`Edit ${row.title}`}>Edit</HubButton>
        </div>
      ))}
    </dl>
  </>
}

function defaultTasks(data: HubOnboardingData, done: boolean): HubOnboardingTask[] {
  const invites = filled(data.invites).length
  const tasks: HubOnboardingTask[] = [
    { label: 'Saving your profile', state: 'done' },
    { label: `Creating ${data.organisation.name || 'your organisation'}`, state: done ? 'done' : 'running' },
    { label: `Setting up ${data.project.name}`, state: done ? 'done' : 'pending' },
  ]
  if (invites) tasks.push({ label: `Sending ${invites} invitation${invites === 1 ? '' : 's'}`, state: done ? 'done' : 'pending' })
  return tasks
}

function Creating({ data, tasks, brand }: { data: HubOnboardingData; tasks: HubOnboardingTask[]; brand: string }) {
  const done = tasks.every(task => task.state === 'done' || task.state === 'failed')
  const failed = tasks.filter(task => task.state === 'failed')
  return (
    <div className="hub-onboarding">
      <main className="hub-onboarding-card hub-onboarding-card--narrow">
        <div className="hub-onboarding-figure" style={done ? { ['--iso-accent' as string]: 'var(--success)' } : undefined}>
          <IsoIllustration figure="hub" />
        </div>
        <div className="hub-onboarding-center" aria-live="polite" aria-busy={!done || undefined}>
          <h1>{done ? `${data.organisation.name || 'Your organisation'} is ready` : `Setting up ${brand}`}</h1>
          <p>{done ? 'Your organisation and first project are ready. Connect your first camera to start recording.' : 'This takes a few seconds. You can leave this page open.'}</p>
          <ul className="hub-onboarding-tasks">
            {tasks.map(task => (
              <li key={task.label} className={`hub-onboarding-task is-${task.state}`}>
                <span className="hub-onboarding-task-icon" aria-hidden="true">
                  {task.state === 'done' ? <Check /> : task.state === 'failed' ? <WarningCircle /> : task.state === 'running' ? <span className="hub-onboarding-spinner" /> : null}
                </span>
                <span>{task.label}{task.note && <small>{task.note}</small>}</span>
                <span className="hub-sr-only">{task.state}</span>
              </li>
            ))}
          </ul>
          {done && failed.length > 0 && <HubInfobox tone="warning">
            The organisation is ready, but {failed.length === 1 ? 'one step' : `${failed.length} steps`} did not finish. You can retry from the settings.
          </HubInfobox>}
          {done && <HubButton className="hub-onboarding-cta">Open {data.project.name}</HubButton>}
        </div>
      </main>
    </div>
  )
}

function Welcome({ account, invitations, canCreate, joined, onJoin, onCreate, onSignOut, brand }: {
  account: { username: string; email: string }
  invitations: HubOnboardingInvitation[]
  canCreate: boolean
  joined: HubOnboardingInvitation | null
  onJoin: (invitation: HubOnboardingInvitation) => void
  onCreate: () => void
  onSignOut?: () => void
  brand: string
}) {
  if (joined) {
    return (
      <div className="hub-onboarding">
        <main className="hub-onboarding-card hub-onboarding-card--narrow">
          <div className="hub-onboarding-figure" style={{ ['--iso-accent' as string]: 'var(--success)' }}><IsoIllustration figure="hub" /></div>
          <div className="hub-onboarding-center">
            <h1>You joined {joined.organisation}</h1>
            <p>{joined.invitedBy} gave you the {roleText(joined.role)} role. Everything you can open is ready.</p>
            <HubButton className="hub-onboarding-cta">Open {joined.organisation}</HubButton>
          </div>
        </main>
      </div>
    )
  }
  return (
    <div className="hub-onboarding">
      <main className="hub-onboarding-card hub-onboarding-card--narrow">
        <div className="hub-onboarding-figure"><IsoIllustration figure="hub" /></div>
        <div className="hub-onboarding-center">
          <h1>Welcome to {brand}, {account.username}</h1>
          <p>{invitations.length
            ? 'You have been invited. Join an organisation, or create your own.'
            : canCreate ? 'Set up your organisation and first project in a few steps.' : 'Ask an administrator to invite you; you can then join here.'}</p>

          {invitations.length > 0 && <ul className="hub-onboarding-choices" aria-label="Your invitations">
            {invitations.map(invitation => (
              <li key={invitation.id} className="hub-onboarding-choice">
                <span className="hub-onboarding-choice-icon" aria-hidden="true"><Mail /></span>
                <span className="hub-onboarding-choice-text">
                  <strong>{invitation.organisation}</strong>
                  <small>{invitation.invitedBy} · {roleText(invitation.role)}</small>
                </span>
                <HubButton onClick={() => onJoin(invitation)}>Join</HubButton>
              </li>
            ))}
          </ul>}

          {canCreate && <HubButton className="hub-onboarding-cta" variant={invitations.length ? 'outlined' : 'primary'} icon={<Building />} onClick={onCreate}>
            Create an organisation
          </HubButton>}
          {!canCreate && !invitations.length && <HubInfobox tone="info">Organisations are created by invitation on this {brand}. We'll show the invitation here as soon as it arrives.</HubInfobox>}
        </div>
        <footer className="hub-onboarding-footer">
          <span>Signed in as {account.email}</span>
          <button type="button" className="hub-onboarding-link" onClick={onSignOut}>Sign out</button>
        </footer>
      </main>
    </div>
  )
}

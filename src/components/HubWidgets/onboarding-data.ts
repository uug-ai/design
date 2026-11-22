import type { HubOption } from './controls'

export type HubOnboardingStep =
  | 'welcome' | 'profile' | 'organisation' | 'billing' | 'team' | 'project' | 'review' | 'creating' | 'done'

export type HubOnboardingContact = { name: string; email: string; phone: string; role: string }

export type HubOnboardingInvite = { email: string; role: string }

export type HubOnboardingData = {
  profile: { firstName: string; lastName: string; timezone: string; language: string }
  organisation: {
    /** A personal organisation skips the company details and the billing step: its owner is both contacts. */
    kind: 'business' | 'personal'
    name: string; description: string; website: string
    legalName: string; tradingName: string; registrationNumber: string; vatNumber: string; industry: string
    timezone: string; locale: string; currency: string
  }
  billing: {
    financialIsMe: boolean; financial: HubOnboardingContact
    technicalIsMe: boolean; technical: HubOnboardingContact
    address: { street: string; streetNumber: string; postalCode: string; city: string; region: string; country: string }
  }
  invites: HubOnboardingInvite[]
  project: { name: string; description: string }
}

export type HubOnboardingInvitation = { id: string; organisation: string; invitedBy: string; role: string }

/** One line of the creation progress: what is being set up and how far it got. */
export type HubOnboardingTask = { label: string; state: 'pending' | 'running' | 'done' | 'failed'; note?: string }

/**
 * The built-in roles an invitation can carry (models systemrole.go). A role is
 * granted at its own level: Owner, Organisation manager and Billing admin over
 * the whole organisation; Project admin, Editor and Viewer in the first project,
 * the only one there is yet.
 */
export const ONBOARDING_ROLES: (HubOption & { description: string; level?: 'project' })[] = [
  { value: 'owner', text: 'Owner', description: 'Every permission in every current and future project, billing included.' },
  { value: 'organisation-manager', text: 'Organisation manager', description: 'Members, roles, teams and organisation settings; grants access in every project without seeing its content.' },
  { value: 'billing-admin', text: 'Billing admin', description: 'The subscription and billing.' },
  { value: 'project-admin', text: 'Project admin', description: 'Everything in the project, including device configuration, settings and who has access.', level: 'project' },
  { value: 'editor', text: 'Editor', description: 'Works with cameras, recordings and cases, and creates sites, groups and other content. No deletes, device configuration or access.', level: 'project' },
  { value: 'viewer', text: 'Viewer', description: 'Watches live and recorded video and reads everything; changes nothing.', level: 'project' },
]

const EMPTY_CONTACT: HubOnboardingContact = { name: '', email: '', phone: '', role: '' }

export function emptyOnboardingData(timezone = 'Europe/Brussels'): HubOnboardingData {
  return {
    profile: { firstName: '', lastName: '', timezone, language: 'en' },
    organisation: {
      kind: 'business', name: '', description: '', website: '', legalName: '', tradingName: '', registrationNumber: '', vatNumber: '', industry: '',
      timezone, locale: 'en-GB', currency: 'EUR',
    },
    billing: {
      financialIsMe: true, financial: { ...EMPTY_CONTACT }, technicalIsMe: true, technical: { ...EMPTY_CONTACT },
      address: { street: '', streetNumber: '', postalCode: '', city: '', region: '', country: '' },
    },
    invites: [{ email: '', role: 'editor' }],
    project: { name: 'Default project', description: '' },
  }
}


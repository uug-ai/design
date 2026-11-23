import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { HubOnboarding } from '../onboarding'
import { emptyOnboardingData } from '../onboarding-data'
import { DEMO_PACE, DEMO_TYPING_DELAY, pause } from '../demo-pace'
import type { HubOnboardingData, HubOnboardingTask } from '../onboarding-data'

const account = { username: 'sarah.peeters', email: 'sarah@acme-security.be' }

const filled: HubOnboardingData = {
  profile: { firstName: 'Sarah', lastName: 'Peeters', timezone: 'Europe/Brussels', language: 'nl' },
  organisation: {
    kind: 'business', name: 'Acme Security', description: 'Monitoring for retail and logistics sites in Flanders.', website: 'https://acme-security.be',
    legalName: 'Acme Security NV', tradingName: '', registrationNumber: '0123.456.789', vatNumber: 'BE0123456789', industry: 'Security & surveillance',
    timezone: 'Europe/Brussels', locale: 'nl-BE', currency: 'EUR',
  },
  billing: {
    financialIsMe: false, financial: { name: 'Tom Janssens', email: 'finance@acme-security.be', phone: '+32 3 123 45 67', role: 'CFO' },
    technicalIsMe: true, technical: { name: '', email: '', phone: '', role: '' },
    address: { street: 'Meir', streetNumber: '12', postalCode: '2000', city: 'Antwerpen', region: 'Antwerpen', country: 'BE' },
  },
  invites: [
    { email: 'jan@acme-security.be', role: 'organisation-manager' },
    { email: 'lisa@acme-security.be', role: 'editor' },
  ],
  project: { name: 'Head office Antwerp', description: 'Entrance, parking and warehouse.' },
}

const meta = {
  title: 'Areas/Onboarding',
  component: HubOnboarding,
  tags: ['autodocs'],
  args: { account, step: 'welcome' },
  argTypes: {
    step: { control: 'select', options: ['welcome', 'profile', 'organisation', 'billing', 'team', 'project', 'review', 'creating', 'done'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The first sign-in of an account without an organisation (hub-api `ONBOARDING_ENABLED`): the page after sign-up, activation and sign-in, at `/onboarding`.',
          'A **welcome** card offers the pending invitations to the account\'s own address and creating an organisation. Creating one opens a **wizard** in one wide card on the login background, with a step rail: **profile** (first name, last name, time zone, language — all optional), **organisation** (name, company details and regional defaults), **billing & contacts** (the financial and technical contact and the billing address), **invite your team** (email and a built-in role for the whole organisation), **first project** (the default project\'s name and description) and a **review**. Then a **creation** card shows each step as it finishes and opens the project.',
          'Only the organisation name and the project name are required; every optional step has *Skip for now*. Each field maps to what the API stores today (uug-ai/models): the user\'s `firstname`, `lastname`, `timezone`; the organisation\'s `name`, `description`, `company` (legal and trading name, registration and VAT number, industry, website), `settings` (timezone, locale, currency, `financialContact`, `technicalContact`) and `billingAddress`; one invitation per email with a built-in role (Owner, Organisation manager or Billing admin over the whole organisation; Project admin, Editor or Viewer in the first project, since a role is granted at its own level); the project\'s `name` and `description`. Its short name is always `project-1`, the slug the API mints for the default project and keeps when it is renamed.',
          'Below 760px the card fills the screen and the rail becomes a "Step n of 6" progress line.',
        ].join('\n\n'),
      },
    },
  },
} satisfies Meta<typeof HubOnboarding>

export default meta
type Story = StoryObj<typeof meta>

export const Welcome: Story = {
  args: { step: 'welcome' },
  parameters: { docs: { description: { story: 'No invitation: one action, creating the organisation. Sign out stays at hand.' } } },
}

export const WelcomeWithInvitations: Story = {
  args: {
    step: 'welcome',
    invitations: [
      { id: 'i1', organisation: 'Northwind Logistics', invitedBy: 'Olivia Martens', role: 'editor' },
      { id: 'i2', organisation: 'Brightside Retail', invitedBy: 'Koen De Smet', role: 'viewer' },
    ],
  },
  parameters: { docs: { description: { story: 'Open invitations to the account\'s address come first, each with Join; creating an organisation is the secondary action. Select Join to see the joined state.' } } },
}

export const WelcomeCreatingTurnedOff: Story = {
  args: { step: 'welcome', canCreate: false },
  parameters: { docs: { description: { story: '`ONBOARDING_ORGANISATION_CREATE=false` and no invitation yet: the account can only wait for one.' } } },
}

export const Profile: Story = {
  args: { step: 'profile', data: { ...emptyOnboardingData(), profile: { firstName: 'Sarah', lastName: 'Peeters', timezone: 'Europe/Brussels', language: 'en' } } },
  parameters: { docs: { description: { story: 'All optional: the time zone starts from the browser\'s, the language from the sign-in page.' } } },
}

export const Organisation: Story = {
  args: { step: 'organisation', data: filled },
  parameters: { docs: { description: { story: 'The name is the one required field. Company details are for invoices; regional defaults apply to every member who sets none of their own.' } } },
}

const personal: HubOnboardingData = {
  ...emptyOnboardingData(),
  profile: { firstName: 'Sarah', lastName: 'Peeters', timezone: 'Europe/Brussels', language: 'nl' },
  organisation: { ...emptyOnboardingData().organisation, kind: 'personal', name: "Sarah's home", description: 'House and holiday home.', locale: 'nl-BE' },
  invites: [{ email: '', role: 'editor' }],
  project: { name: 'Home', description: 'Front door, garden and garage.' },
}

export const OrganisationPersonal: Story = {
  args: { step: 'organisation', data: personal },
  parameters: { docs: { description: { story: 'A personal organisation: no company details, and no Billing & contacts step in the rail; its owner is both contacts. Five steps instead of six.' } } },
}

export const ReviewPersonal: Story = {
  args: { step: 'review', data: personal },
  parameters: { docs: { description: { story: 'The review of a personal organisation: no company or billing lines.' } } },
}

export const OrganisationNameMissing: Story = {
  args: { step: 'organisation', data: emptyOnboardingData(), errors: { 'organisation.name': 'Give your organisation a name.' } },
  parameters: { docs: { description: { story: 'Continue without a name: the message sits under the field.' } } },
}

export const BillingAndContacts: Story = {
  args: { step: 'billing', data: filled },
  parameters: { docs: { description: { story: 'The financial contact is someone else, so their fields open; the technical contact is the signed-in account. The billing address is asked now but only needed for the first invoice.' } } },
}

export const BillingDefaults: Story = {
  args: { step: 'billing', data: emptyOnboardingData() },
  parameters: { docs: { description: { story: 'The default: the account is both contacts, nothing to type.' } } },
}

export const InviteTeam: Story = {
  args: { step: 'team', data: filled },
  parameters: { docs: { description: { story: 'One row per person: the email and a built-in role. The role\'s meaning shows under each row. Owner, Organisation manager and Billing admin cover the whole organisation; Project admin, Editor and Viewer are given in the first project, and the note says so.' } } },
}

export const InviteTeamInvalidEmail: Story = {
  args: {
    step: 'team',
    data: { ...filled, invites: [{ email: 'jan@acme', role: 'editor' }, { email: account.email, role: 'viewer' }] },
    errors: { 'invites.0.email': 'Enter an email address.', 'invites.1.email': 'That is your own address.' },
  },
}

export const FirstProject: Story = {
  args: { step: 'project', data: filled },
  parameters: { docs: { description: { story: 'The default project, named by the owner. Its short name follows the name; "Default project" keeps `default`.' } } },
}

export const Review: Story = {
  args: { step: 'review', data: filled },
  parameters: { docs: { description: { story: 'Everything at a glance, with Edit per section. The primary action names the organisation.' } } },
}

export const ReviewCreateFailed: Story = {
  args: { step: 'review', data: filled, errors: { create: 'An organisation named Acme Security already exists for your account. Choose another name.' } },
}

export const Creating: Story = {
  args: {
    step: 'creating', data: filled,
    tasks: [
      { label: 'Saving your profile', state: 'done' },
      { label: 'Creating Acme Security', state: 'done' },
      { label: 'Setting up Head office Antwerp', state: 'running' },
      { label: 'Sending 2 invitations', state: 'pending' },
    ],
  },
  parameters: { docs: { description: { story: 'Each part of the set-up as it finishes; the organisation, its owner role and the default project come first, the invitations last.' } } },
}

export const Done: Story = {
  args: { step: 'done', data: filled },
}

export const DoneWithFailedInvitation: Story = {
  args: {
    step: 'done', data: filled,
    tasks: [
      { label: 'Saving your profile', state: 'done' },
      { label: 'Creating Acme Security', state: 'done' },
      { label: 'Setting up Head office Antwerp', state: 'done' },
      { label: 'Sending 2 invitations', state: 'failed', note: 'lisa@acme-security.be could not be invited; the members limit of your plan is reached.' },
    ],
  },
  parameters: { docs: { description: { story: 'The organisation works; a step that did not finish is named and can be retried from the settings.' } } },
}

export const Mobile: Story = {
  args: { step: 'organisation', data: filled },
  globals: { viewport: { value: 'mobile1' } },
  parameters: { viewport: { defaultViewport: 'mobile1' }, docs: { description: { story: 'Below 760px: full-screen card, "Step 2 of 6" progress line, one column.' } } },
}

export const Playground: Story = {
  args: {
    step: 'welcome',
    invitations: [{ id: 'i1', organisation: 'Northwind Logistics', invitedBy: 'Olivia Martens', role: 'editor' }],
  },
  parameters: { docs: { description: { story: 'The whole flow: Create an organisation, fill in or skip each step, review and create.' } } },
}


export const Demo: Story = {
  args: { step: 'welcome' },
  parameters: {
    docs: {
      description: {
        story: 'Plays the whole onboarding by itself, at reading pace, for demos: create an organisation, fill in the profile, organisation, contacts, one invitation and the first project, review and create. **Areas / Account activation / Demo** continues here after Sign in. Open the story on its own (not in Docs) to watch it; the **Interactions** panel lists each step and replays it. Takes about a minute.',
      },
    },
  },
  // After Create, the set-up tasks turn to done one by one, like the real creation.
  render: function DemoStory(args) {
    const [tasks, setTasks] = useState<HubOnboardingTask[] | undefined>(undefined)
    useEffect(() => {
      if (!tasks) return
      const running = tasks.findIndex(task => task.state === 'running')
      if (running < 0) return
      const timer = window.setTimeout(() => setTasks(tasks.map((task, i) =>
        i === running ? { ...task, state: 'done' } : i === running + 1 ? { ...task, state: 'running' } : task)), 1100 * DEMO_PACE)
      return () => window.clearTimeout(timer)
    }, [tasks])
    return <HubOnboarding {...args} tasks={tasks} onFinish={data => {
      const invites = data.invites.filter(invite => invite.email.trim()).length
      setTasks([
        { label: 'Saving your profile', state: 'running' },
        { label: `Creating ${data.organisation.name}`, state: 'pending' },
        { label: `Setting up ${data.project.name}`, state: 'pending' },
        ...(invites ? [{ label: `Sending ${invites} invitation${invites === 1 ? '' : 's'}`, state: 'pending' as const }] : []),
      ])
    }} />
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const user = userEvent.setup({ delay: DEMO_TYPING_DELAY })
    const continueTo = async (heading: string) => {
      await pause(700)
      await user.click(canvas.getByRole('button', { name: 'Continue' }))
      await canvas.findByRole('heading', { level: 1, name: heading })
      await pause(900)
    }

    await step('Welcome: create an organisation', async () => {
      await pause(1200)
      await user.click(canvas.getByRole('button', { name: 'Create an organisation' }))
      await pause(900)
    })

    await step('Your profile', async () => {
      await user.type(canvas.getByLabelText('First name'), filled.profile.firstName)
      await user.type(canvas.getByLabelText('Last name'), filled.profile.lastName)
      await continueTo('Create your organisation')
    })

    await step('Organisation', async () => {
      await user.type(canvas.getByLabelText('Organisation name'), filled.organisation.name)
      await user.type(canvas.getByLabelText('Description (optional)'), filled.organisation.description)
      await user.type(canvas.getByLabelText('Legal name'), filled.organisation.legalName)
      await user.type(canvas.getByLabelText('VAT number'), filled.organisation.vatNumber)
      await continueTo('Billing and contacts')
    })

    await step('Billing & contacts', async () => {
      await user.type(canvas.getByLabelText('Street'), filled.billing.address.street)
      await user.type(canvas.getByLabelText('Number'), filled.billing.address.streetNumber)
      await user.type(canvas.getByLabelText('Postal code'), filled.billing.address.postalCode)
      await user.type(canvas.getByLabelText('City'), filled.billing.address.city)
      await continueTo('Invite your team')
    })

    await step('Invite your team', async () => {
      await user.type(canvas.getByLabelText('Email'), filled.invites[0].email)
      await pause(400)
      await user.click(canvas.getByRole('button', { name: 'Role: Editor' }))
      await pause(700)
      await user.click(canvas.getByRole('radio', { name: 'Organisation manager' }))
      await continueTo('Name your first project')
    })

    await step('First project', async () => {
      // The name starts as "Default project": replace it rather than append.
      await user.clear(canvas.getByLabelText('Project name'))
      await pause(300)
      await user.type(canvas.getByLabelText('Project name'), filled.project.name)
      await user.type(canvas.getByLabelText('Description (optional)'), filled.project.description)
      await continueTo('Ready to create')
    })

    await step('Review and create', async () => {
      await pause(1500)
      await user.click(canvas.getByRole('button', { name: `Create ${filled.organisation.name}` }))
    })

    await step('Set-up finishes', async () => {
      await expect(await canvas.findByRole('heading', { name: `${filled.organisation.name} is ready` }, { timeout: 10000 })).toBeVisible()
    })
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { LicenseEmail, LicenseEmailText } from './component'

const meta = {
  title: 'Emails/License',
  component: LicenseEmail,
  tags: ['autodocs'],
  args: { company: 'acme', cameras: 25, issued: '30 October 2026', validity: '365 days, until 30 October 2027' },
  parameters: {
    docs: {
      description: {
        component: 'The customer email sent when a license pull request in hub-license is merged, with license.txt attached. Subject: "Your Augment Vision license for <company>". Table-based, inline-styled HTML so it renders in Gmail and Outlook; the brand gradient falls back to solid blue where gradients are unsupported. The source of truth is `.github/license-email/` in uug-ai/hub-license; keep the copies here in sync.',
      },
    },
  },
} satisfies Meta<typeof LicenseEmail>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Perpetual: Story = { args: { company: 'bijlokehof', cameras: 120, validity: 'Perpetual' } }
export const LongCompanyName: Story = { args: { company: 'ghent-university-hospital-security-operations', cameras: 1 } }
export const PlainText: Story = {
  parameters: { docs: { description: { story: 'The text/plain alternative sent alongside the HTML.' } } },
  render: args => <LicenseEmailText {...args} />,
}

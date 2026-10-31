import type { Meta, StoryObj } from '@storybook/react-vite'
import { LicenseEmailV2, LicenseEmailV2Text } from '../component'

const meta = {
  title: 'Emails/License v2',
  component: LicenseEmailV2,
  tags: ['autodocs'],
  args: { kind: 'license', company: 'acme', cameras: 25, issued: '30 October 2026', validity: '365 days, until 30 October 2027', expires: '30 October 2027' },
  argTypes: { kind: { control: 'inline-radio', options: ['license', 'license_expiring', 'license_expired'] } },
  parameters: {
    docs: {
      description: {
        component: 'The license emails on the layout of **Emails / Notifications v2**: the license itself (with license.txt attached), a reminder a month before it expires, and a notice once it has expired. Each has its own colour and illustration: a certificate with its seal and key, the certificate beside a calendar, and the certificate stamped expired. They use hub-license\'s `$placeholders`, plus `$expires` for the end date. Only the first is sent today; the reminder and the expiry notice still need a scheduled workflow in hub-license.',
      },
    },
  },
} satisfies Meta<typeof LicenseEmailV2>

export default meta
type Story = StoryObj<typeof meta>

export const Issued: Story = {}
export const Expiring: Story = { args: { kind: 'license_expiring', expires: '30 November 2026' } }
export const Expired: Story = { args: { kind: 'license_expired', expires: '30 October 2026' } }
export const PlainText: Story = {
  parameters: { docs: { description: { story: 'The text/plain alternative, generated from the same content as the HTML. Switch `kind` in Controls.' } } },
  render: args => <LicenseEmailV2Text {...args} />,
}

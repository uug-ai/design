import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/License',
  component: Email,
  tags: ['autodocs'],
  args: example('license'),
  argTypes: { template: { control: false } },
  parameters: about('The license emails from hub-license: the license itself, with license.txt attached, sent when its pull request is merged; a reminder a month before it expires; and a notice once it has expired. The last two are proposed and not sent yet.', 'license', 'license_expiring', 'license_expired'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Issued: Story = {}
export const Perpetual: Story = { args: example('license', { validity: 'Perpetual' }) }
export const SingleDevice: Story = { args: example('license', { company: 'ghent-university-hospital', cameras: '1', validity: '30 days, until 29 November 2026' }) }
export const Expiring: Story = { args: example('license_expiring') }
export const Expired: Story = { args: example('license_expired') }
export const PlainText: Story = { ...plainText('license') }
export const ExpiringPlainText: Story = { ...plainText('license_expiring') }
export const ExpiredPlainText: Story = { ...plainText('license_expired') }

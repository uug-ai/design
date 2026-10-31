import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Shared Case',
  component: Email,
  tags: ['autodocs'],
  args: example('share_case'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when someone shares a case; the share page asks for a one-time code before it opens.', 'share_case'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const SevenDays: Story = {}
export const OneDay: Story = { args: example('share_case', { expiry: '24 hours' }) }
export const PlainText: Story = { ...plainText('share_case') }

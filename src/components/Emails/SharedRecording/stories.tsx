import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Shared Recording',
  component: Email,
  tags: ['autodocs'],
  args: example('share'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when someone shares a recording, with their title and message.', 'share'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const LongMessage: Story = { args: example('share', { title: 'Loading dock, 30 October 22:14', body: 'This van stopped at the dock for twenty minutes after closing. Can you check whether it was a planned delivery, and let me know before the morning shift?' }) }
export const PlainText: Story = { ...plainText('share') }

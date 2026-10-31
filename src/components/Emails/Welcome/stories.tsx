import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Welcome',
  component: Email,
  tags: ['autodocs'],
  args: example('welcome'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when someone creates a Hub account, with the link that activates it.', 'welcome'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const LongUsername: Story = { args: example('welcome', { user: 'security-operations.ghent-university-hospital' }) }
export const PlainText: Story = { ...plainText('welcome') }

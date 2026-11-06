import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Activated',
  component: Email,
  tags: ['autodocs'],
  args: example('activate'),
  argTypes: { template: { control: false } },
  parameters: about('Sent once an account is activated, inviting the user to sign in.', 'activate'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const PlainText: Story = { ...plainText('activate') }

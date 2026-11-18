import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Invitation',
  component: Email,
  tags: ['autodocs'],
  args: example('invitation'),
  argTypes: { template: { control: false } },
  parameters: about('Sent by hub-api when someone is invited to an organisation (Members & access). The invitee may not have an account yet: the link lets them sign in, or create an account, and join.', 'invitation'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Invitation: Story = {}
export const InviterWithoutName: Story = {
  args: example('invitation', { user: 'jane.doe@acme-security.com' }),
  parameters: { docs: { description: { story: 'An inviter without a first or last name is named by their email address.' } } },
}
export const PlainText: Story = { ...plainText('invitation') }

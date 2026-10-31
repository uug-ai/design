import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Shared Case Code',
  component: Email,
  tags: ['autodocs'],
  args: example('share_case_otp'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when someone opening a shared case asks for their one-time code.', 'share_case_otp'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const PlainText: Story = { ...plainText('share_case_otp') }

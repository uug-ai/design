import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/High Upload',
  component: Email,
  tags: ['autodocs'],
  args: example('highupload'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when the high upload alert goes off: the account\'s Agents uploaded more recordings than usual in a short time.', 'highupload'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const PlainText: Story = { ...plainText('highupload') }

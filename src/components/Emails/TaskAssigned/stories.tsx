import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Task Assigned',
  component: Email,
  tags: ['autodocs'],
  args: example('assign_task'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when someone assigns a task to a user.', 'assign_task'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const LongTaskName: Story = { args: example('assign_task', { task_name: 'Review all entrance and parking footage from the night of 30 October for the insurance claim' }) }
export const PlainText: Story = { ...plainText('assign_task') }

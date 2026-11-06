import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Daily Limit Reached',
  component: Email,
  tags: ['autodocs'],
  args: example('disable'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when an account uploads its daily data limit; uploads are paused for 6 hours.', 'disable'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const SmallPlan: Story = { args: example('disable', { dataUsage: '10' }) }
export const PlainText: Story = { ...plainText('disable') }

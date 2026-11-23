import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Daily Limit',
  component: Email,
  tags: ['autodocs'],
  args: example('disable'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when an account has used 50% and 75% of its daily upload limit, and when it reaches the limit and uploads are paused for 6 hours. The meter in the illustration fills with each step.', 'limit_50', 'limit_75', 'disable'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const HalfUsed: Story = { name: '50% used', args: example('limit_50') }
export const ThreeQuartersUsed: Story = { name: '75% used', args: example('limit_75') }
export const Reached: Story = {}
export const ReachedSmallPlan: Story = { name: 'Reached, small plan', args: example('disable', { dataUsage: '10' }) }
export const PlainText: Story = { ...plainText('disable') }
export const HalfUsedPlainText: Story = { name: '50% used plain text', ...plainText('limit_50') }
export const ThreeQuartersUsedPlainText: Story = { name: '75% used plain text', ...plainText('limit_75') }

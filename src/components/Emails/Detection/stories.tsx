import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Detection',
  component: Email,
  tags: ['autodocs'],
  args: example('detection'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when an alert condition is triggered on a camera, with the recording\'s thumbnail and links to the recording and its media page.', 'detection'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Person: Story = {}
export const Vehicle: Story = { args: example('detection', { title: 'Vehicle detected', text: 'A car entered the parking area.', devicename: 'Parking', datetime: '2026-10-31 07:58:41' }) }
export const PlainText: Story = { ...plainText('detection') }

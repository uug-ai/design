import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { deviceSections } from '../samples'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Device Group Status',
  component: Email,
  tags: ['autodocs'],
  args: example('device_group'),
  argTypes: { template: { control: false } },
  parameters: about('Sent instead of Device Status when several cameras of an account change status in the same check, grouped by site or group.', 'device_group'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Mixed: Story = {}
export const WholeSiteOffline: Story = {
  args: example('device_group', {
    text: '5 cameras changed status: 5 offline.',
    ...deviceSections([{ title: 'Site Waterfront · Offline · all 5 cameras', cameras: [['Gate', 'no response for 9 min'], ['Lobby', 'no response for 9 min'], ['Dock 1', 'no response for 9 min'], ['Dock 2', 'no response for 8 min'], ['Roof', 'no response for 8 min']] }]),
  }),
}
export const StreamsLost: Story = {
  args: example('device_group', {
    text: '2 cameras changed status: 2 lost their camera stream.',
    ...deviceSections([{ title: 'Group Perimeter · Camera stream lost · 2 cameras', cameras: [['North fence', 'agent online, camera stream not connected'], ['South fence', 'agent online, camera stream not connected']] }]),
  }),
}
export const PlainText: Story = { ...plainText('device_group') }

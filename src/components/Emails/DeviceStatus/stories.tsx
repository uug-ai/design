import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Device Status',
  component: Email,
  tags: ['autodocs'],
  args: example('device'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when one camera changes status: it goes offline, loses its camera stream or comes back online.', 'device'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Offline: Story = {}
export const StreamLost: Story = { args: example('device', { text: 'Parking lost its camera stream: the Agent is online but the camera stream is not connected.' }) }
export const BackOnline: Story = { args: example('device', { text: 'Entrance is back online.' }) }
export const PlainText: Story = { ...plainText('device') }

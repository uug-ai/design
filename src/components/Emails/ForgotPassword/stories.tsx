import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Forgot Password',
  component: Email,
  tags: ['autodocs'],
  args: example('forgot'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when someone asks for a new password: it contains the new password and the IP address the request came from.', 'forgot'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Ipv6: Story = { name: 'IPv6', args: example('forgot', { ipaddress: '2a02:1810:4d0a:8a00:1c4e:7bff:fe21:9a3c' }) }
export const PlainText: Story = { ...plainText('forgot') }

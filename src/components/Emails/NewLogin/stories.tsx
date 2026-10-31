import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/New Login',
  component: Email,
  tags: ['autodocs'],
  args: example('newip'),
  argTypes: { template: { control: false } },
  parameters: about('Sent when an account signs in from an IP address it has not used before.', 'newip'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Ipv6: Story = { name: 'IPv6', args: example('newip', { ipaddress: '2a02:1810:4d0a:8a00:1c4e:7bff:fe21:9a3c' }) }
export const PlainText: Story = { ...plainText('newip') }

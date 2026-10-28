import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationExample } from '../examples'

const meta = {
  title: 'Components/Notifications',
  component: NotificationExample,
  tags: ['autodocs'],
  args: { autoDismiss: false, fixed: false },
  parameters: { docs: { description: { component: 'Hub ToastContainer success/info/warning/error messages, actions and dismissal. Timers pause while hovered or keyboard-focused and resume with the remaining duration. Inline placement keeps Docs examples contained; fixed placement matches Hub. Also includes colored LabelTag, site/group/camera identity badges and a loading BlockStatus.' } } },
} satisfies Meta<typeof NotificationExample>

export default meta
type Story = StoryObj<typeof meta>
export const Notifications: Story = {}
export const AutoDismiss: Story = { args: { autoDismiss: true } }
export const FixedPosition: Story = { args: { fixed: true } }

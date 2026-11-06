import type { Meta, StoryObj } from '@storybook/react-vite'
import { ExportProgressExample, NotificationExample } from '../examples'

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

const progressDescription = 'Hub ToastService.progress for work in several steps, such as an audit export in parts. One info toast stays open (duration 0) and is updated in place with the current part, then becomes a success or error toast that dismisses itself. Hub writes the parts into a folder picked once where the browser supports it (Chromium), and downloads them one after another elsewhere; the folder picker and downloads are browser features, not components.'
export const ExportProgress: Story = {
  render: () => <ExportProgressExample />,
  parameters: { controls: { disable: true }, docs: { description: { story: progressDescription } } },
}
export const ExportProgressFailure: Story = {
  render: () => <ExportProgressExample failPart={2} />,
  parameters: { controls: { disable: true }, docs: { description: { story: 'Part 2 fails: the progress toast becomes an error that says how many files were saved.' } } },
}

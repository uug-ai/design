import type { Meta, StoryObj } from '@storybook/react-vite'
import { SAMPLES } from '../samples'
import { NotificationEmailV2, NotificationEmailV2Text, NotificationFiguresV2 } from './component'
import { NOTIFICATION_FIGURES, type NotificationFigure } from './figures'

const sample = (template: NotificationFigure) => ({ template, values: SAMPLES[template] })

const meta = {
  title: 'Emails/Notifications v2',
  component: NotificationEmailV2,
  tags: ['autodocs'],
  args: { template: 'welcome', values: SAMPLES.welcome },
  argTypes: { template: { control: false } },
  parameters: {
    docs: {
      description: {
        component: 'A proposed redesign of the hub-pipeline-notification emails on the license email layout. Each email gets a category colour (Account, Security, Detection, Camera status, Usage, Sharing, Tasks) on its top edge, label and button, and an isometric spot illustration in the style of **Components / Illustrations**, so its purpose reads before the text does. Placeholders are the ones the service already fills, and the plain-text version is generated from the same content as the HTML. The illustrations are SVG here; the emails reference PNG exports at `https://uug.ai/email/<template>.png`, because most email clients do not show SVG.',
      },
    },
  },
} satisfies Meta<typeof NotificationEmailV2>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  parameters: { docs: { description: { story: 'Every notification with its category and illustration.' } } },
  render: () => <NotificationFiguresV2 />,
}
export const Welcome: Story = {}
export const Activated: Story = { args: sample('activate') }
export const ForgotPassword: Story = { args: sample('forgot') }
export const NewLogin: Story = { args: sample('newip') }
export const Detection: Story = { args: sample('detection') }
export const DeviceStatus: Story = { args: sample('device') }
export const DeviceGroupStatus: Story = { args: sample('device_group') }
export const DailyLimitReached: Story = { args: sample('disable') }
export const HighUpload: Story = { args: sample('highupload') }
export const SharedRecording: Story = { args: sample('share') }
export const SharedCase: Story = { args: sample('share_case') }
export const SharedCaseCode: Story = { args: sample('share_case_otp') }
export const TaskAssigned: Story = { args: sample('assign_task') }

export const PlainText: Story = {
  args: { template: 'detection', values: SAMPLES.detection },
  argTypes: { template: { control: 'select', options: NOTIFICATION_FIGURES } },
  parameters: { docs: { description: { story: 'The text/plain alternative, generated from the same content as the HTML. Pick a template in Controls; the values stay those of Detection.' } } },
  render: args => <NotificationEmailV2Text {...args} />,
}

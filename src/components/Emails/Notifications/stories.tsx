import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationEmail, NotificationEmailText, type NotificationTemplate } from './component'
import { SAMPLES } from './samples'

const sample = (template: NotificationTemplate) => ({ template, values: SAMPLES[template] })

const meta = {
  title: 'Emails/Notifications',
  component: NotificationEmail,
  tags: ['autodocs'],
  args: { template: 'welcome', values: SAMPLES.welcome },
  argTypes: { template: { control: false } },
  parameters: {
    docs: {
      description: {
        component: 'The Kerberos Hub emails sent by hub-pipeline-notification over SMTP, with sample values. Edit `values` in Controls to try other content. Templates are filled the way `channels/smtp.go` does it: tab titles are cleared and every `{{placeholder}}` with a value is replaced; placeholders without a value stay in the email. The source of truth is `templates/*.go` in uug-ai/hub-pipeline-notification; keep the copies in `templates/` here in sync. **Plain Text** shows the text alternatives.',
      },
    },
  },
} satisfies Meta<typeof NotificationEmail>

export default meta
type Story = StoryObj<typeof meta>

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
  argTypes: {
    template: {
      control: 'select',
      options: ['welcome', 'activate', 'forgot', 'newip', 'detection', 'device', 'device_group', 'disable', 'highupload', 'share', 'share_case', 'share_case_otp', 'assign_task'],
    },
  },
  parameters: { docs: { description: { story: 'The text/plain alternative. Pick a template in Controls; the values stay those of Detection. Several templates still carry the welcome text here, so the plain-text versions need a pass of their own.' } } },
  render: args => <NotificationEmailText {...args} />,
}

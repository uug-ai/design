import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email, EmailOverview, EmailText } from './component'
import { EMAILS } from './emails'
import type { EmailFigure } from './figures'
import { SAMPLES } from './samples'

const sample = (template: EmailFigure) => ({ template, values: SAMPLES[template] })

const meta = {
  title: 'Emails',
  component: Email,
  tags: ['autodocs'],
  args: sample('license'),
  argTypes: { template: { control: false } },
  parameters: {
    docs: {
      description: {
        component: 'Every email we send customers, on one layout: a card with a category colour (License, Account, Security, Detection, Camera status, Usage, Sharing, Tasks) on its top edge, label and button, and a 16:9 isometric spot illustration with the UUG coin, so the purpose of each email reads before its text. The license emails use hub-license\'s `$placeholders` (plus `$expires` for the end date); the others use the `{{placeholders}}` hub-pipeline-notification fills. Content lives in `emails.ts`, which generates both the HTML and the plain-text version. Edit `values` in Controls to try other content. The illustrations are SVG here; the templates reference 1280 x 720 PNG exports at `https://uug.ai/email/<template>.png`.',
      },
    },
  },
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  parameters: { docs: { description: { story: 'Every email with its category and illustration.' } } },
  render: () => <EmailOverview />,
}
export const License: Story = {}
export const LicenseExpiring: Story = { args: sample('license_expiring') }
export const LicenseExpired: Story = { args: sample('license_expired') }
export const Welcome: Story = { args: sample('welcome') }
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
  args: sample('detection'),
  argTypes: { template: { control: 'select', options: Object.keys(EMAILS) } },
  parameters: { docs: { description: { story: 'The text/plain alternative, generated from the same content as the HTML. Pick a template in Controls; the values stay those of the email shown first.' } } },
  render: args => <EmailText {...args} />,
}

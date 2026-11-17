import type { Meta, StoryObj } from '@storybook/react-vite'
import { Email } from '../component'
import { deviceSections } from '../samples'
import { about, example, plainText } from '../story'

const meta = {
  title: 'Emails/Recording',
  component: Email,
  tags: ['autodocs'],
  args: example('recording'),
  argTypes: { template: { control: false } },
  parameters: about('Sent by the recording check when a camera that records continuously is online but has not uploaded a recording for the account\'s period (1 to 72 hours), and again when it records. One template serves one camera and several; with grouped notifications, cameras that stop at the same time arrive together. The subject comes from the monitor: "A camera stopped recording", "A camera is recording again" or their forms for several cameras.', 'recording'),
} satisfies Meta<typeof Email>

export default meta
type Story = StoryObj<typeof meta>

export const StoppedRecording: Story = {}
export const UploadLimitReached: Story = {
  args: example('recording', {
    text: 'Entrance is online, but hasn\'t uploaded a recording for 3 hours. The account reached its upload limit, so new recordings are not stored.',
    ...deviceSections([{ title: 'Site Bijlokehof · No recordings · 1 camera', cameras: [['Entrance', 'online, no recording for 3 hours, upload limit reached']] }]),
  }),
}
export const SeveralCameras: Story = {
  args: example('recording', {
    text: '3 cameras stopped recording.',
    ...deviceSections([
      { title: 'Site Waterfront · No recordings · all 2 cameras', cameras: [['Gate', 'online, no recording for 2 hours'], ['Dock 1', 'online, no recording for 115 minutes']] },
      { title: 'Other cameras · No recordings · 1 camera', cameras: [['Warehouse', 'online, no recording for 2 hours']] },
    ]),
  }),
}
export const RecordingAgain: Story = {
  args: example('recording', {
    text: 'Entrance is recording again.',
    ...deviceSections([{ title: 'Site Bijlokehof · Recording again · 1 camera', cameras: [['Entrance', 'recording again']] }]),
  }),
}
export const PlainText: Story = { ...plainText('recording') }

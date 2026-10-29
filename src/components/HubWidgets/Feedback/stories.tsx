import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'iconoir-react'
import { HubButton } from '../controls'
import { HubBadge, HubBlockStatus, HubInfobox, HubPlaceholder, HubProgress, HubSpinner, HubStatus } from '../feedback'
import type { HubBadgeTone } from '../feedback'

const meta = {
  title: 'Components/Feedback',
  component: HubBadge,
  tags: ['autodocs'],
  args: { title: 'Online', tone: 'success' },
  argTypes: { tone: { control: 'select', options: ['neutral', 'success', 'alert', 'updating', 'info', 'gold'] } },
  parameters: {
    docs: {
      description: {
        component: 'Hub Badge, Status, Infobox, Progressbar, Spinner and Placeholder presentations. Badges use the production 24px pill and 8px indicator; title-only badges collapse to their dot below 769px. Count badges derive alert/success/updating from available/total. The spinner preserves Hub’s scale-out pulse, with reduced-motion support.',
      },
    },
  },
} satisfies Meta<typeof HubBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Badge: Story = {}
export const Badges: Story = {
  render: () => {
    const tones: HubBadgeTone[] = ['neutral', 'success', 'alert', 'updating', 'info', 'gold']
    return <div className="hub-stack">
      <div className="hub-row">{tones.map(tone => <HubBadge key={tone} title={tone} tone={tone} />)}</div>
      <div className="hub-row">
        <HubBadge title="Online cameras" count={25} total={25} />
        <HubBadge title="Online cameras" count={48} total={50} />
        <HubBadge title="No cameras" count={0} total={0} />
        <HubBadge title="Updating cameras" count={12} tone="updating" />
      </div>
    </div>
  },
}
export const Status: Story = {
  render: () => <div className="hub-row">
    <HubStatus tone="success">Online</HubStatus><HubStatus>Offline</HubStatus>
    <HubStatus tone="updating">Idle</HubStatus><HubStatus tone="alert">Motion detected</HubStatus>
  </div>,
}
export const MobileBadge: Story = { args: { mobile: true } }
export const BlockStatuses: Story = {
  render: function BlockStatusStory() {
    const [visible, setVisible] = useState(true)
    return <div className="hub-stack">
      {visible ? <HubBlockStatus onDismiss={() => setVisible(false)}>Settings apply to this block.</HubBlockStatus>
        : <HubButton onClick={() => setVisible(true)}>Restore status</HubButton>}
      <HubBlockStatus tone="success">Settings saved.</HubBlockStatus>
      <HubBlockStatus tone="error">Unable to save settings.</HubBlockStatus>
      <HubBlockStatus tone="loading">Applying settings...</HubBlockStatus>
    </div>
  },
}
export const LinkedMessage: Story = {
  render: () => <HubInfobox href="#settings">Open camera settings</HubInfobox>,
}
export const Infoboxes: Story = {
  render: function InfoboxStory() {
    const [visible, setVisible] = useState(true)
    return <div className="hub-stack">
      <HubInfobox>Settings apply to all cameras in this site.</HubInfobox>
      <HubInfobox tone="success">Camera settings saved successfully.</HubInfobox>
      <HubInfobox tone="warning">Some cameras are offline. Check their connection.</HubInfobox>
      <HubInfobox tone="error">Unable to connect to the camera. Please try again.</HubInfobox>
      {visible ? <HubInfobox onDismiss={() => setVisible(false)}>This message can be dismissed.</HubInfobox>
        : <HubButton variant="outlined" onClick={() => setVisible(true)}>Restore message</HubButton>}
    </div>
  },
}
export const Loading: Story = {
  render: () => <div className="hub-stack">
    <HubProgress label="Uploading recording" value={65} /><HubSpinner label="Loading recordings" />
  </div>,
}
export const Progress: Story = {
  render: function ProgressStory() {
    const [progress, setProgress] = useState(65)
    return <div className="hub-stack">
      <HubProgress label="Uploading recording" value={progress} />
      <label>Upload progress: {progress}% <input aria-label="Upload progress" type="range" min={0} max={100}
        value={progress} onChange={event => setProgress(event.target.valueAsNumber)} /></label>
    </div>
  },
}
export const EmptyAndError: Story = {
  render: () => <div className="hub-demo-grid">
    <HubPlaceholder title="No cameras yet" description="Add your first camera to start monitoring this site.">
      <HubButton icon={<Plus />}>Add camera</HubButton>
    </HubPlaceholder>
    <HubPlaceholder error title="Unable to load recordings" description="Check your connection and try again.">
      <HubButton variant="outlined">Try again</HubButton>
    </HubPlaceholder>
  </div>,
}

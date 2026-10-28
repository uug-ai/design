import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Plus, Star } from 'iconoir-react'
import { HubBlockButton, HubButton, HubInput, HubToggle } from '../controls'
import { HubBadge, HubBlockStatus } from '../feedback'
import { HubBlock, HubCard, HubKpi } from '../surfaces'

const meta = {
  title: 'Components/Surfaces',
  component: HubCard,
  tags: ['autodocs'],
  args: { title: 'Storage', subtitle: 'Recording storage used', percentage: 68, footer: 'Your current subscription' },
  parameters: {
    docs: {
      description: {
        component: 'Hub Card, Block/BlockHeader/BlockBody/BlockFooter, and KPI presentations. Preserves production header/footer shadows, 24px card padding, 4px corners and responsive KPI type. Blocks are compositional: the consumer supplies body padding/content, just as in Angular. Expandable blocks keep their footer visible when collapsed.',
      },
    },
  },
} satisfies Meta<typeof HubCard>

export default meta
type Story = StoryObj<typeof meta>

export const Card: Story = {}
export const Cards: Story = {
  render: () => <div className="hub-demo-grid">
    <HubCard title="Storage" subtitle="Recording storage used" percentage={68} footer="Your current subscription" />
    <HubCard title="Cameras" subtitle="Connected to this project" percentage={25} unit="" footer="All cameras are online" />
  </div>,
}
export const CardWithIconAndAction: Story = {
  render: function CardActionStory() {
    const [result, setResult] = useState('')
    return <div className="hub-stack"><HubCard title="Subscription" subtitle="Your current plan" icon={<Star />}
      footer="Professional" action={{ text: 'Manage plan', onClick: () => setResult('Manage plan selected') }} />
      <output role="status">{result}</output></div>
  },
}
export const HeaderActions: Story = {
  render: function HeaderActionsStory() {
    const [result, setResult] = useState('')
    return <HubBlock title="Camera settings" expandable
      headerActions={<HubBlockButton icon={<Plus />} onClick={() => setResult('Add selected')}>Add</HubBlockButton>}>
      <HubBlockStatus tone="info">Settings apply to this block.</HubBlockStatus>
      <div style={{ padding: 24 }}><HubInput label="Camera name" defaultValue="Entrance camera" /><output role="status">{result}</output></div>
    </HubBlock>
  },
}
export const Block: Story = {
  render: () => <HubBlock title="Camera settings" expandable
    footer={<><span>Changes apply to this camera</span><HubButton>Save settings</HubButton></>}>
    <div className="hub-stack" style={{ padding: 24 }}>
      <HubInput label="Camera name" defaultValue="Entrance camera" />
      <HubToggle label="Motion detection" description="Record when motion is detected." defaultChecked />
    </div>
  </HubBlock>,
}
export const CollapsedBlock: Story = {
  render: () => <HubBlock title="Advanced settings" expandable defaultExpanded={false}>
    <div style={{ padding: 24 }}><HubInput label="Recording duration" defaultValue="30 seconds" /></div>
  </HubBlock>,
}
export const Kpis: Story = {
  render: () => <div className="hub-demo-grid">
    <HubKpi value={25} total={25} footer="Cameras online" />
    <HubKpi value={1284} change={24} footer="Recordings today" />
    <HubKpi value={68} unit="%" change={-3} footer="Storage used" />
    <HubKpi value={0} footer="Loading recordings" loading />
  </div>,
}
export const AdvancedKpis: Story = {
  render: () => <div className="hub-demo-grid">
    <HubKpi value={12} change={8} regress={3} mode="counting" footer="Directional count" />
    <HubKpi value={0} duration="00:04:32" count={8} mode="dwell" footer="Average dwell time" />
    <HubKpi value={0} duration="00:12:15" count={24} change={18} regress={6} mode="occupancy" footer="Region occupancy" />
    <HubKpi value={25} total={50} overlay footer="Overlay KPI" />
  </div>,
}
export const Composition: Story = {
  render: () => <div className="hub-stack">
    <div className="hub-row"><h2 className="hub-demo-title">Site overview</h2><HubBadge title="Online cameras" count={25} total={25} /></div>
    <div className="hub-demo-grid">
      <HubKpi value={25} total={25} footer="Cameras online" />
      <HubKpi value={1284} change={24} footer="Recordings today" />
      <HubCard title="Storage" subtitle="Recording storage used" percentage={68} footer="Your current subscription" />
    </div>
    <HubBlock title="Recording preferences" expandable
      footer={<><span>Project settings</span><HubButton>Save settings</HubButton></>}>
      <div style={{ padding: 24 }}>
        <HubToggle label="Motion detection" description="Record when motion is detected." defaultChecked />
        <HubToggle label="Notifications" description="Notify the team when an alert rule matches." />
      </div>
    </HubBlock>
  </div>,
}

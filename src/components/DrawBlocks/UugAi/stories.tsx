import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawBlockPreview } from '../component'

const meta = {
  title: 'Draw/Building blocks/uug.ai',
  component: DrawBlockPreview,
  parameters: { layout: 'centered', controls: { disable: true } },
} satisfies Meta<typeof DrawBlockPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Agent: Story = { name: 'Agent', args: { blockKey: 'agent' } }
export const Vault: Story = { name: 'Vault', args: { blockKey: 'vault' } }
export const Hub: Story = { name: 'Hub', args: { blockKey: 'hub' } }
export const Factory: Story = { name: 'Factory', args: { blockKey: 'factory' } }
export const Frontend: Story = { name: 'Frontend', args: { blockKey: 'frontend' } }
export const PipelineMonitor: Story = { name: 'Monitor', args: { blockKey: 'pipeline-monitor' } }
export const PipelineSequence: Story = { name: 'Sequence', args: { blockKey: 'pipeline-sequence' } }
export const PipelineAnalysis: Story = { name: 'Analysis', args: { blockKey: 'pipeline-analysis' } }
export const PipelineClassifier: Story = { name: 'Classifier', args: { blockKey: 'pipeline-classifier' } }
export const PipelineThreshold: Story = { name: 'Threshold', args: { blockKey: 'pipeline-threshold' } }
export const PipelineNotification: Story = { name: 'Notification', args: { blockKey: 'pipeline-notification' } }
export const PipelineSprite: Story = { name: 'Sprite', args: { blockKey: 'pipeline-sprite' } }
export const PipelineDominantcolor: Story = { name: 'Dominant color', args: { blockKey: 'pipeline-dominantcolor' } }
export const PipelineThumbnail: Story = { name: 'Thumbnail', args: { blockKey: 'pipeline-thumbnail' } }
export const PipelineExport: Story = { name: 'Export', args: { blockKey: 'pipeline-export' } }
export const PipelineCounting: Story = { name: 'Counting', args: { blockKey: 'pipeline-counting' } }
export const PipelineLicenseplate: Story = { name: 'License plate', args: { blockKey: 'pipeline-licenseplate' } }
export const PipelineNohelmet: Story = { name: 'No helmet', args: { blockKey: 'pipeline-nohelmet' } }
export const PipelineLlm: Story = { name: 'LLM', args: { blockKey: 'pipeline-llm' } }

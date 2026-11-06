import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawBlockPreview } from '../component'

const meta = {
  title: 'Draw/Building blocks/Isometric',
  component: DrawBlockPreview,
  parameters: { layout: 'centered', controls: { disable: true } },
} satisfies Meta<typeof DrawBlockPreview>

export default meta
type Story = StoryObj<typeof meta>

export const IsoCameraBullet: Story = { name: 'Bullet camera', args: { blockKey: 'iso-camera-bullet' } }
export const IsoCameraDome: Story = { name: 'Dome camera', args: { blockKey: 'iso-camera-dome' } }
export const IsoCameraPtz: Story = { name: 'PTZ camera', args: { blockKey: 'iso-camera-ptz' } }
export const IsoCameraTurret: Story = { name: 'Turret camera', args: { blockKey: 'iso-camera-turret' } }
export const IsoAiModel: Story = { name: 'AI model', args: { blockKey: 'iso-ai-model' } }

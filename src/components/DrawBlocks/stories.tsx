import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawBlockCatalogue, DrawBlockPreview, DrawBlockWorkbench } from './component'
import { blockSections } from './production/blocks'

const meta = {
  title: 'Draw/Building blocks',
  component: DrawBlockPreview,
  tags: ['autodocs'],
  args: { blockKey: 'agent' },
  argTypes: {
    blockKey: { control: 'select', options: blockSections.flatMap(section => section.blocks.map(block => block.key)) },
    theme: { control: 'inline-radio', options: ['light', 'dark'] },
    header: { control: 'text' }, title: { control: 'text' }, subtitle: { control: 'text' },
    badges: { control: 'object' },
    width: { control: { type: 'range', min: 24, max: 600, step: 1 } },
    height: { control: { type: 'range', min: 24, max: 600, step: 1 } },
    headerColor: { control: 'color' }, cardColor: { control: 'color' },
    titleColor: { control: 'color' }, subtitleColor: { control: 'color' },
    accentColor: { control: 'color' }, radius: { control: { type: 'range', min: 0, max: 32 } },
  },
  parameters: {
    docs: { description: { component: 'The exact Draw production building-block renderer and catalogue, including General, UUG.AI, AWS, Azure, Google Cloud, Kubernetes and isometric blocks. Use Playground to select and experiment with a block, or Single Block for Storybook controls. Labels, badges, dimensions, card colours, corner radius and isometric accent can be previewed in both themes. Design experiments are local and do not update live Draw; copy settings for code review. Refresh the production snapshot with npm run sync:draw-blocks.' } },
  },
} satisfies Meta<typeof DrawBlockPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { render: () => <DrawBlockWorkbench />, parameters: { controls: { disable: true } } }
export const SingleBlock: Story = {}
export const Catalogue: Story = { render: () => <DrawBlockCatalogue />, parameters: { controls: { disable: true } } }
export const General: Story = { render: () => <DrawBlockCatalogue group="General" />, parameters: { controls: { disable: true } } }
export const UugAi: Story = { name: 'UUG.AI', render: () => <DrawBlockCatalogue group="uug.ai" />, parameters: { controls: { disable: true } } }
export const CloudProviders: Story = {
  render: () => <><DrawBlockCatalogue group="AWS" /><DrawBlockCatalogue group="Azure" /><DrawBlockCatalogue group="Google Cloud" /></>,
  parameters: { controls: { disable: true } },
}
export const Kubernetes: Story = { render: () => <DrawBlockCatalogue group="Kubernetes" />, parameters: { controls: { disable: true } } }
export const Isometric: Story = { render: () => <DrawBlockCatalogue group="Isometric" />, parameters: { controls: { disable: true } } }
export const CompactCard: Story = { args: { blockKey: 'agent', width: 140, height: 90, title: 'Entrance camera Agent' } }
export const DarkMode: Story = { args: { blockKey: 'agent', theme: 'dark' } }

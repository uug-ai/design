import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import MapBadge from './component'

const playgroundHtml = `
  <span class="map-badge map-badge--primary map-badge--interactive" style="--map-badge-size: 32px;" aria-label="San Francisco" title="San Francisco">
    <svg class="map-badge__svg" width="32" height="32" viewBox="0 0 28 28" role="img" aria-hidden="true" focusable="false">
      <circle class="map-badge__halo" cx="14" cy="14" r="13"></circle>
      <circle class="map-badge__site-face" cx="14" cy="14" r="13" fill="#a22aff" fill-opacity="0.25" stroke="#a22aff" stroke-width="2"></circle>
      <text class="map-badge__text" x="14" y="15" text-anchor="middle" dominant-baseline="middle" fill="#323232">SF</text>
    </svg>
  </span>
`

const meta = {
  title: 'Components/Map Badge',
  component: MapBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'SF',
    title: 'San Francisco',
    tone: 'primary',
    size: 32,
    interactive: true,
    variant: 'cluster',
    theme: 'light',
  },
} satisfies Meta<typeof MapBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: htmlCssSource(playgroundHtml, componentCss),
}

export const ToneRamp: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <MapBadge label="SF" title="San Francisco" tone="primary" />
      <MapBadge label="CH" title="Chicago" tone="secondary" />
      <MapBadge label="TK" title="Tokyo" tone="accent" />
    </div>
  ),
}

export const Cluster: Story = {
  args: {
    label: '+8',
    title: 'Eight sites',
    variant: 'cluster',
    tone: 'primary',
  },
}

export const SizeRamp: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <MapBadge label="SF" title="San Francisco" size={24} />
      <MapBadge label="SF" title="San Francisco" size={32} />
      <MapBadge label="SF" title="San Francisco" size={40} />
    </div>
  ),
}

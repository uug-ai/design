import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import InteractiveMap from './component'

const playgroundHtml = `
  <section class="interactive-map" aria-labelledby="map-title" aria-describedby="map-description">
    <div class="interactive-map__toolbar">
      <div class="interactive-map__heading">
        <p class="interactive-map__eyebrow">Interactive visual</p>
        <h3 id="map-title">Global activity map</h3>
        <p id="map-description">Scroll to zoom, drag to pan, and reset the view at any time.</p>
      </div>
      <div class="interactive-map__controls" aria-label="Map controls">
        <span class="interactive-map__zoom-readout">100%</span>
        <button class="interactive-map__control-button" type="button" aria-label="Zoom out">-</button>
        <button class="interactive-map__control-button" type="button" aria-label="Zoom in">+</button>
        <button class="interactive-map__control-button" type="button" aria-label="Reset map view">R</button>
      </div>
    </div>
    <div class="interactive-map__viewport">
      <div class="interactive-map__hint">
        <span>Scroll to zoom</span>
        <span>Drag to explore</span>
      </div>
      <div class="interactive-map__scene">
        <div class="interactive-map__glow interactive-map__glow--left"></div>
        <div class="interactive-map__glow interactive-map__glow--right"></div>
        <div class="interactive-map__grid"></div>
      </div>
    </div>
  </section>
`

const meta = {
  title: 'Components/Interactive Map',
  component: InteractiveMap,
  tags: ['autodocs'],
  args: {
    title: 'Global activity map',
    description: 'Scroll to zoom, drag to pan, and reset the view at any time.',
    minScale: 1,
    maxScale: 2.8,
    initialScale: 1,
    theme: 'light',
  },
  argTypes: {
    className: {
      control: false,
    },
    theme: {
      control: 'inline-radio',
      options: ['light', 'dark', 'auto'],
    },
  },
} satisfies Meta<typeof InteractiveMap>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: htmlCssSource(playgroundHtml, componentCss, {
    layout: 'fullscreen',
  }),
}

export const FocusedView: Story = {
  args: {
    title: 'Network rollout map',
    description: 'A tighter zoom range for dashboards where the map starts in a more focused state.',
    minScale: 1.2,
    initialScale: 1.35,
    maxScale: 3.2,
  },
}

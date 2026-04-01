import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import MapAnnotationCard from './component'

const playgroundHtml = `
  <article class="map-annotation-card" data-theme="light">
    <div class="map-annotation-card__shell">
      <div class="map-annotation-card__content">
        <div>
          <strong>Smart + Outdoor</strong>
          <span>Devices active in 25 sites</span>
        </div>
      </div>
    </div>
  </article>
`

const meta = {
  title: 'Components/Map Annotation Card',
  component: MapAnnotationCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Smart + Outdoor',
    description: 'Devices active in 25 sites',
    theme: 'light',
  },
} satisfies Meta<typeof MapAnnotationCard>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: htmlCssSource(playgroundHtml, componentCss),
}

export const Pulsing: Story = {
  args: {
    title: 'AI routing live',
    description: 'Vision streams synchronized',
  },
}

export const Dark: Story = {
  args: {
    title: 'AI routing live',
    description: 'Vision streams synchronized',
    theme: 'dark',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

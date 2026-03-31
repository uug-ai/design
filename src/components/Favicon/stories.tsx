import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import Favicon from './component'

const playgroundHtml = `
  <div class="favicon-tile favicon-tile--surface" style="--favicon-size: 32px;" aria-label="UUG favicon">
    <img class="favicon-tile__image" src="favicon-32x32.png" alt="UUG favicon" width="32" height="32" />
  </div>
`

const contrastHtml = `
  <div class="favicon-tile favicon-tile--contrast" style="--favicon-size: 64px;" aria-label="UUG favicon on dark surfaces">
    <img class="favicon-tile__image" src="favicon-32x32.png" alt="UUG favicon on dark surfaces" width="64" height="64" />
  </div>
`

const sizeRampHtml = `
  <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
    <div class="favicon-tile favicon-tile--surface" style="--favicon-size: 16px;" aria-label="UUG favicon 16 pixels">
      <img class="favicon-tile__image" src="favicon-32x32.png" alt="UUG favicon 16 pixels" width="16" height="16" />
    </div>
    <div class="favicon-tile favicon-tile--surface" style="--favicon-size: 32px;" aria-label="UUG favicon 32 pixels">
      <img class="favicon-tile__image" src="favicon-32x32.png" alt="UUG favicon 32 pixels" width="32" height="32" />
    </div>
    <div class="favicon-tile favicon-tile--surface" style="--favicon-size: 64px;" aria-label="UUG favicon 64 pixels">
      <img class="favicon-tile__image" src="favicon-32x32.png" alt="UUG favicon 64 pixels" width="64" height="64" />
    </div>
  </div>
`

const meta = {
  title: 'Components/Favicon',
  component: Favicon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    size: 32,
    tone: 'surface',
    label: 'UUG favicon',
  },
} satisfies Meta<typeof Favicon>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: htmlCssSource(playgroundHtml, componentCss),
}

export const Contrast: Story = {
  parameters: htmlCssSource(contrastHtml, componentCss, {
    backgrounds: {
      default: 'dark',
    },
  }),
  args: {
    size: 64,
    tone: 'contrast',
    label: 'UUG favicon on dark surfaces',
  },
}

export const SizeRamp: Story = {
  parameters: htmlCssSource(sizeRampHtml, componentCss),
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
      <Favicon size={16} label="UUG favicon 16 pixels" />
      <Favicon size={32} label="UUG favicon 32 pixels" />
      <Favicon size={64} label="UUG favicon 64 pixels" />
    </div>
  ),
}
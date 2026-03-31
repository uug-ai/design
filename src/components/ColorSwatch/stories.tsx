import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import ColorSwatch from './component'

const primaryHtml = `
  <div class="color-swatch">
    <div class="color-preview" style="background: #2713ff;" aria-label="Color: Primary"></div>
    <div class="color-info">
      <div class="color-name">Primary</div>
      <div class="color-value">#2713ff</div>
      <div class="color-variable">var(--primary-color)</div>
    </div>
  </div>
`

const secondaryHtml = `
  <div class="color-swatch">
    <div class="color-preview" style="background: #ff0059;" aria-label="Color: Secondary"></div>
    <div class="color-info">
      <div class="color-name">Secondary</div>
      <div class="color-value">#ff0059</div>
      <div class="color-variable">var(--secondary-color)</div>
    </div>
  </div>
`

const surfaceTokenHtml = `
  <div class="color-swatch">
    <div class="color-preview" style="background: #f7f5fb;" aria-label="Color: Surface"></div>
    <div class="color-info">
      <div class="color-name">Surface</div>
      <div class="color-value">#f7f5fb</div>
      <div class="color-variable">var(--surface)</div>
    </div>
  </div>
`

const solidColorOnlyHtml = `
  <div class="color-swatch">
    <div class="color-preview" style="background: #1bb56b;" aria-label="Color: Success"></div>
    <div class="color-info">
      <div class="color-name">Success</div>
      <div class="color-value">#1bb56b</div>
    </div>
  </div>
`

const meta = {
  title: 'Components/ColorSwatch',
  component: ColorSwatch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    name: 'Primary',
    value: '#2713ff',
    variable: '--primary-color',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(420px, 100%)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ColorSwatch>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  parameters: htmlCssSource(primaryHtml, componentCss),
}

export const Secondary: Story = {
  parameters: htmlCssSource(secondaryHtml, componentCss),
  args: {
    name: 'Secondary',
    value: '#ff0059',
    variable: '--secondary-color',
  },
}

export const SurfaceToken: Story = {
  parameters: htmlCssSource(surfaceTokenHtml, componentCss),
  args: {
    name: 'Surface',
    value: '#f7f5fb',
    variable: '--surface',
  },
}

export const SolidColorOnly: Story = {
  parameters: htmlCssSource(solidColorOnlyHtml, componentCss),
  args: {
    name: 'Success',
    value: '#1bb56b',
    variable: undefined,
  },
}
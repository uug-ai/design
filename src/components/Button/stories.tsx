import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import ButtonShowcase from './component'

const buttonsHtml = `
  <div class="demo-area">
    <button class="btn btn-primary" type="button">Primary Button</button>
    <button class="btn btn-secondary" type="button">Secondary Button</button>
    <button class="btn btn-primary" type="button" disabled>Disabled Button</button>
  </div>
`

const meta = {
  title: 'Components/Buttons',
  component: ButtonShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonShowcase>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: htmlCssSource(buttonsHtml, componentCss),
}
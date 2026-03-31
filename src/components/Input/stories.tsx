import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import InputShowcase from './component'

const inputsHtml = `
  <div class="demo-area">
    <div class="input-group">
      <label class="input-label" for="storybook-email">Email</label>
      <input class="input" type="email" id="storybook-email" placeholder="Enter your email" />
    </div>
  </div>
`

const meta = {
  title: 'Components/Inputs',
  component: InputShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof InputShowcase>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: htmlCssSource(inputsHtml, componentCss),
}
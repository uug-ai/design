import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import buttonCss from '../Button/component.css?raw'
import componentCss from './component.css?raw'
import CardShowcase from './component'

const cardsHtml = `
  <div class="demo-area">
    <article class="card">
      <h3>Card Title</h3>
      <p>Card content goes here with descriptive text that explains the card's purpose.</p>
      <button class="btn btn-primary" type="button">Action</button>
    </article>
  </div>
`

const cardsCss = `${componentCss}

${buttonCss}`

const meta = {
  title: 'Components/Cards',
  component: CardShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof CardShowcase>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: htmlCssSource(cardsHtml, cardsCss),
}
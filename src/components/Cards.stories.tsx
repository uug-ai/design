import type { Meta, StoryObj } from '@storybook/react-vite'
import '../pages/Home.css'
import '../pages/Components.css'

function CardsShowcase() {
  return (
    <div className="demo-area">
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Card Title</h3>
        <p>Card content goes here with descriptive text that explains the card's purpose.</p>
        <button className="btn btn-primary">Action</button>
      </div>
    </div>
  )
}

const meta = {
  title: 'Components/Cards',
  component: CardsShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof CardsShowcase>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
import type { Meta, StoryObj } from '@storybook/react-vite'
import '../pages/Home.css'
import '../pages/Components.css'

function ButtonsShowcase() {
  return (
    <div className="demo-area">
      <button className="btn btn-primary">Primary Button</button>
      <button className="btn btn-secondary">Secondary Button</button>
      <button className="btn btn-primary" disabled>
        Disabled Button
      </button>
    </div>
  )
}

const meta = {
  title: 'Components/Buttons',
  component: ButtonsShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonsShowcase>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
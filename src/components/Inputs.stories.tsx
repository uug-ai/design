import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import '../pages/Components.css'

function InputsShowcase() {
  const [value, setValue] = useState('')

  return (
    <div className="demo-area">
      <div className="input-group">
        <label htmlFor="storybook-email" className="input-label">
          Email
        </label>
        <input
          type="email"
          id="storybook-email"
          className="input"
          placeholder="Enter your email"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </div>
  )
}

const meta = {
  title: 'Components/Inputs',
  component: InputsShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof InputsShowcase>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
import type { Meta, StoryObj } from '@storybook/react-vite'
import ColorSwatch from './ColorSwatch'

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

export const Primary: Story = {}

export const Secondary: Story = {
  args: {
    name: 'Secondary',
    value: '#ff0059',
    variable: '--secondary-color',
  },
}

export const SurfaceToken: Story = {
  args: {
    name: 'Surface',
    value: '#f7f5fb',
    variable: '--surface',
  },
}

export const SolidColorOnly: Story = {
  args: {
    name: 'Success',
    value: '#1bb56b',
    variable: undefined,
  },
}
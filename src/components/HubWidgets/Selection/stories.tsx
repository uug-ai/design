import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectionExample } from '../examples'

const meta = {
  title: 'Components/Selection',
  component: SelectionExample,
  tags: ['autodocs'],
  args: { disabled: false, readOnly: false, loading: false, error: '', searchable: true, locked: false },
  parameters: { docs: { description: { component: 'Hub SelectInput, RadioSelect, MultiSelect, SelectOverlay and MultiselectOverlay presentations. Popups reposition on scroll/resize and stay within the viewport. Multi-selection supports locked/disabled options, clear, search and loading. Escape restores trigger focus; native radio/checkbox inputs retain keyboard navigation.' } } },
} satisfies Meta<typeof SelectionExample>

export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const LockedSelections: Story = { args: { locked: true } }
export const ReadOnly: Story = { args: { readOnly: true } }
export const Disabled: Story = { args: { disabled: true } }
export const Error: Story = { args: { error: 'Select at least one site.' } }
export const Loading: Story = { args: { loading: true } }
export const WithoutSearch: Story = { args: { searchable: false } }

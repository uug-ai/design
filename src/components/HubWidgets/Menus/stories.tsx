import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuExample } from '../examples'

const meta = {
  title: 'Components/Menus',
  component: MenuExample,
  tags: ['autodocs'],
  args: { single: false, empty: false, allDisabled: false },
  parameters: { docs: { description: { component: 'Hub ActionsMenu and ControlsPopup presentations. No visible actions hides the trigger; a single visible action becomes a direct button. Menus support icons, destructive, hidden and disabled items, arrow/Home/End navigation, outside dismissal and Escape focus restoration.' } } },
} satisfies Meta<typeof MenuExample>

export default meta
type Story = StoryObj<typeof meta>
export const ActionsAndControls: Story = {}
export const SingleAction: Story = { args: { single: true } }
export const NoVisibleActions: Story = { args: { empty: true } }
export const DisabledItems: Story = { args: { allDisabled: true } }

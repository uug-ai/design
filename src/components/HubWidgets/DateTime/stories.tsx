import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateTimeExample } from '../examples'

const meta = {
  title: 'Components/Date and time',
  component: DateTimeExample,
  tags: ['autodocs'],
  args: { view: 'all', disabled: false, locale: 'en-GB', appearance: 'field', error: '' },
  argTypes: {
    view: { control: 'select', options: ['all', 'calendar', 'available', 'input', 'time'] },
    appearance: { control: 'select', options: ['field', 'filter', 'button'] },
  },
  parameters: { docs: { description: { component: 'Hub DateInput, DatePicker and TimeSpinner presentations. Calendar supports min/max dates, available-recording indicators, clear, localized labels, month navigation, arrow keys and Home/End/PageUp/PageDown. Time values are seconds since midnight; native date inputs retain browser validation.' } } },
} satisfies Meta<typeof DateTimeExample>

export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Calendar: Story = { args: { view: 'calendar' } }
export const AvailableDatesOnly: Story = { args: { view: 'available' } }
export const ButtonAppearance: Story = { args: { view: 'calendar', appearance: 'button' } }
export const FilterAppearance: Story = { args: { view: 'calendar', appearance: 'filter' } }
export const DateInput: Story = { args: { view: 'input' } }
export const TimeSpinner: Story = { args: { view: 'time' } }
export const Disabled: Story = { args: { disabled: true } }
export const Error: Story = { args: { error: 'Choose a date within the allowed range.' } }
export const Localized: Story = { args: { locale: 'nl-BE' } }

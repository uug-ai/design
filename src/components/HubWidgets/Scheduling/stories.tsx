import type { Meta, StoryObj } from '@storybook/react-vite'
import { SchedulingExample } from '../examples'

const meta = {
  title: 'Components/Scheduling',
  component: SchedulingExample,
  tags: ['autodocs'],
  args: { weekly: false, disabled: false, maxSegments: 2 },
  parameters: { docs: { description: { component: 'Hub RangeSlider and WeeklySchedule presentations. Drag segment handles or a whole segment, use arrow/Home/End keys, edit exact minute readouts, and add/remove non-overlapping segments. Weekly values use Sunday=0, seconds since midnight and explicit timezones. Edits preserve other days; empty days remain empty and midnight is 86400, never wrapped to zero.' } } },
} satisfies Meta<typeof SchedulingExample>

export default meta
type Story = StoryObj<typeof meta>
export const RangeSlider: Story = {}
export const WeeklySchedule: Story = { args: { weekly: true } }
export const Disabled: Story = { args: { disabled: true } }
export const DisabledWeeklySchedule: Story = { args: { weekly: true, disabled: true } }
export const MultipleSegments: Story = { args: { maxSegments: 4 } }

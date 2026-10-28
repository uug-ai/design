import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataExample } from '../examples'

const meta = {
  title: 'Components/Data',
  component: DataExample,
  tags: ['autodocs'],
  args: { view: 'table', empty: false, loading: false },
  argTypes: { view: { control: 'select', options: ['table', 'load-more'] } },
  parameters: { docs: { description: { component: 'Hub TableField pagination and LoadMore presentations, with local camera fixtures. Tables use semantic headers/caption, emphasis/alignment and horizontal scrolling; pagination clamps safely when filtering reduces the result set. Load more simulates a short local delay without making network requests.' } } },
} satisfies Meta<typeof DataExample>

export default meta
type Story = StoryObj<typeof meta>
export const Table: Story = {}
export const Empty: Story = { args: { empty: true } }
export const Loading: Story = { args: { loading: true } }
export const LoadMore: Story = { args: { view: 'load-more' } }
export const LoadingMore: Story = { args: { view: 'load-more', loading: true } }
export const NoMoreResults: Story = { args: { view: 'load-more', empty: true } }

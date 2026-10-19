import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import MetricCard from './component'
import HtmlExample from '../html/HtmlExample'
import { nativeComponentSource } from '../../config/storybookSource'
import exampleHtml from './example.html?raw'
import componentCss from './component.css?raw'

const meta = {
  title: 'Components/Metric Card',
  component: MetricCard,
  tags: ['autodocs'],
  args: {
    label: 'Recordings',
    value: '1,248',
    description: 'Across the selected devices today',
    trend: { label: '+12% compared with yesterday', tone: 'success' },
  },
  parameters: {
    hubVisuals: true,
    a11y: { test: 'todo' },
    docs: {
      description: {
        component: 'Hub KPI visual extraction: centered number inside a 150px card, original shadow and 4px corners, responsive 26/33/38/42px Inter, and a caption below the card as in the current Angular template. Units/comparisons sit beside the value, not in a marketing-style stacked card. Semantic dl/dt/dd, explicit zero/loading and reduced motion are portable improvements. Existing Hub green/grey unit and trend contrast limitations remain visible in accessibility reports (todo); do not treat visual fidelity as WCAG certification. Format values and determine trend meaning in the application.',
      },
    },
  },
} satisfies Meta<typeof MetricCard>

export default meta
type Story = StoryObj<typeof meta>

export const HTMLAndCSS: Story = {
  render: () => <HtmlExample html={exampleHtml} />,
  parameters: nativeComponentSource(exampleHtml, componentCss),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('0')).toBeVisible()
    await expect(canvasElement.querySelector('dl')).toHaveAttribute('aria-busy', 'false')
  },
}

export const Playground: Story = {}

export const Zero: Story = {
  args: { value: 0, trend: undefined },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('0')).toBeVisible()
    await expect(canvasElement.querySelector('dl')).toHaveAttribute('aria-busy', 'false')
  },
}

export const Loading: Story = {
  args: { loading: true, loadingLabel: 'Loading recordings' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Loading recordings')).toBeVisible()
    await expect(canvas.queryByText('1,248')).toBeNull()
    await expect(canvas.queryByText('+12% compared with yesterday')).toBeNull()
    await expect(canvasElement.querySelector('dl')).toHaveAttribute('aria-busy', 'true')
  },
}

export const Duration: Story = {
  args: { label: 'Time in region', value: '02:34:12', description: 'Hours, minutes and seconds', trend: undefined },
}

export const NegativeComparison: Story = {
  args: { label: 'Missing recording time', value: 18, unit: 'min', trend: { label: '+6 min missing since yesterday', tone: 'danger' } },
}

export const Narrow: Story = {
  args: { label: 'Total recordings across all selected devices', value: '1,234,567', unit: 'recordings' },
  decorators: [(Story) => <div style={{ maxWidth: 240 }}><Story /></div>],
}

export const Dark: Story = {
  decorators: [(Story) => <div data-theme="dark" style={{ background: 'var(--hub-ui-card)', padding: 24 }}><Story /></div>],
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import StatusBadge, { type StatusBadgeTone } from './component'
import HtmlExample from '../html/HtmlExample'
import { nativeComponentSource } from '../../config/storybookSource'
import exampleHtml from './example.html?raw'
import componentCss from './component.css?raw'

const meta = {
  title: 'Components/Status Badge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: { label: 'Connected', tone: 'success' },
  argTypes: { tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
  parameters: {
    hubVisuals: true,
    a11y: { test: 'error' },
    docs: {
      description: {
        component: 'Hub Badge visual extraction: 24px pill, 13px uppercase Inter, 8px indicator, neutral text and a 20% semantic tint. Hub alert maps to danger and updating to warning. Unlike Hub, the portable recipe deliberately keeps its label visible below 769px for accessibility and allows long labels to wrap. This is Badge, not the separate unboxed Status/camera-bullet widget. Hub count/ratio and gold variants are not extracted here. No live region by default.',
      },
    },
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const HTMLAndCSS: Story = {
  render: () => <HtmlExample html={exampleHtml} />,
  parameters: nativeComponentSource(exampleHtml, componentCss),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Connected')).toBeVisible()
  },
}

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Connected')).toBeVisible()
    await expect(canvasElement.querySelector('[role="alert"]')).toBeNull()
  },
}

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {(['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone: StatusBadgeTone) => (
        <StatusBadge key={tone} tone={tone} label={tone} />
      ))}
    </div>
  ),
}

export const LongLabel: Story = {
  args: { label: 'Waiting for the recording analysis worker to reconnect', tone: 'warning' },
  decorators: [(Story) => <div style={{ width: 220 }}><Story /></div>],
}

export const Dark: Story = {
  ...AllTones,
  decorators: [(Story) => <div data-theme="dark" style={{ background: 'var(--hub-ui-card)', padding: 24 }}><Story /></div>],
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import HtmlExample from '../html/HtmlExample'
import { applicationLayoutExample as example } from '../html/examples'
import { nativeComponentSource } from '../../config/storybookSource'

const meta = {
  title: 'Components/Application Layout',
  tags: ['autodocs'],
  render: () => <HtmlExample html={example.html} />,
  parameters: {
    hubVisuals: true,
    layout: 'fullscreen',
    a11y: { test: 'todo' },
    docs: {
      description: {
        component: 'A composed current-Hub visual reference: the actual purple accent, self-hosted Inter, 12px rhythm, 4px corners, sidebar widths, 6px top gradient and shared widget styles. This is a representative devices composition, not a screenshot or a functioning Hub application. Navigation and Add device are illustrative; search does not filter fixture rows, and the segment helper changes selection only. Container breakpoints fit embedded previews; the mobile overlay menu, routing, data and permissions remain application-owned. Existing Hub accent/feedback contrast limitations are retained and reported rather than silently redesigned.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const HTMLAndCSS: Story = {
  parameters: nativeComponentSource(example.html, example.css, true, example.dependencies),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Devices' })).toBeVisible()
    await expect(canvas.getByRole('table', { name: 'Example devices' })).toBeVisible()
    await expect(canvas.getByRole('searchbox', { name: 'Search devices' })).toBeVisible()
  },
}

export const Narrow: Story = {
  ...HTMLAndCSS,
  decorators: [(Story) => <div style={{ maxWidth: 390 }}><Story /></div>],
}

export const Dark: Story = {
  ...HTMLAndCSS,
  decorators: [(Story) => <div data-theme="dark"><Story /></div>],
}

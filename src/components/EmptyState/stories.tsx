import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Search } from 'iconoir-react'
import EmptyState from './component'
import HtmlExample from '../html/HtmlExample'
import { nativeComponentSource } from '../../config/storybookSource'
import exampleHtml from './example.html?raw'
import componentCss from './component.css?raw'

const onAction = fn()
const meta = {
  title: 'Components/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No devices yet',
    description: 'Connect a device to start receiving recordings.',
    action: { label: 'Add a device', onClick: onAction },
  },
  parameters: {
    hubVisuals: true,
    a11y: { test: 'error' },
    docs: {
      description: {
        component: 'Framework-neutral HTML/CSS for first-use emptiness, no results and recoverable failure. Start with HTML And CSS for a native recipe, also exported under ui/empty-state/. Other stories use the optional React adapter. Origin: Hub shared/widgets/placeholder, used by devices and analytics. Never mask a failed request as no data or show empty results while loading. Choose a semantic h2/h3; icons are decorative. The optional native button needs an application callback. The parent owns result announcements and focus.',
      },
    },
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const HTMLAndCSS: Story = {
  render: () => <HtmlExample html={exampleHtml} />,
  parameters: nativeComponentSource(exampleHtml, componentCss),
  play: async ({ canvasElement }) => {
    const action = within(canvasElement).getByRole('button', { name: 'Add a device' })
    const onClick = fn()
    action.addEventListener('click', onClick, { once: true })
    action.focus()
    await userEvent.keyboard('{Enter}')
    await expect(onClick).toHaveBeenCalledOnce()
  },
}

export const FirstUse: Story = {
  play: async ({ canvasElement }) => {
    onAction.mockClear()
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'No devices yet', level: 3 })).toBeVisible()
    const action = canvas.getByRole('button', { name: 'Add a device' })
    action.focus()
    await userEvent.keyboard('{Enter}')
    await expect(onAction).toHaveBeenCalledTimes(1)
  },
}

export const NoResults: Story = {
  args: {
    title: 'No recordings match these filters',
    description: 'Try another date or clear the current filters.',
    icon: <Search width={32} height={32} />,
    action: { label: 'Clear filters', onClick: fn() },
  },
}

export const Error: Story = {
  args: {
    title: 'Recordings could not be loaded',
    description: 'Check the connection and try again. Your filters have been kept.',
    variant: 'error',
    action: { label: 'Try again', onClick: fn() },
  },
}

export const ReadOnly: Story = {
  args: { title: 'No activity for this period', action: undefined, headingLevel: 'h2' },
}

export const DisabledAction: Story = {
  args: { action: { label: 'Adding device', onClick: onAction, disabled: true } },
  play: async ({ canvasElement }) => {
    onAction.mockClear()
    const action = within(canvasElement).getByRole('button', { name: 'Adding device' })
    await userEvent.click(action)
    await expect(action).toBeDisabled()
    await expect(onAction).not.toHaveBeenCalled()
  },
}

export const Narrow: Story = {
  ...NoResults,
  decorators: [(Story) => <div style={{ maxWidth: 260 }}><Story /></div>],
}

export const Dark: Story = {
  ...Error,
  decorators: [(Story) => <div data-theme="dark" style={{ background: 'var(--hub-ui-card)', padding: 24 }}><Story /></div>],
}

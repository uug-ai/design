import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import Notice from './component'
import HtmlExample from '../html/HtmlExample'
import { nativeComponentSource } from '../../config/storybookSource'
import exampleHtml from './example.html?raw'
import componentCss from './component.css?raw'

const onDismiss = fn()
const meta = {
  title: 'Components/Notice',
  component: Notice,
  tags: ['autodocs'],
  args: {
    title: 'Recording retention',
    children: 'Recordings are retained according to the current subscription.',
    tone: 'info',
  },
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
    announce: { control: 'select', options: ['off', 'polite', 'assertive'] },
    onDismiss: {
      control: false,
      description: 'Optional callback. Provide dismissLabel too. The caller removes the notice and restores focus.',
      table: { type: { summary: '() => void' } },
    },
    dismissLabel: {
      control: 'text',
      description: 'Localized accessible button name, required when onDismiss is provided.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    hubVisuals: true,
    a11y: { test: 'todo' },
    docs: {
      description: {
        component: 'Hub InfoBox visual extraction: original shadow and 4px corners, 12px/24px wrapper padding, original 18px glyph, inline 15px/24px text and 5% semantic tints; only warning has a border and an 18% tint. Hub error maps to danger. Native dismissal, focus handling and explicit links improve semantics without making the whole message clickable. Existing info/success and dark-tone text contrast limitations are retained and reported (a11y todo), not silently replaced with a different palette. Static by default; opt into live announcements only when appropriate.',
      },
    },
  },
} satisfies Meta<typeof Notice>

export default meta
type Story = StoryObj<typeof meta>

export const HTMLAndCSS: Story = {
  render: () => <HtmlExample html={exampleHtml} />,
  parameters: nativeComponentSource(exampleHtml, componentCss, true),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dismiss = canvas.getByRole('button', { name: 'Dismiss retention notice' })
    dismiss.focus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.queryByText('Recording retention')).not.toBeVisible()
    const restore = canvas.getByRole('button', { name: 'Restore notice' })
    await expect(restore).toHaveFocus()
    await userEvent.click(restore)
    await expect(canvas.getByText('Recording retention')).toBeVisible()
    await expect(dismiss).toHaveFocus()
  },
}

export const Playground: Story = {}

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Notice title="Configuration guidance" tone="info">Changes apply after the device reconnects.</Notice>
      <Notice title="Settings saved" tone="success">The new configuration is ready.</Notice>
      <Notice title="Approaching storage limit" tone="warning">Review retention before uploading more recordings.</Notice>
      <Notice title="Export failed" tone="danger">No export was created. Try again.</Notice>
    </div>
  ),
}

export const ErrorAnnouncement: Story = {
  args: { title: 'Export failed', children: 'No export was created. Try again.', tone: 'danger', announce: 'assertive' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert', { name: 'Export failed' })).toBeVisible()
  },
}

export const WithLink: Story = {
  args: { children: <>Review the <a href="/components">component guidelines</a> before proceeding.</> },
}

export const Dismissible: Story = {
  args: { onDismiss, dismissLabel: 'Dismiss retention notice' },
  render: function Dismissible(args) {
    const [visible, setVisible] = useState(true)
    const restoreRef = useRef<HTMLButtonElement>(null)
    useEffect(() => {
      if (!visible) restoreRef.current?.focus()
    }, [visible])
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        {visible && <Notice {...args} onDismiss={() => { setVisible(false); args.onDismiss?.() }} dismissLabel="Dismiss retention notice" />}
        <button ref={restoreRef} type="button" disabled={visible} onClick={() => setVisible(true)}>Restore notice</button>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    onDismiss.mockClear()
    const canvas = within(canvasElement)
    const dismiss = canvas.getByRole('button', { name: 'Dismiss retention notice' })
    dismiss.focus()
    await userEvent.keyboard('{Enter}')
    await expect(onDismiss).toHaveBeenCalledOnce()
    await expect(canvas.queryByText('Recording retention')).toBeNull()
    const restore = canvas.getByRole('button', { name: 'Restore notice' })
    await expect(restore).toHaveFocus()
    await userEvent.click(restore)
    await expect(canvas.getByText('Recording retention')).toBeVisible()
  },
}

export const Narrow: Story = {
  args: { title: 'The requested recording could not be processed', tone: 'warning' },
  decorators: [(Story) => <div style={{ maxWidth: 240 }}><Story /></div>],
}

export const Dark: Story = {
  ...AllTones,
  decorators: [(Story) => <div data-theme="dark" style={{ background: 'var(--hub-ui-card)', padding: 24 }}><Story /></div>],
}

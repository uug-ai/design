import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { List, ViewGrid } from 'iconoir-react'
import SegmentedControl from './component'
import HtmlExample from '../html/HtmlExample'
import { nativeComponentSource } from '../../config/storybookSource'
import exampleHtml from './example.html?raw'
import componentCss from './component.css?raw'

const onChange = fn()
const meta = {
  title: 'Components/Segmented Control',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: {
    label: 'Device layout',
    value: 'list',
    options: [
      { value: 'list', label: 'List', icon: <List width={18} height={18} /> },
      { value: 'grid', label: 'Grid', icon: <ViewGrid width={18} height={18} /> },
    ],
    onChange,
  },
  render: function Controlled(args) {
    const [value, setValue] = useState(args.value)
    useEffect(() => setValue(args.value), [args.value])
    return <SegmentedControl {...args} value={value} onChange={(next) => { setValue(next); args.onChange(next) }} />
  },
  parameters: {
    hubVisuals: true,
    a11y: { test: 'error' },
    docs: {
      description: {
        component: 'Framework-neutral HTML/CSS for a named group of native buttons using aria-pressed. Start with HTML And CSS: the optional dependency-free helper maintains selection and emits ui:change with detail.value. The same native recipe is exported under ui/segmented-control/. Other stories use the optional React adapter. Tab visits enabled buttons; Enter/Space activates. This is not a tablist or radiogroup. Use unique values, localized labels and native disabled. Origin: Hub MultiToggle for devices and wall quality; its Angular index/string callback contract remains unchanged.',
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const HTMLAndCSS: Story = {
  render: () => <HtmlExample html={exampleHtml} />,
  parameters: nativeComponentSource(exampleHtml, componentCss, true),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Device layout' })
    const changes: string[] = []
    group.addEventListener('ui:change', (event) => {
      if (event instanceof CustomEvent) changes.push(event.detail.value)
    })
    const grid = canvas.getByRole('button', { name: 'Grid' })
    grid.focus()
    await userEvent.keyboard(' ')
    await expect(grid).toHaveAttribute('aria-pressed', 'true')
    await expect(changes).toEqual(['grid'])
    grid.setAttribute('disabled', '')
    canvas.getByRole('button', { name: 'List' }).focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.click(grid)
    await expect(changes).toEqual(['grid', 'list'])
  },
}

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    onChange.mockClear()
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('button', { name: 'Grid' })
    grid.focus()
    await userEvent.keyboard(' ')
    await expect(grid).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'false')
    await expect(onChange).toHaveBeenCalledWith('grid')
    canvas.getByRole('button', { name: 'List' }).focus()
    await userEvent.keyboard('{Enter}')
    await expect(onChange).toHaveBeenLastCalledWith('list')
  },
}

export const IconOnly: Story = { args: { iconOnly: true } }

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    onChange.mockClear()
    const grid = within(canvasElement).getByRole('button', { name: 'Grid' })
    await userEvent.click(grid)
    await expect(grid).toBeDisabled()
    await expect(onChange).not.toHaveBeenCalled()
  },
}

export const DisabledOption: Story = {
  args: { options: [{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid', disabled: true }] },
}

export const TextFallback: Story = {
  args: { iconOnly: true, options: [{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('List')).toBeVisible()
  },
}

export const Narrow: Story = {
  args: { options: [{ value: 'list', label: 'Detailed device list' }, { value: 'grid', label: 'Device thumbnail grid' }] },
  decorators: [(Story) => <div style={{ maxWidth: 240 }}><Story /></div>],
}

export const Dark: Story = {
  decorators: [(Story) => <div data-theme="dark" style={{ background: 'var(--hub-ui-card)', padding: 24 }}><Story /></div>],
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import SearchField from './component'
import HtmlExample from '../html/HtmlExample'
import { nativeComponentSource } from '../../config/storybookSource'
import exampleHtml from './example.html?raw'
import clearableHtml from './clearable.html?raw'
import componentCss from './component.css?raw'

const onChange = fn()
const meta = {
  title: 'Components/Search Field',
  component: SearchField,
  tags: ['autodocs'],
  args: {
    label: 'Search devices',
    value: '',
    placeholder: 'Name or location',
    clearLabel: 'Clear device search',
    onChange,
  },
  render: function Controlled(args) {
    const [value, setValue] = useState(args.value)
    useEffect(() => setValue(args.value), [args.value])
    return <SearchField {...args} value={value} onChange={(next) => { setValue(next); args.onChange(next) }} />
  },
  parameters: {
    hubVisuals: true,
    a11y: { test: 'error' },
    docs: {
      description: {
        component: 'Hub SearchField visual extraction: transparent borderless control, 12px/24px padding, an 18px icon and 14px text on a 36px line. The accessible label is visually hidden to retain Hub toolbar density; focus indication is an explicit accessibility improvement. HTML And CSS matches the existing widget, which has no clear button. Clearable HTML and Clearable demonstrate an opt-in extension, not current Hub UI. Bind native input rather than only keyup; filtering, debounce and requests remain application-owned.',
      },
    },
  },
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const HTMLAndCSS: Story = {
  render: () => <HtmlExample html={exampleHtml} />,
  parameters: nativeComponentSource(exampleHtml, componentCss),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search devices' }), 'Entrance')
    await expect(canvas.getByRole('searchbox')).toHaveValue('Entrance')
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const ClearableHTML: Story = {
  render: () => <HtmlExample html={clearableHtml} />,
  parameters: nativeComponentSource(clearableHtml, componentCss, true),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search devices' })
    await expect(canvas.queryByRole('button', { name: 'Clear device search' })).toBeNull()
    await userEvent.type(input, 'Entrance')
    const clear = canvas.getByRole('button', { name: 'Clear device search' })
    await expect(clear).toBeVisible()
    const onInput = fn()
    input.addEventListener('input', onInput, { once: true })
    await userEvent.click(clear)
    await expect(input).toHaveValue('')
    await expect(input).toHaveFocus()
    await expect(onInput).toHaveBeenCalledOnce()
    await expect(canvas.queryByRole('button', { name: 'Clear device search' })).toBeNull()
  },
}

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    onChange.mockClear()
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search devices' })
    await userEvent.type(input, 'Entrance')
    await expect(input).toHaveValue('Entrance')
    await expect(onChange).toHaveBeenLastCalledWith('Entrance')
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const Clearable: Story = {
  args: { showClear: true },
  play: async ({ canvasElement }) => {
    onChange.mockClear()
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search devices' })
    await userEvent.type(input, 'Entrance')
    await userEvent.click(canvas.getByRole('button', { name: 'Clear device search' }))
    await expect(input).toHaveValue('')
    await expect(input).toHaveFocus()
    await expect(onChange).toHaveBeenLastCalledWith('')
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const Populated: Story = { args: { value: 'Entrance' } }

export const Disabled: Story = {
  args: { value: 'Entrance', disabled: true, showClear: true },
  play: async ({ canvasElement }) => {
    onChange.mockClear()
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('searchbox')).toBeDisabled()
    const clear = canvas.getByRole('button', { name: 'Clear device search' })
    await userEvent.click(clear)
    await expect(clear).toBeDisabled()
    await expect(onChange).not.toHaveBeenCalled()
  },
}

export const MultipleFields: Story = {
  render: function Multiple() {
    const [device, setDevice] = useState('')
    const [site, setSite] = useState('')
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <SearchField label="Search devices" value={device} onChange={setDevice} />
        <SearchField label="Search sites" value={site} onChange={setSite} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const devices = canvas.getByRole('searchbox', { name: 'Search devices' })
    const sites = canvas.getByRole('searchbox', { name: 'Search sites' })
    await expect(devices.id).not.toBe(sites.id)
    await userEvent.type(sites, 'Office')
    await expect(devices).toHaveValue('')
    await expect(sites).toHaveValue('Office')
  },
}

export const Narrow: Story = {
  args: { value: 'A long device name in a narrow toolbar' },
  decorators: [(Story) => <div style={{ maxWidth: 240 }}><Story /></div>],
}

export const Dark: Story = {
  decorators: [(Story) => <div data-theme="dark" style={{ background: 'var(--hub-ui-card)', padding: 24 }}><Story /></div>],
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { Plus, Star, Trash, Xmark } from 'iconoir-react'
import { HubBlockButton, HubButton, HubInlineButton } from '../controls'
import type { HubButtonVariant } from '../controls'

const meta = {
  title: 'Components/Buttons',
  component: HubButton,
  tags: ['autodocs'],
  args: { children: 'Add camera', variant: 'primary', disabled: false, loading: false, active: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'submit', 'neutral', 'success', 'alert', 'outlined', 'borderless', 'transparent', 'starred'] },
    children: { control: 'text' },
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: 'Extracted from Hub ButtonField and scss/app.scss. Production geometry: 36px height, 4px radius, 14px/600 Inter, and a 2px bottom border. Use the Hub theme toolbar to compare the production light and dark palettes.',
      },
    },
  },
} satisfies Meta<typeof HubButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const WithIcon: Story = { args: { icon: <Plus width={18} height={18} /> } }
export const Loading: Story = { args: { children: 'Saving settings', loading: true, disabled: true } }
export const Disabled: Story = { args: { disabled: true } }
export const Active: Story = { args: { active: true } }
export const MobileText: Story = { args: { icon: <Plus />, hideTextOnMobile: true } }
export const SuccessFeedback: Story = {
  render: function SaveStory() {
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    useEffect(() => {
      if (!saving) return
      const timer = window.setTimeout(() => { setSaving(false); setSuccess(true) }, 400)
      return () => window.clearTimeout(timer)
    }, [saving])
    return <HubButton loading={saving} disabled={saving} success={success} onClick={() => { setSuccess(false); setSaving(true) }}>Save settings</HubButton>
  },
}
export const InlineAndBlock: Story = {
  render: function SmallButtonsStory() {
    const [result, setResult] = useState('')
    return <div className="hub-stack"><div className="hub-row">
      <HubInlineButton label="Edit camera" icon={<Plus />} onClick={() => setResult('Edit selected')} />
      <HubBlockButton icon={<Star />} onClick={() => setResult('Star selected')}>Star</HubBlockButton>
      <HubBlockButton disabled icon={<Trash />}>Delete</HubBlockButton>
    </div><output role="status">{result}</output></div>
  },
}
export const Destructive: Story = { args: { variant: 'alert', children: 'Delete camera', icon: <Trash /> } }
export const IconOnly: Story = {
  args: { children: undefined, variant: 'borderless', icon: <Xmark />, 'aria-label': 'Close panel' },
}
export const Variants: Story = {
  render: () => {
    const variants: HubButtonVariant[] = ['primary', 'submit', 'neutral', 'success', 'alert', 'outlined', 'borderless', 'transparent', 'starred']
    return <div className="hub-stack">
      <div className="hub-row">
        {variants.map(variant => <HubButton key={variant} variant={variant}>{variant}</HubButton>)}
      </div>
      <div className="hub-row">
        <HubButton variant="starred" active icon={<Star />} aria-pressed>Starred</HubButton>
        <HubButton variant="outlined" disabled>Disabled outlined</HubButton>
        <HubButton loading disabled>Saving settings</HubButton>
      </div>
    </div>
  },
}

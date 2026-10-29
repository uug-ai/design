import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { HubCheckbox, HubInput, HubMultiToggle, HubSelect, HubTextarea, HubToggle } from '../controls'
import { AdditionalFieldsExample } from '../examples'
import { Plus, Star } from 'iconoir-react'

const meta = {
  title: 'Components/Forms',
  component: HubInput,
  tags: ['autodocs'],
  args: { label: 'Camera name', placeholder: 'Enter a camera name', disabled: false, readOnly: false },
  parameters: {
    docs: {
      description: {
        component: 'Hub InputField, SelectInput, RadioSelect (filter), CheckboxField, SliderField (switch), and MultiToggle presentations. Uses uppercase 12px labels, 50px fields, 24px horizontal padding and production error/focus treatments. Selects are searchable, switches and segmented controls are interactive. Native controls retain keyboard access; this is a visual extraction, not an Angular forms or service port.',
      },
    },
  },
} satisfies Meta<typeof HubInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Error: Story = { args: { defaultValue: '', error: 'Camera name is required.' } }
export const ReadOnly: Story = { args: { defaultValue: 'Entrance camera', readOnly: true } }
export const Disabled: Story = { args: { defaultValue: 'Entrance camera', disabled: true } }
export const Loading: Story = { args: { defaultValue: 'Entrance camera', loading: true } }
export const Search: Story = { render: () => <AdditionalFieldsExample view="search" /> }
export const ColorInputAndLabels: Story = { render: () => <AdditionalFieldsExample view="color" /> }
export const Tags: Story = { render: () => <AdditionalFieldsExample view="tags" /> }
export const DisabledAdditionalFields: Story = { render: () => <AdditionalFieldsExample disabled /> }
export const AdditionalFieldErrors: Story = { render: () => <AdditionalFieldsExample error="Check this value." /> }
export const IconSelectionControls: Story = {
  render: function IconControlsStory() {
    const [mode, setMode] = useState('starred')
    return <div className="hub-stack"><HubCheckbox icon={<Star />} defaultChecked>Starred cameras</HubCheckbox>
      <HubMultiToggle label="Camera actions" value={mode} onChange={setMode} hideText options={[
        { value: 'starred', text: 'Starred', icon: <Star /> }, { value: 'new', text: 'Add camera', icon: <Plus /> },
      ]} /></div>
  },
}
export const FilterSizes: Story = {
  render: function FilterSizesStory() {
    const [value, setValue] = useState('all')
    return <div className="hub-stack">{(['small', 'medium', 'large'] as const).map(size =>
      <HubSelect key={size} label={`${size} sites`} variant="filter" size={size} options={siteOptions} value={value}
        onChange={setValue} searchable={false} />)}</div>
  },
}
export const Textarea: Story = {
  render: () => <HubTextarea label="Description" placeholder="Describe this camera's location" />,
}

const siteOptions = [
  { value: 'all', text: 'All sites' },
  { value: 'ghent', text: 'Ghent - Bijlokehof' },
  { value: 'new-york', text: 'New York - Midtown' },
  { value: 'cape-town', text: 'Cape Town - Waterfront' },
]

export const Select: Story = {
  render: function SelectStory() {
    const [site, setSite] = useState('ghent')
    return <HubSelect label="Site" options={siteOptions} value={site} onChange={setSite} />
  },
}
export const FilterSelect: Story = {
  render: function FilterStory() {
    const [site, setSite] = useState('all')
    return <HubSelect label="Sites" variant="filter" options={siteOptions} value={site} onChange={setSite} />
  },
}
export const SelectionControls: Story = {
  render: function SelectionStory() {
    const [enabled, setEnabled] = useState(true)
    const [checked, setChecked] = useState(false)
    const [mode, setMode] = useState('recordings')
    return <div className="hub-stack">
      <div className="hub-row">
        <HubCheckbox checked={checked} onChange={event => setChecked(event.target.checked)}>Include offline cameras</HubCheckbox>
        <HubCheckbox defaultChecked disabled>Managed by organisation</HubCheckbox>
      </div>
      <div>
        <HubToggle label="Motion detection" description="Record when motion is detected."
          checked={enabled} onChange={event => setEnabled(event.target.checked)} />
        <HubToggle label="Notifications" description="Send alerts for matching recordings." defaultChecked />
        <HubToggle label="Disabled switch" checked disabled />
      </div>
      <HubMultiToggle label="Media view" value={mode} onChange={setMode} options={[
        { value: 'recordings', text: 'Recordings' }, { value: 'snapshots', text: 'Snapshots' }, { value: 'events', text: 'Events' },
      ]} />
    </div>
  },
}
export const FieldStates: Story = {
  render: () => <div className="hub-demo-grid">
    <HubInput label="Camera name" placeholder="Enter a camera name" />
    <HubInput label="Camera name" defaultValue="Entrance camera" />
    <HubInput label="Camera name" error="Camera name is required." />
    <HubInput label="Camera name" defaultValue="Entrance camera" readOnly />
    <HubInput label="Camera name" defaultValue="Entrance camera" disabled />
    <HubTextarea label="Description" defaultValue="Camera at the building entrance." />
  </div>,
}

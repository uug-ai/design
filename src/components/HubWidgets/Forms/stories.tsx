import { useEffect, useId, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { HubButton, HubCheckbox, HubInput, HubMultiToggle, HubSelect, HubTextarea, HubToggle } from '../controls'
import { HubErrorSummary, HubInfobox } from '../feedback'
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
export const Error: Story = {
  args: { defaultValue: '', error: 'Enter a camera name.' },
  parameters: {
    docs: {
      description: {
        story: 'A single invalid field: red border and label, with the message in the summary above (it is visually hidden under the field and announced to screen readers). Type a name to clear it. See **Multiple Field Errors** for the reasoning behind these choices.',
      },
    },
  },
  render: function ErrorStory({ defaultValue, error, ...args }) {
    const id = useId()
    const [value, setValue] = useState(String(defaultValue ?? ''))
    const message = value.trim() ? '' : error
    return <div className="hub-stack">
      <HubErrorSummary errors={message ? [{ message, field: id }] : []} />
      <HubInput {...args} id={id} value={value} onChange={event => setValue(event.target.value)} error={message} />
    </div>
  },
}
export const ReadOnly: Story = { args: { defaultValue: 'Entrance camera', readOnly: true } }
export const Disabled: Story = { args: { defaultValue: 'Entrance camera', disabled: true } }
export const Loading: Story = { args: { defaultValue: 'Entrance camera', loading: true } }
export const Search: Story = { render: () => <AdditionalFieldsExample view="search" /> }
export const ColorInputAndLabels: Story = { render: () => <AdditionalFieldsExample view="color" /> }
export const Tags: Story = { render: () => <AdditionalFieldsExample view="tags" /> }
export const DisabledAdditionalFields: Story = { render: () => <AdditionalFieldsExample disabled /> }
export const AdditionalFieldErrors: Story = { render: () => <AdditionalFieldsExample error="Check this value." /> }
export const MultipleFieldErrors: Story = {
  render: function MultipleFieldErrorsStory() {
    const [values, setValues] = useState({ name: '', url: 'http://192.168.1.20/stream', description: '' })
    const errors = {
      name: values.name.trim() ? '' : 'Enter a camera name.',
      url: /^rtsp:\/\//.test(values.url) ? '' : 'Use a stream URL that starts with rtsp://.',
      description: values.description.trim() ? '' : 'Describe where the camera is located.',
    }
    const [touched, setTouched] = useState<Partial<Record<keyof typeof values, boolean>>>({})
    const [submitted, setSubmitted] = useState(false)
    const [highlight, setHighlight] = useState(0)
    const shown = (key: keyof typeof values) => submitted || touched[key] ? errors[key] : ''
    const id = useId()
    const messages = (Object.keys(errors) as (keyof typeof values)[])
      .filter(key => shown(key)).map(key => ({ message: errors[key], field: `${id}-${key}` }))
    const invalid = Object.values(errors).some(Boolean)
    const field = (key: keyof typeof values) => ({
      id: `${id}-${key}`,
      value: values[key],
      onChange: (event: { target: { value: string } }) => setValues(current => ({ ...current, [key]: event.target.value })),
      onBlur: () => setTouched(current => ({ ...current, [key]: true })),
      error: shown(key),
    })
    return <form className="hub-stack" noValidate onSubmit={event => {
      event.preventDefault()
      setSubmitted(true)
      if (invalid) setHighlight(count => count + 1)
    }}>
      <HubErrorSummary errors={messages} highlight={highlight} />
      <HubInput label="Camera name" placeholder="Enter a camera name" {...field('name')} />
      <HubInput label="Stream URL" {...field('url')} />
      <HubTextarea label="Description" placeholder="Describe this camera's location" {...field('description')} />
      <div><HubButton type="submit">Save camera</HubButton></div>
    </form>
  },
  parameters: {
    docs: {
      description: {
        story: `
Fill in the fields, leave one empty and press **Save camera** to try it.

**Why it works this way**

- **No errors until the user has had a chance.** A field shows its error only after it is touched (focused, then left) or after the first Save. Flagging an empty form on load reads as blame before anyone has typed.
- **Fixes are confirmed immediately.** Once an error is showing, it clears as soon as the value becomes valid, so people see their fix worked without pressing Save again.
- **Fields stay calm: red border and label only.** The message under the field is visually hidden, but still announced by screen readers through \`aria-describedby\`. This keeps long forms compact. Known trade-off: on the field itself the error is signalled by colour only (WCAG 1.4.1), so the summary is what carries the text.
- **One summary above the form.** It lists every shown error, so there is always one place that explains what is wrong. It also appears for a single error, because the inline text is hidden.
- **Messages are instructions.** "Enter a camera name." tells people what to do, instead of "Camera name is required." which only states the rule.
- **Each message links to its field.** Clicking scrolls the field to the middle of the screen, so its label is visible, and focuses it ready for typing.
- **Save is never disabled.** A disabled button does not explain itself, cannot be reached with the keyboard, and gives no response when clicked. Save always works: it reveals all errors and, while any remain, replays a spinning border on the summary to draw the eye there.
- **Motion is optional.** With *reduce motion* enabled, the spin is replaced by a short fade of a solid border.
`,
      },
    },
  },
}
const TAKEN_CAMERA_NAMES = ['entrance', 'parking lot', 'loading dock']

/** Stands in for a Hub API call: answers after a delay whether the name is already used, or fails. */
function checkCameraNameOnServer(name: string, fail: boolean) {
  return new Promise<boolean>((resolve, reject) => window.setTimeout(() => fail
    ? reject(new globalThis.Error('Camera name check failed'))
    : resolve(TAKEN_CAMERA_NAMES.includes(name.trim().toLowerCase())), 800))
}

export const ServerValidation: StoryObj<{ serverFails: boolean }> = {
  args: { serverFails: false },
  argTypes: {
    serverFails: { control: 'boolean', description: 'Make the name check return an error instead of an answer.' },
  },
  render: function ServerValidationStory({ serverFails }) {
    const [values, setValues] = useState({ name: '', url: '' })
    const [attempt, setAttempt] = useState(0)
    const [nameCheck, setNameCheck] = useState<{ key: string; result: 'available' | 'taken' | 'failed' } | null>(null)
    const [touched, setTouched] = useState<Partial<Record<keyof typeof values, boolean>>>({})
    const [submitted, setSubmitted] = useState(false)
    const [saveQueued, setSaveQueued] = useState(false)
    const [saved, setSaved] = useState(false)
    const [highlight, setHighlight] = useState(0)
    const id = useId()

    const name = values.name.trim()
    const checkKey = `${name}|${attempt}|${serverFails}`
    const checking = name !== '' && nameCheck?.key !== checkKey
    const result = checking ? null : nameCheck?.result
    const errors = {
      name: !name ? 'Enter a camera name.'
        : result === 'taken' ? `A camera named "${name}" already exists. Enter a different name.`
        : result === 'failed' ? 'We couldn\'t check if this name is available. Press Save to try again.' : '',
      url: /^rtsp:\/\//.test(values.url) ? '' : 'Use a stream URL that starts with rtsp://.',
    }
    const invalid = Object.values(errors).some(Boolean)

    // Ask the server once typing pauses; a newer value or retry cancels the older request.
    useEffect(() => {
      if (!name) return
      let current = true
      const timer = window.setTimeout(() => {
        checkCameraNameOnServer(name, serverFails).then(
          taken => { if (current) setNameCheck({ key: checkKey, result: taken ? 'taken' : 'available' }) },
          () => { if (current) setNameCheck({ key: checkKey, result: 'failed' }) })
      }, 400)
      return () => { current = false; window.clearTimeout(timer) }
    }, [name, serverFails, checkKey])

    // A Save that retried a failed check completes once the server has answered.
    useEffect(() => {
      if (!saveQueued || checking) return
      setSaveQueued(false)
      if (invalid) setHighlight(count => count + 1)
      else setSaved(true)
    }, [saveQueued, checking, invalid])

    // A failed check is not the user's mistake, so it shows at once instead of waiting for touch or Save.
    const shown = (key: keyof typeof values) =>
      submitted || touched[key] || (key === 'name' && result === 'failed') ? errors[key] : ''
    const messages = (Object.keys(errors) as (keyof typeof values)[])
      .filter(key => shown(key)).map(key => ({ message: errors[key], field: `${id}-${key}` }))
    const field = (key: keyof typeof values) => ({
      id: `${id}-${key}`,
      value: values[key],
      onChange: (event: { target: { value: string } }) => {
        setSaved(false)
        setValues(current => ({ ...current, [key]: event.target.value }))
      },
      onBlur: () => setTouched(current => ({ ...current, [key]: true })),
      error: shown(key),
    })
    return <form className="hub-stack" noValidate onSubmit={event => {
      event.preventDefault()
      if (checking) return
      setSubmitted(true)
      if (result === 'failed') {
        setAttempt(count => count + 1)
        setSaveQueued(true)
      } else if (invalid) setHighlight(count => count + 1)
      else setSaved(true)
    }}>
      <HubErrorSummary errors={messages} highlight={highlight} />
      {saved && <HubInfobox tone="success">Camera saved.</HubInfobox>}
      <HubInput label="Camera name" placeholder="Enter a camera name" {...field('name')}
        loading={checking} loadingText="Checking if this camera name is available" />
      <HubInput label="Stream URL" placeholder="rtsp://" {...field('url')} />
      <div><HubButton type="submit" disabled={checking} loading={saveQueued}>Save camera</HubButton></div>
    </form>
  },
  parameters: {
    controls: { include: ['serverFails'] },
    docs: {
      description: {
        story: `
Try **Entrance**, **Parking lot** or **Loading dock**: those names already exist. Any other name is accepted after a short check. Turn on **serverFails** in the controls to see what happens when the check itself errors.

**Why it works this way**

- **The browser checks first, the server second.** An empty name is caught locally, so the server is only asked about names that could be valid.
- **The check starts when typing pauses.** It waits 400 ms after the last keystroke, so people see the result soon after they stop, without a request per letter. A newer value cancels the older request, so a slow answer about an old name can never overwrite the current one.
- **Same timing rules as client errors.** The answer is only shown once the field is touched or Save was pressed (see **Multiple Field Errors**), so the conflict appears when someone leaves the field, not mid-word.
- **The field shows that it is waiting.** A spinner sits in the field during the check, and screen readers hear "Checking if this camera name is available" instead of a silent pause.
- **The message names the conflict and the way out.** "A camera named "Entrance" already exists. Enter a different name." repeats the value, so people know the problem is not a typo on their side.
- **Save is disabled only while the check runs.** This is the one exception to "Save is never disabled" in **Multiple Field Errors**: the wait is under a second, the spinner in the field explains it, and it prevents saving a name the server has not confirmed yet. As soon as the answer arrives, Save is enabled again, also when the name is taken.
- **A failed check is an error, not a pass.** If the server cannot answer, the name is not assumed to be free: straight away, without waiting for the field to be touched (the user did nothing wrong, they just need to know), the field shows "We couldn't check if this name is available. Press Save to try again." Save then retries the check (with a spinner on the button) and saves only if it succeeds, so a flaky connection never lets a duplicate through, and recovering needs no extra button.
- **The server stays the final authority.** In Hub, the save request itself must still reject a duplicate (someone may take the name between the check and the save); show that rejection on the field in the same way.
`,
      },
    },
  },
}
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

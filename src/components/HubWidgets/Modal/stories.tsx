import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Download } from 'iconoir-react'
import { HubButton, HubInput, HubSelect, HubTextarea } from '../controls'
import { HubModal } from '../surfaces'
import { ModalPreviewExample } from '../examples'

type ModalStoryArgs = {
  title: string; confirmation: boolean; fullWidth?: boolean; centered?: boolean
  theaterMode?: boolean; draggable?: boolean; resizable?: boolean; parts?: number
}

const meta = {
  title: 'Components/Modal',
  tags: ['autodocs'],
  args: { title: 'Edit camera', confirmation: false, fullWidth: false, centered: false, theaterMode: false, draggable: false, resizable: false },
  argTypes: {
    title: { control: 'text' },
    confirmation: { control: 'boolean' },
  },
  parameters: {
    docs: {
      story: { inline: false, height: 600 },
      description: {
        component: 'Hub Modal, its header/body/actions and ShowConfirm presentations. Overlay variants start open in isolated preview frames, so their complete layout is visible without clicking a trigger or covering the documentation. Close a dialog to reveal its reopen button. The inline preview shows the complete layout without opening an overlay or trapping focus. Includes standard, full-width, centered, theater and dirty-close confirmation. On desktop, drag the header to move and use the right edge, bottom edge or corner to resize, matching Hub. The header and resize handles also support arrow keys. Drag/resize are disabled in mobile, full-width and theater presentations. Native dialog supplies focus containment, Escape handling and restoration. Double-click the corner to reset. Theater is a presentation surface, not a Hub media-player port.',
      },
    },
  },
} satisfies Meta<ModalStoryArgs>

export default meta
type Story = StoryObj<ModalStoryArgs>

export const InlinePreview: Story = {
  render: () => <ModalPreviewExample />,
  parameters: { controls: { disable: true } },
}

export const EditCamera: Story = {
  args: { title: 'Edit camera', confirmation: false },
  render: function EditCameraStory(args) {
    const [open, setOpen] = useState(true)
    const [saved, setSaved] = useState(false)
    return <>
      <HubButton onClick={() => { setOpen(true); setSaved(false) }}>Edit camera</HubButton>
      {saved && <p role="status">Camera settings saved in this demo.</p>}
      <HubModal {...args} open={open} onClose={() => setOpen(false)} actions={<>
        <HubButton variant="neutral" onClick={() => setOpen(false)}>Cancel</HubButton>
        <HubButton onClick={() => { setOpen(false); setSaved(true) }}>Save settings</HubButton>
      </>}>
        <div className="hub-stack">
          <HubInput label="Camera name" defaultValue="Entrance camera" />
          <HubTextarea label="Description" defaultValue="Camera at the building entrance." />
        </div>
      </HubModal>
    </>
  },
}
export const FullWidth: Story = { ...EditCamera, args: { title: 'Full-width dialog', confirmation: false, fullWidth: true } }
export const Centered: Story = { ...EditCamera, args: { title: 'Centered dialog', confirmation: false, centered: true } }
export const DraggableAndResizable: Story = { ...EditCamera, args: { title: 'Move and resize this dialog', confirmation: false, draggable: true, resizable: true } }
export const Theater: Story = {
  args: { title: 'Recording preview', confirmation: false, theaterMode: true },
  render: function TheaterStory(args) {
    const [open, setOpen] = useState(true)
    return <><HubButton onClick={() => setOpen(true)}>Open theater</HubButton>
      <HubModal {...args} open={open} onClose={() => setOpen(false)}>
        <div className="hub-theater-preview">Recording preview surface. Media playback remains in Hub.</div>
      </HubModal></>
  },
}
export const UnsavedChanges: Story = {
  args: { title: 'Edit camera', confirmation: false },
  render: function UnsavedStory(args) {
    const [open, setOpen] = useState(true)
    const [dirty, setDirty] = useState(false)
    return <><HubButton onClick={() => { setDirty(false); setOpen(true) }}>Edit with unsaved changes</HubButton>
      <HubModal {...args} open={open} onClose={() => setOpen(false)} confirmCloseWhenDirty isDirty={dirty}
        actions={requestClose => <><HubButton variant="neutral" onClick={requestClose}>Cancel</HubButton>
          <HubButton onClick={() => { setDirty(false); setOpen(false) }}>Save settings</HubButton></>}>
        <HubInput label="Camera name" defaultValue="Entrance camera" onChange={() => setDirty(true)} />
        <p>{dirty ? 'Unsaved changes' : 'Edit the name, then close or press Escape.'}</p>
      </HubModal></>
  },
}
export const SelectionInDialog: Story = {
  args: { title: 'Edit camera site', confirmation: false },
  render: function SelectionDialogStory(args) {
    const [open, setOpen] = useState(true)
    const [site, setSite] = useState('ghent')
    return <><HubButton onClick={() => setOpen(true)}>Edit camera site</HubButton>
      <HubModal {...args} open={open} onClose={() => setOpen(false)}>
        <HubSelect label="Site" value={site} onChange={setSite} options={[
          { value: 'ghent', text: 'Ghent' }, { value: 'new-york', text: 'New York' },
        ]} />
      </HubModal></>
  },
}
export const Confirmation: Story = {
  args: { title: 'Delete camera?', confirmation: true },
  render: function ConfirmationStory(args) {
    const [open, setOpen] = useState(true)
    const [deleted, setDeleted] = useState(false)
    return <>
      <HubButton variant="alert" onClick={() => { setOpen(true); setDeleted(false) }}>Delete camera</HubButton>
      {deleted && <p role="status">Camera deleted in this demo. No Hub data was changed.</p>}
      <HubModal open={open} confirmation={args.confirmation} title={args.title} onClose={() => setOpen(false)} actions={<>
        <HubButton variant="neutral" onClick={() => setOpen(false)}>Cancel</HubButton>
        <HubButton variant="alert" onClick={() => { setOpen(false); setDeleted(true) }}>Delete camera</HubButton>
      </>}>
        <p>This action removes the camera from this project. This is a presentation-only demo.</p>
      </HubModal>
    </>
  },
}
export const DownloadConfirmation: Story = {
  args: { title: 'Export audit events', confirmation: true, parts: 1 },
  argTypes: { parts: { control: { type: 'number', min: 1, max: 20, step: 1 } } },
  parameters: { docs: { description: { story: 'ShowConfirm for an action that is not destructive, as used before every audit export: a primary Download button with a download icon next to an outlined Cancel. Set parts above 1 for the text shown when the export is split into several files.' } } },
  render: function DownloadConfirmationStory(args) {
    const [open, setOpen] = useState(true)
    const [result, setResult] = useState('')
    const parts = Math.max(1, Math.round(args.parts ?? 1))
    const total = (parts > 1 ? parts * 100000 - 50000 : 42000).toLocaleString('en-US')
    const text = parts > 1
      ? `${total} events match these filters. They will download as ${parts} files of up to 100,000 events each. Continue?`
      : `${total} events match these filters. They will download as one CSV file. Continue?`
    return <>
      <HubButton variant="outlined" icon={<Download />} onClick={() => { setOpen(true); setResult('') }}>Export CSV</HubButton>
      {result && <p role="status">{result}</p>}
      <HubModal open={open} confirmation={args.confirmation} title={args.title} onClose={() => setOpen(false)} actions={<>
        <HubButton variant="outlined" onClick={() => setOpen(false)}>Cancel</HubButton>
        <HubButton variant="submit" icon={<Download />} onClick={() => {
          setOpen(false)
          setResult(`Download started in this demo (${parts === 1 ? 'one file' : `${parts} files`}). No Hub data was exported.`)
        }}>Download</HubButton>
      </>}>
        <p>{text}</p>
      </HubModal>
    </>
  },
}

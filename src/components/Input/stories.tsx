import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import InputShowcase from './component'

const inputsHtml = `
  <div class="demo-area">

    <!-- Email -->
    <div class="input-group">
      <label class="input-label" for="email">Email</label>
      <input class="input" type="email" id="email" placeholder="Enter your email" />
    </div>

    <!-- Password -->
    <div class="input-group">
      <label class="input-label" for="password">Password</label>
      <div class="input-wrapper">
        <input class="input input--has-icon" type="password" id="password" placeholder="Enter your password" />
        <button class="input-icon-btn" type="button" aria-label="Show password">
          <!-- eye icon toggle handled via JS -->
        </button>
      </div>
    </div>

    <!-- Copy field -->
    <div class="input-group">
      <label class="input-label" for="copy">Copy field</label>
      <div class="input-wrapper">
        <input class="input input--has-icon" type="text" id="copy" value="npm install @design/system" readonly />
        <button class="input-icon-btn" type="button" aria-label="Copy to clipboard">
          <!-- copy icon -->
        </button>
      </div>
    </div>

    <!-- Date -->
    <div class="input-group">
      <label class="input-label" for="date">Date</label>
      <input class="input input--date" type="date" id="date" />
    </div>

    <!-- Dropdown -->
    <div class="input-group">
      <label class="input-label" for="role">Role</label>
      <div class="select-wrapper">
        <select class="select" id="role">
          <option value="" disabled selected>Select a role…</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
    </div>

    <!-- Checkboxes -->
    <div class="input-group">
      <span class="input-label">Preferences</span>
      <label class="checkbox-label">
        <input class="checkbox" type="checkbox" />
        <span class="checkbox-text">Email notifications</span>
      </label>
      <label class="checkbox-label">
        <input class="checkbox" type="checkbox" checked />
        <span class="checkbox-text">Marketing emails</span>
      </label>
    </div>

  </div>
`

const passwordHtml = `
  <div class="demo-area">
    <div class="input-group">
      <label class="input-label" for="password">Password</label>
      <div class="input-wrapper">
        <input class="input input--has-icon" type="password" id="password" placeholder="Enter your password" />
        <button class="input-icon-btn" type="button" aria-label="Show password">
          Show
        </button>
      </div>
    </div>
  </div>
`

const copyHtml = `
  <div class="demo-area">
    <div class="input-group">
      <label class="input-label" for="copy">Copy field</label>
      <div class="input-wrapper">
        <input class="input input--has-icon" type="text" id="copy" value="npm install @design/system" readonly />
        <button class="input-icon-btn" type="button" aria-label="Copy to clipboard">
          Copy
        </button>
      </div>
    </div>
  </div>
`

const dateHtml = `
  <div class="demo-area">
    <div class="input-group">
      <label class="input-label" for="date">Date</label>
      <input class="input input--date" type="date" id="date" />
    </div>
  </div>
`

const dropdownHtml = `
  <div class="demo-area">
    <div class="input-group">
      <label class="input-label" for="role">Role</label>
      <div class="select-wrapper">
        <select class="select" id="role">
          <option value="" disabled selected>Select a role...</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
    </div>
  </div>
`

const checkboxHtml = `
  <div class="demo-area">
    <div class="input-group">
      <span class="input-label">Preferences</span>
      <label class="checkbox-label">
        <input class="checkbox" type="checkbox" />
        <span class="checkbox-text">Email notifications</span>
      </label>
      <label class="checkbox-label">
        <input class="checkbox" type="checkbox" checked />
        <span class="checkbox-text">Marketing emails</span>
      </label>
    </div>
  </div>
`

const meta = {
  title: 'Components/Inputs',
  component: InputShowcase,
  tags: ['autodocs'],
} satisfies Meta<typeof InputShowcase>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: htmlCssSource(inputsHtml, componentCss),
}

export const PasswordField: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [show, setShow] = useState(false)

    return (
      <div className="demo-area">
        <div className="input-group">
          <label htmlFor="storybook-password" className="input-label">Password</label>
          <div className="input-wrapper">
            <input
              id="storybook-password"
              className="input input--has-icon"
              type={show ? 'text' : 'password'}
              placeholder="Enter your password"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            <button
              className="input-icon-btn"
              type="button"
              onClick={() => setShow((previous) => !previous)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </div>
    )
  },
  parameters: htmlCssSource(passwordHtml, componentCss),
}

export const CopyField: Story = {
  render: () => {
    const [copied, setCopied] = useState(false)
    const value = 'npm install @design/system'

    return (
      <div className="demo-area">
        <div className="input-group">
          <label htmlFor="storybook-copy" className="input-label">Copy field</label>
          <div className="input-wrapper">
            <input id="storybook-copy" className="input input--has-icon" type="text" value={value} readOnly />
            <button
              className={`input-icon-btn${copied ? ' input-icon-btn--success' : ''}`}
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(value).catch(() => undefined)
                setCopied(true)
                window.setTimeout(() => setCopied(false), 1500)
              }}
              aria-label="Copy to clipboard"
            >
              {copied ? 'Done' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    )
  },
  parameters: htmlCssSource(copyHtml, componentCss),
}

export const DatePickerField: Story = {
  render: () => {
    const [date, setDate] = useState('')

    return (
      <div className="demo-area">
        <div className="input-group">
          <label htmlFor="storybook-date" className="input-label">Date</label>
          <input
            id="storybook-date"
            className="input input--date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>
    )
  },
  parameters: htmlCssSource(dateHtml, componentCss),
}

export const DropdownField: Story = {
  render: () => {
    const [role, setRole] = useState('')

    return (
      <div className="demo-area">
        <div className="input-group">
          <label htmlFor="storybook-role" className="input-label">Role</label>
          <div className="select-wrapper">
            <select
              id="storybook-role"
              className="select"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="" disabled>Select a role...</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
      </div>
    )
  },
  parameters: htmlCssSource(dropdownHtml, componentCss),
}

export const CheckboxField: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(false)
    const [marketing, setMarketing] = useState(true)

    return (
      <div className="demo-area">
        <div className="input-group">
          <span className="input-label">Preferences</span>
          <label className="checkbox-label">
            <input
              className="checkbox"
              type="checkbox"
              checked={notifications}
              onChange={(event) => setNotifications(event.target.checked)}
            />
            <span className="checkbox-text">Email notifications</span>
          </label>
          <label className="checkbox-label">
            <input
              className="checkbox"
              type="checkbox"
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
            />
            <span className="checkbox-text">Marketing emails</span>
          </label>
        </div>
      </div>
    )
  },
  parameters: htmlCssSource(checkboxHtml, componentCss),
}
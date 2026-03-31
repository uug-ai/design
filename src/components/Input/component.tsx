import { useState } from 'react'
import './component.css'

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function InputShowcase() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [date, setDate] = useState('')
  const [dropdown, setDropdown] = useState('')
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(true)
  const [copied, setCopied] = useState(false)
  const copyValue = 'npm install @design/system'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <div className="demo-area">
      <div className="input-group">
        <label htmlFor="storybook-email" className="input-label">Email</label>
        <input
          type="email"
          id="storybook-email"
          className="input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="storybook-password" className="input-label">Password</label>
        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="storybook-password"
            className="input input--has-icon"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="input-icon-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="storybook-copy" className="input-label">Copy field</label>
        <div className="input-wrapper">
          <input
            type="text"
            id="storybook-copy"
            className="input input--has-icon"
            value={copyValue}
            readOnly
          />
          <button
            type="button"
            className={`input-icon-btn${copied ? ' input-icon-btn--success' : ''}`}
            onClick={handleCopy}
            aria-label="Copy to clipboard"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="storybook-date" className="input-label">Date</label>
        <input
          type="date"
          id="storybook-date"
          className="input input--date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="storybook-dropdown" className="input-label">Role</label>
        <div className="select-wrapper">
          <select
            id="storybook-dropdown"
            className="select"
            value={dropdown}
            onChange={(e) => setDropdown(e.target.value)}
          >
            <option value="" disabled>Select a role…</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <span className="input-label">Preferences</span>
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={check1}
            onChange={(e) => setCheck1(e.target.checked)}
          />
          <span className="checkbox-text">Email notifications</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={check2}
            onChange={(e) => setCheck2(e.target.checked)}
          />
          <span className="checkbox-text">Marketing emails</span>
        </label>
      </div>
    </div>
  )
}

export default InputShowcase
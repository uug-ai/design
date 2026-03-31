import { useState } from 'react'
import './component.css'

function InputShowcase() {
  const [value, setValue] = useState('')

  return (
    <div className="demo-area">
      <div className="input-group">
        <label htmlFor="storybook-email" className="input-label">
          Email
        </label>
        <input
          type="email"
          id="storybook-email"
          className="input"
          placeholder="Enter your email"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </div>
  )
}

export default InputShowcase
import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import './Components.css'

function Components() {
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const buttonCode = `<button className="btn btn-primary">
  Primary Button
</button>

<button className="btn btn-secondary">
  Secondary Button
</button>

<button className="btn btn-primary" disabled>
  Disabled Button
</button>`

  const buttonCss = `.btn {
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`

  const inputCode = `<div className="input-group">
  <label htmlFor="email" className="input-label">
    Email
  </label>
  <input
    type="email"
    id="email"
    className="input"
    placeholder="Enter your email"
  />
</div>`

  const inputCss = `.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.input {
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}`

  const cardCode = `<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here with descriptive text.</p>
  <button className="btn btn-primary">Action</button>
</div>`

  const cardCss = `.card {
  padding: 32px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow);
}`

  return (
    <div className="page components-page">
      <h1>Components</h1>
      <p>
        Reusable UI components built with accessibility and consistency in mind.
        Each component includes live examples and copy-able code.
      </p>

      <section className="component-section">
        <h2>Buttons</h2>
        <p>
          Buttons are the primary way users take actions in the interface. Use primary
          buttons for main actions and secondary buttons for alternative actions.
        </p>

        <div className="component-demo">
          <h3>Preview</h3>
          <div className="demo-area">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button
              className="btn btn-primary"
              disabled={buttonDisabled}
              onClick={() => setButtonDisabled(!buttonDisabled)}
            >
              {buttonDisabled ? 'Disabled Button' : 'Click to Disable'}
            </button>
          </div>

          <h3>HTML Code</h3>
          <CodeBlock code={buttonCode} language="html" />

          <h3>CSS Code</h3>
          <CodeBlock code={buttonCss} language="css" />
        </div>
      </section>

      <section className="component-section">
        <h2>Inputs</h2>
        <p>
          Form inputs allow users to enter data. Always include a label for accessibility.
        </p>

        <div className="component-demo">
          <h3>Preview</h3>
          <div className="demo-area">
            <div className="input-group">
              <label htmlFor="demo-email" className="input-label">
                Email
              </label>
              <input
                type="email"
                id="demo-email"
                className="input"
                placeholder="Enter your email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>

          <h3>HTML Code</h3>
          <CodeBlock code={inputCode} language="html" />

          <h3>CSS Code</h3>
          <CodeBlock code={inputCss} language="css" />
        </div>
      </section>

      <section className="component-section">
        <h2>Cards</h2>
        <p>
          Cards are flexible containers for grouping related content and actions.
        </p>

        <div className="component-demo">
          <h3>Preview</h3>
          <div className="demo-area">
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Card Title</h3>
              <p>Card content goes here with descriptive text that explains the card's purpose.</p>
              <button className="btn btn-primary">Action</button>
            </div>
          </div>

          <h3>HTML Code</h3>
          <CodeBlock code={cardCode} language="html" />

          <h3>CSS Code</h3>
          <CodeBlock code={cardCss} language="css" />
        </div>
      </section>
    </div>
  )
}

export default Components

import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Loader from '../components/Loader'
import './Components.css'

function Components() {
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const componentLinks = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'cards', label: 'Cards' },
    { id: 'loader', label: 'Loader' },
  ]

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

  const loaderCode = `import Loader from '../components/Loader'

<Loader size="sm" tone="primary" />
<Loader size="md" tone="accent" />
<Loader size="lg" tone="secondary" />

<Loader inline label="Syncing records" tone="primary" />
<Loader inline label="Preparing dashboard" tone="accent" />
<Loader inverted tone="accent" />`

  const loaderCss = `.loader {
  --loader-size: 2.5rem;
  --loader-gradient-start: var(--primary-color);
  --loader-gradient-end: var(--secondary-color);
  --loader-track: rgba(39, 19, 255, 0.16);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.loader__spinner {
  width: var(--loader-size);
  height: var(--loader-size);
  background: var(--background);
  border-radius: 50%;
}

.loader__track-circle {
  stroke: var(--loader-track);
}

.loader__indicator-circle {
  stroke-dasharray: 28 72;
  animation: loader-spin 1.05s infinite;
}`

  return (
    <div className="page components-page">
      <h1>Components</h1>
      <div className="components-intro">
        <p>
          Reusable UI components built with accessibility and consistency in mind.
          Each component includes live examples and copy-able code.
        </p>

        <nav className="components-nav" aria-label="Component sections">
          <p className="components-nav-title">Browse components</p>
          <ul className="components-nav-list">
            {componentLinks.map((componentLink) => (
              <li key={componentLink.id}>
                <a className="components-nav-link" href={`#${componentLink.id}`}>
                  {componentLink.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <section id="buttons" className="component-section">
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

      <section id="inputs" className="component-section">
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

      <section id="cards" className="component-section">
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

      <section id="loader" className="component-section">
        <h2>Loader</h2>
        <p>
          Loaders communicate progress without blocking the interface. This library now
          uses a single circular spinner with a rotating gradient indicator so loading
          states stay visually consistent across the product.
        </p>

        <div className="component-demo">
          <h3>Preview</h3>
          <div className="demo-area loader-demo-area">
            <div className="loader-showcase">
              <span className="loader-showcase-label">Sizes</span>
              <div className="loader-row">
                <Loader size="sm" tone="primary" label="Loading small content" />
                <Loader size="md" tone="accent" label="Loading medium content" />
                <Loader size="lg" tone="secondary" label="Loading large content" />
              </div>
            </div>

            <div className="loader-showcase">
              <span className="loader-showcase-label">Inline</span>
              <div className="loader-column">
                <Loader inline size="sm" tone="primary" label="Syncing records" />
                <Loader inline size="sm" tone="secondary" label="Uploading assets" />
                <Loader inline size="sm" tone="accent" label="Preparing dashboard" />
              </div>
            </div>

            <div className="loader-showcase">
              <span className="loader-showcase-label">Colorful</span>
              <div className="loader-row">
                <Loader tone="neutral" label="Loading neutral state" />
                <Loader tone="primary" label="Loading primary state" />
                <Loader tone="accent" label="Loading accent state" />
              </div>
            </div>

            <div className="loader-showcase loader-showcase--dark">
              <span className="loader-showcase-label">Inverted</span>
              <div className="loader-row">
                <Loader inverted tone="accent" label="Loading dark surface" />
                <Loader inverted inline size="sm" tone="secondary" label="Publishing update" />
              </div>
            </div>
          </div>

          <h3>React Code</h3>
          <CodeBlock code={loaderCode} language="tsx" />

          <h3>CSS Code</h3>
          <CodeBlock code={loaderCss} language="css" />
        </div>
      </section>
    </div>
  )
}

export default Components

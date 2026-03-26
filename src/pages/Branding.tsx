import CodeBlock from '../components/CodeBlock'
import './Branding.css'

function Branding() {
  const brandValues = [
    {
      title: 'Bold Clarity',
      description: 'Lead with simple, high-contrast statements before introducing product detail.',
    },
    {
      title: 'Operational Scale',
      description: 'Use metrics, maps, and system views to show that the platform handles real-world complexity.',
    },
    {
      title: 'Focused Accents',
      description: 'Reserve the gradient for actions, highlights, and section dividers rather than full-page fill.',
    },
    {
      title: 'Human Confidence',
      description: 'Write with authority and keep the interface reassuring, crisp, and controlled.',
    },
  ]

  const logoUsage = `.brand-mark {
  font-family: var(--font-family-heading);
  font-size: 300px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.1em;
  text-align: center;
  color: var(--text-primary);
}`

  return (
    <div className="page branding-page">
      <h1>Branding</h1>
      <p>
        The reference direction is clear: editorial-scale headlines, white space, crisp
        neutral layouts, and a blue-to-magenta accent system. The design language should
        communicate scale and intelligence without becoming visually noisy.
      </p>

      <section className="branding-section">
        <h2>Logo</h2>
        <p>
          The wordmark should feel closer to a product headline than a decorative logo.
          Outfit gives it the right weight and geometry. The logo is simply UUG, with the
          typography carrying the identity instead of extra decoration.
        </p>
        <div className="logo-showcase">
          <div className="logo-display" aria-label="UUG logo">
            UUG
          </div>
        </div>

        <h3>Logo Usage Guidelines</h3>
        <ul className="guidelines-list">
          <li>Maintain minimum clear space of 16px around the logo</li>
          <li>Do not modify, rotate, or distort the logo</li>
          <li>Prefer the plain ink wordmark on light backgrounds</li>
          <li>Keep the letter spacing open and the form centered</li>
          <li>Ensure sufficient contrast with the background</li>
        </ul>

        <CodeBlock code={logoUsage} language="html" />
      </section>

      <section className="branding-section">
        <h2>Brand Colors</h2>
        <p>
          The design relies on a restrained palette. The gradient is the main signal of
          brand energy, while ink and white keep the interface precise.
        </p>
        <div className="brand-colors">
          <div className="brand-color-card">
            <div className="brand-color-preview" style={{ background: 'var(--brand-gradient)' }}></div>
            <div className="brand-color-name">Brand Gradient</div>
            <div className="brand-color-value">#2713FF -&gt; #FF0059</div>
          </div>
          <div className="brand-color-card">
            <div className="brand-color-preview" style={{ backgroundColor: '#0b0b12' }}></div>
            <div className="brand-color-name">Brand Ink</div>
            <div className="brand-color-value">#0b0b12</div>
          </div>
        </div>
      </section>

      <section className="branding-section">
        <h2>Brand Values</h2>
        <p>
          Our brand values guide our decisions and shape how we communicate with the world.
        </p>
        <div className="values-grid">
          {brandValues.map((value) => (
            <div key={value.title} className="value-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="branding-section">
        <h2>Voice & Tone</h2>
        <div className="voice-tone-grid">
          <div className="voice-card">
            <h3>Direct</h3>
            <p>Start with a clear claim, then support it with product proof.</p>
          </div>
          <div className="voice-card">
            <h3>Technical</h3>
            <p>Use precise language that reflects real operational capability, not hype.</p>
          </div>
          <div className="voice-card">
            <h3>Confident</h3>
            <p>Sound certain and informed, with concise sentences and strong hierarchy.</p>
          </div>
          <div className="voice-card">
            <h3>Measured</h3>
            <p>Avoid decorative marketing language when product evidence can do the work.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Branding

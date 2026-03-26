import CodeBlock from '../components/CodeBlock'
import './Spacing.css'

function Spacing() {
  const spacingScale = [
    { name: 'xs', value: '4px', usage: 'Tight spacing, icons' },
    { name: 'sm', value: '8px', usage: 'Small gaps, compact layouts' },
    { name: 'md', value: '16px', usage: 'Default spacing' },
    { name: 'lg', value: '24px', usage: 'Section spacing' },
    { name: 'xl', value: '32px', usage: 'Large gaps' },
    { name: '2xl', value: '48px', usage: 'Major sections' },
    { name: '3xl', value: '64px', usage: 'Hero sections' },
    { name: '4xl', value: '80px', usage: 'Extra large spacing' },
  ]

  const cssCode = `:root {
  /* Spacing Scale */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 80px;
}`

  const usageCode = `/* Using spacing variables */
.card {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.section {
  margin-top: var(--spacing-3xl);
  gap: var(--spacing-md);
}`

  return (
    <div className="page spacing-page">
      <h1>Spacing</h1>
      <p>
        A consistent spacing system creates visual rhythm and hierarchy. Our spacing
        scale uses multiples of 4px for mathematical precision and easy memorization.
      </p>

      <section className="spacing-section">
        <h2>Spacing Scale</h2>
        <p>
          The spacing scale provides a set of predefined values for margins, padding,
          and gaps throughout the interface.
        </p>
        <div className="spacing-examples">
          {spacingScale.map((space) => (
            <div key={space.name} className="spacing-example">
              <div className="spacing-visual">
                <div
                  className="spacing-box"
                  style={{ width: space.value, height: space.value }}
                />
              </div>
              <div className="spacing-info">
                <div className="spacing-name">{space.name}</div>
                <div className="spacing-value">{space.value}</div>
                <div className="spacing-usage">{space.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="spacing-section">
        <h2>Visual Examples</h2>
        <div className="visual-demo">
          <h3>Padding Example</h3>
          <div className="demo-container">
            <div className="demo-box" style={{ padding: '4px' }}>
              xs (4px)
            </div>
            <div className="demo-box" style={{ padding: '8px' }}>
              sm (8px)
            </div>
            <div className="demo-box" style={{ padding: '16px' }}>
              md (16px)
            </div>
            <div className="demo-box" style={{ padding: '24px' }}>
              lg (24px)
            </div>
            <div className="demo-box" style={{ padding: '32px' }}>
              xl (32px)
            </div>
          </div>

          <h3 style={{ marginTop: '32px' }}>Gap Example</h3>
          <div className="demo-container">
            <div className="demo-flex" style={{ gap: '4px' }}>
              <div className="demo-item">1</div>
              <div className="demo-item">2</div>
              <div className="demo-item">3</div>
              <span className="demo-label">xs (4px)</span>
            </div>
            <div className="demo-flex" style={{ gap: '16px' }}>
              <div className="demo-item">1</div>
              <div className="demo-item">2</div>
              <div className="demo-item">3</div>
              <span className="demo-label">md (16px)</span>
            </div>
            <div className="demo-flex" style={{ gap: '32px' }}>
              <div className="demo-item">1</div>
              <div className="demo-item">2</div>
              <div className="demo-item">3</div>
              <span className="demo-label">xl (32px)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="spacing-section">
        <h2>CSS Variables</h2>
        <CodeBlock code={cssCode} language="css" />
      </section>

      <section className="spacing-section">
        <h2>Usage Example</h2>
        <CodeBlock code={usageCode} language="css" />
      </section>
    </div>
  )
}

export default Spacing

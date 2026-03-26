import CodeBlock from '../components/CodeBlock'
import './Typography.css'

function Typography() {
  const fontSizes = [
    { name: 'Display', size: '4rem', lineHeight: '1.1', usage: 'Hero headings' },
    { name: 'Heading 1', size: '3rem', lineHeight: '1.2', usage: 'Page titles' },
    { name: 'Heading 2', size: '2rem', lineHeight: '1.3', usage: 'Section headings' },
    { name: 'Heading 3', size: '1.5rem', lineHeight: '1.4', usage: 'Subsection headings' },
    { name: 'Body Large', size: '1.125rem', lineHeight: '1.75', usage: 'Large body text' },
    { name: 'Body', size: '1rem', lineHeight: '1.6', usage: 'Default body text' },
    { name: 'Small', size: '0.875rem', lineHeight: '1.5', usage: 'Captions, labels' },
  ]

  const fontWeights = [
    { name: 'Regular', value: '400', usage: 'Body text' },
    { name: 'Medium', value: '500', usage: 'Emphasis' },
    { name: 'Semibold', value: '600', usage: 'Headings' },
    { name: 'Bold', value: '700', usage: 'Strong emphasis' },
  ]

  const cssCode = `/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
  'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
  'Helvetica Neue', sans-serif;

/* Font Sizes */
--font-size-display: 4rem;
--font-size-h1: 3rem;
--font-size-h2: 2rem;
--font-size-h3: 1.5rem;
--font-size-body-large: 1.125rem;
--font-size-body: 1rem;
--font-size-small: 0.875rem;`

  const usageCode = `.heading {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
}

.body-text {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
}`

  return (
    <div className="page typography-page">
      <h1>Typography</h1>
      <p>
        Typography is a fundamental element of our design system. We use a consistent
        type scale and font weights to create clear visual hierarchy and improve
        readability.
      </p>

      <section className="typography-section">
        <h2>Font Family</h2>
        <p>
          We use the system font stack for optimal performance and native appearance
          across different platforms.
        </p>
        <div className="font-specimen">
          <div className="specimen-text">
            ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
          </div>
        </div>
      </section>

      <section className="typography-section">
        <h2>Type Scale</h2>
        <p>Our type scale provides a harmonious range of font sizes for various use cases.</p>
        <div className="type-scale">
          {fontSizes.map((font) => (
            <div key={font.name} className="type-example">
              <div
                className="type-preview"
                style={{
                  fontSize: font.size,
                  lineHeight: font.lineHeight,
                }}
              >
                {font.name}
              </div>
              <div className="type-details">
                <span className="type-size">{font.size}</span>
                <span className="type-separator">•</span>
                <span className="type-line-height">Line height: {font.lineHeight}</span>
                <span className="type-separator">•</span>
                <span className="type-usage">{font.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="typography-section">
        <h2>Font Weights</h2>
        <p>Different font weights help establish visual hierarchy and emphasis.</p>
        <div className="weight-grid">
          {fontWeights.map((weight) => (
            <div key={weight.name} className="weight-example">
              <div
                className="weight-preview"
                style={{ fontWeight: weight.value }}
              >
                {weight.name}
              </div>
              <div className="weight-details">
                <span className="weight-value">{weight.value}</span>
                <span className="weight-usage">{weight.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="typography-section">
        <h2>CSS Variables</h2>
        <CodeBlock code={cssCode} language="css" />
      </section>

      <section className="typography-section">
        <h2>Usage Example</h2>
        <CodeBlock code={usageCode} language="css" />
      </section>
    </div>
  )
}

export default Typography

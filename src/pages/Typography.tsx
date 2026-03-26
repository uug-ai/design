import CodeBlock from '../components/CodeBlock'
import './Typography.css'

function Typography() {
  const fontSizes = [
    { name: 'Display', size: '4.5rem', lineHeight: '0.96', usage: 'Hero headlines and statement banners' },
    { name: 'Heading 1', size: '3.5rem', lineHeight: '1.02', usage: 'Page titles' },
    { name: 'Heading 2', size: '2.5rem', lineHeight: '1.08', usage: 'Section headings' },
    { name: 'Heading 3', size: '1.75rem', lineHeight: '1.15', usage: 'Card and module headings' },
    { name: 'Body Large', size: '1.125rem', lineHeight: '1.8', usage: 'Intro paragraphs and supporting copy' },
    { name: 'Body', size: '1rem', lineHeight: '1.7', usage: 'Default body text' },
    { name: 'Small', size: '0.875rem', lineHeight: '1.5', usage: 'Labels, metadata, helper text' },
  ]

  const fontFamilies = [
    {
      name: 'Outfit',
      role: 'Titles',
      sample: 'AUGMENT VISION',
      description: 'Use for display headlines, section titles, and high-impact numeric callouts.',
      className: 'heading-family',
    },
    {
      name: 'Inter',
      role: 'Body',
      sample: 'Scaling the future of vision AI',
      description: 'Use for paragraphs, navigation, interface copy, and dense product information.',
      className: 'body-family',
    },
  ]

  const fontWeights = [
    { name: 'Regular', value: '400', usage: 'Body text' },
    { name: 'Medium', value: '500', usage: 'Emphasis' },
    { name: 'Semibold', value: '600', usage: 'Navigation and labels' },
    { name: 'Bold', value: '700', usage: 'Headings and key statistics' },
  ]

  const cssCode = `:root {
  --font-family-heading: 'Outfit', sans-serif;
  --font-family-body: 'Inter', sans-serif;
}

/* Font Sizes */
--font-size-display: 4rem;
--font-size-h1: 3rem;
--font-size-h2: 2rem;
--font-size-h3: 1.5rem;
--font-size-body-large: 1.125rem;
--font-size-body: 1rem;
--font-size-small: 0.875rem;`

  const usageCode = `.hero-title {
  font-family: var(--font-family-heading);
  font-size: 4.5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 0.96;
}

.body-text {
  font-family: var(--font-family-body);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
}`

  return (
    <div className="page typography-page">
      <h1>Typography</h1>
      <p>
        The mockup establishes a clear type pairing: Outfit carries the brand voice in
        bold, compressed headlines while Inter handles the interface and supporting copy.
        The system should preserve that contrast instead of treating all text equally.
      </p>

      <section className="typography-section">
        <h2>Font Family</h2>
        <p>
          Titles and body copy now have distinct roles. Headlines should feel decisive
          and geometric, while long-form reading stays neutral and efficient.
        </p>
        <div className="font-specimen">
          {fontFamilies.map((family) => (
            <div key={family.name} className="font-family-card">
              <div className="font-family-meta">{family.role}</div>
              <div className={`specimen-text ${family.className}`}>{family.sample}</div>
              <p>{family.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="typography-section">
        <h2>Type Scale</h2>
        <p>
          Sizes are tuned for strong hierarchy. Display and heading styles use tighter
          tracking and line heights so large statements still feel controlled.
        </p>
        <div className="type-scale">
          {fontSizes.map((font) => (
            <div key={font.name} className="type-example">
              <div
                className="type-preview"
                style={{
                  fontSize: font.size,
                  lineHeight: font.lineHeight,
                  fontFamily:
                    font.name.includes('Body') || font.name === 'Small'
                      ? 'var(--font-family-body)'
                      : 'var(--font-family-heading)',
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
        <p>
          Weight should be used structurally. The reference design leans on heavy
          headlines and numbers, then steps back to regular and medium for everything else.
        </p>
        <div className="weight-grid">
          {fontWeights.map((weight) => (
            <div key={weight.name} className="weight-example">
              <div className="weight-preview" style={{ fontWeight: weight.value }}>
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

import ColorSwatch from '../components/ColorSwatch'
import CodeBlock from '../components/CodeBlock'
import './Colors.css'

function Colors() {
  const primaryColors = [
    { name: 'Primary Blue', value: '#2713ff', variable: '--primary-color' },
    { name: 'Primary Blue Dark', value: '#1807c7', variable: '--primary-dark' },
    { name: 'Signal Magenta', value: '#ff0059', variable: '--secondary-color' },
    {
      name: 'Brand Gradient',
      value: 'linear-gradient(90deg, #2713ff 0%, #ff0059 100%)',
      variable: '--brand-gradient',
    },
  ]

  const neutralColors = [
    { name: 'Ink', value: '#0b0b12', variable: '--text-primary' },
    { name: 'Slate Copy', value: '#626676', variable: '--text-secondary' },
    { name: 'Background', value: '#ffffff', variable: '--background' },
    { name: 'Soft Surface', value: '#f7f5fb', variable: '--surface' },
    { name: 'Raised Surface', value: '#efeafb', variable: '--surface-strong' },
    { name: 'Border', value: '#e6e0f0', variable: '--border' },
  ]

  const cssCode = `:root {
  /* Brand Colors */
  --primary-color: #2713ff;
  --primary-dark: #1807c7;
  --secondary-color: #ff0059;
  --accent-color: #7426ff;
  --brand-gradient: linear-gradient(90deg, #2713ff 0%, #ff0059 100%);

  /* Neutral Colors */
  --text-primary: #0b0b12;
  --text-secondary: #626676;
  --background: #ffffff;
  --surface: #f7f5fb;
  --surface-strong: #efeafb;
  --border: #e6e0f0;
}`

  const usageCode = `.button-primary {
  background: var(--brand-gradient);
  color: var(--background);
  border: 0;
}

.section-kicker {
  color: var(--accent-color);
}

.metrics-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
}`

  return (
    <div className="page colors-page">
      <h1>Colors</h1>
      <p>
        The reference design points to a bright, high-contrast system: a clean white
        canvas, near-black typography, and a blue-to-magenta gradient reserved for
        emphasis, calls to action, and brand moments.
      </p>

      <section className="color-section">
        <h2>Primary Colors</h2>
        <p>
          The palette should stay focused. The mockup relies on two saturated endpoints
          and uses the full gradient sparingly so the interface keeps its editorial,
          product-led feel.
        </p>
        <div className="color-grid">
          {primaryColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              value={color.value}
              variable={color.variable}
            />
          ))}
        </div>
      </section>

      <section className="color-section">
        <h2>Neutral Colors</h2>
        <p>
          Neutrals do most of the work: crisp white layouts, soft lilac-tinted surfaces,
          and restrained borders that keep dense product information readable.
        </p>
        <div className="color-grid">
          {neutralColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              value={color.value}
              variable={color.variable}
            />
          ))}
        </div>
      </section>

      <section className="color-section">
        <h2>Usage</h2>
        <h3>CSS Variables</h3>
        <p>All colors are available as CSS custom properties:</p>
        <CodeBlock code={cssCode} language="css" />

        <h3>Example Usage</h3>
        <CodeBlock code={usageCode} language="css" />
      </section>
    </div>
  )
}

export default Colors

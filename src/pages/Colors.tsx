import ColorSwatch from '../components/ColorSwatch'
import CodeBlock from '../components/CodeBlock'
import './Colors.css'

function Colors() {
  const primaryColors = [
    { name: 'Primary Blue', value: '#2563eb', variable: '--primary-color' },
    { name: 'Primary Dark', value: '#1e40af', variable: '--primary-dark' },
    { name: 'Secondary Purple', value: '#8b5cf6', variable: '--secondary-color' },
    { name: 'Accent Green', value: '#10b981', variable: '--accent-color' },
  ]

  const neutralColors = [
    { name: 'Text Primary', value: '#1f2937', variable: '--text-primary' },
    { name: 'Text Secondary', value: '#6b7280', variable: '--text-secondary' },
    { name: 'Background', value: '#ffffff', variable: '--background' },
    { name: 'Surface', value: '#f9fafb', variable: '--surface' },
    { name: 'Border', value: '#e5e7eb', variable: '--border' },
  ]

  const cssCode = `:root {
  /* Primary Colors */
  --primary-color: #2563eb;
  --primary-dark: #1e40af;
  --secondary-color: #8b5cf6;
  --accent-color: #10b981;

  /* Neutral Colors */
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --background: #ffffff;
  --surface: #f9fafb;
  --border: #e5e7eb;
}`

  const usageCode = `/* Using CSS Variables */
.button {
  background-color: var(--primary-color);
  color: var(--background);
}

.button:hover {
  background-color: var(--primary-dark);
}`

  return (
    <div className="page colors-page">
      <h1>Colors</h1>
      <p>
        Our color palette is designed to be accessible, modern, and reflective of the
        UUG.AI brand. Each color has been carefully selected to ensure proper contrast
        ratios and visual harmony.
      </p>

      <section className="color-section">
        <h2>Primary Colors</h2>
        <p>
          Primary colors are used for key actions, interactive elements, and brand
          expression throughout the interface.
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
          Neutral colors provide the foundation for text, backgrounds, and UI structure.
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

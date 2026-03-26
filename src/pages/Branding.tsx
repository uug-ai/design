import CodeBlock from '../components/CodeBlock'
import './Branding.css'

function Branding() {
  const brandValues = [
    {
      title: 'Innovation',
      description: 'We push boundaries and embrace cutting-edge technology to solve complex problems.',
    },
    {
      title: 'Clarity',
      description: 'We communicate clearly and design intuitive experiences that users understand immediately.',
    },
    {
      title: 'Reliability',
      description: 'We build robust, dependable systems that our users can trust.',
    },
    {
      title: 'Excellence',
      description: 'We maintain the highest standards in everything we create.',
    },
  ]

  const logoUsage = `<!-- Logo in HTML -->
<img src="/logo.svg" alt="UUG.AI Logo" />

<!-- With proper spacing -->
<img src="/logo.svg" alt="UUG.AI Logo"
     style="margin: 16px;" />`

  return (
    <div className="page branding-page">
      <h1>Branding</h1>
      <p>
        The UUG.AI brand represents innovation, intelligence, and reliability. Our visual
        identity reflects these values through thoughtful design choices and consistent
        application.
      </p>

      <section className="branding-section">
        <h2>Logo</h2>
        <p>
          The UUG.AI logo is the cornerstone of our brand identity. It should be used
          consistently across all touchpoints.
        </p>
        <div className="logo-showcase">
          <div className="logo-display">
            <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" width="200" height="60">
              <text x="10" y="40" fontFamily="Arial, sans-serif" fontSize="36"
                    fontWeight="bold" fill="#2563eb">
                UUG.AI
              </text>
            </svg>
          </div>
        </div>

        <h3>Logo Usage Guidelines</h3>
        <ul className="guidelines-list">
          <li>Maintain minimum clear space of 16px around the logo</li>
          <li>Do not modify, rotate, or distort the logo</li>
          <li>Use approved color variations only</li>
          <li>Ensure sufficient contrast with the background</li>
        </ul>

        <CodeBlock code={logoUsage} language="html" />
      </section>

      <section className="branding-section">
        <h2>Brand Colors</h2>
        <p>Our primary brand color is Blue (#2563eb), representing trust and intelligence.</p>
        <div className="brand-colors">
          <div className="brand-color-card">
            <div className="brand-color-preview" style={{ backgroundColor: '#2563eb' }}></div>
            <div className="brand-color-name">Brand Blue</div>
            <div className="brand-color-value">#2563eb</div>
          </div>
          <div className="brand-color-card">
            <div className="brand-color-preview" style={{ backgroundColor: '#8b5cf6' }}></div>
            <div className="brand-color-name">Brand Purple</div>
            <div className="brand-color-value">#8b5cf6</div>
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
            <h3>Professional</h3>
            <p>We maintain a professional demeanor while remaining approachable.</p>
          </div>
          <div className="voice-card">
            <h3>Clear</h3>
            <p>We communicate directly and avoid jargon when possible.</p>
          </div>
          <div className="voice-card">
            <h3>Confident</h3>
            <p>We speak with authority on our domain expertise.</p>
          </div>
          <div className="voice-card">
            <h3>Human</h3>
            <p>We write like humans, not robots, with warmth and personality.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Branding

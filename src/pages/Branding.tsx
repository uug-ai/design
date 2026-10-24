import { useEffect, useRef, useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Favicon from '../components/Favicon'
import '../components/Button/component.css'
import './Branding.css'

function BrandStudio({ kind, title }: { kind: 'banner' | 'logo'; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let observer: ResizeObserver | undefined
    const connect = () => {
      observer?.disconnect()
      const content = frame.contentDocument?.querySelector<HTMLElement>('.studio')
      if (!content) {
        setError('The editor could not be loaded. Reload the Branding page to try again.')
        return
      }
      setError('')
      const resize = () => {
        const borderHeight = frame.offsetHeight - frame.clientHeight
        frame.style.height = `${Math.ceil(content.getBoundingClientRect().height) + borderHeight}px`
      }
      observer = new ResizeObserver(resize)
      observer.observe(content)
      resize()
    }
    frame.addEventListener('load', connect)
    if (frame.contentDocument?.readyState === 'complete' &&
        frame.contentDocument.URL !== 'about:blank') connect()
    return () => {
      frame.removeEventListener('load', connect)
      observer?.disconnect()
    }
  }, [])

  return (
    <article className="brand-toolkit-editor">
      {error && <p role="status">{error}</p>}
      <iframe
        ref={frameRef}
        className="brand-toolkit-frame"
        src={`/brand/${kind}.html?embed=1`}
        title={title}
        loading="lazy"
      />
    </article>
  )
}

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

  const faviconUsage = `<Favicon size={32} tone="surface" label="UUG favicon" />`

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
        <BrandStudio kind="logo" title="UUG Logo Studio" />
        <BrandStudio kind="banner" title="Social Banner Studio" />

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
        <h2>Favicon</h2>
        <p>
          The favicon uses the entire white UUG wordmark on the midnight background.
          Keep this same artwork on light and dark surfaces, with a quiet outer tile
          for documentation and presentations.
        </p>
        <div className="favicon-showcase" aria-label="UUG favicon examples">
          <div className="favicon-card">
            <span className="favicon-card-label">Primary tile</span>
            <Favicon size={32} label="UUG favicon on a light tile" />
          </div>
          <div className="favicon-card favicon-card--contrast">
            <span className="favicon-card-label">Contrast tile</span>
            <Favicon size={64} tone="contrast" label="UUG favicon on a dark tile" />
          </div>
        </div>

        <div className="favicon-downloads">
          <a
            className="btn btn-primary"
            href={`${import.meta.env.BASE_URL}brand/uug-favicon-set.zip?v=uug-midnight`}
            download="uug-favicon-set.zip"
          >
            Download full favicon set (.zip)
          </a>
          <a
            className="btn btn-secondary"
            href={`${import.meta.env.BASE_URL}favicon.ico?v=uug-midnight`}
            download="uug-favicon.ico"
          >
            Download favicon (.ico)
          </a>
          <a
            className="btn btn-secondary"
            href={`${import.meta.env.BASE_URL}favicon-32x32.png?v=uug-midnight`}
            download="uug-favicon-32x32.png"
          >
            Download PNG (32 x 32)
          </a>
        </div>
        <p>
          The ZIP includes all browser, Apple and Android icons, a web manifest,
          and copy-paste HTML with setup instructions.
        </p>

        <h3>Favicon Usage</h3>
        <ul className="guidelines-list">
          <li>Use the native 16px and 32px assets for browser tabs</li>
          <li>Use the higher-resolution artwork for documentation and larger previews</li>
          <li>Keep the favicon centered inside a padded square tile</li>
          <li>Pair the icon with neutral or ink surfaces instead of decorative treatments</li>
          <li>Scale up the tile for presentations rather than stretching the image itself</li>
        </ul>

        <CodeBlock code={faviconUsage} language="tsx" />
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

import { useEffect, useRef, useState } from 'react'
import '../components/Button/component.css'
import '../components/Card/component.css'
import '../components/Input/component.css'
import Loader from '../components/Loader'
import { storybookEntryUrl, storybookUrl } from '../config/storybook'
import './Components.css'

const COMPONENT_LINKS = [
  { id: 'buttons', label: 'Buttons', storybookPath: '/docs/components-buttons--docs' },
  { id: 'inputs', label: 'Inputs', storybookPath: '/docs/components-inputs--docs' },
  { id: 'cards', label: 'Cards', storybookPath: '/docs/components-cards--docs' },
  { id: 'loader', label: 'Loader', storybookPath: '/docs/components-loader--docs' },
] as const

type ComponentSectionId = (typeof COMPONENT_LINKS)[number]['id']
type ComponentSectionPosition = { id: ComponentSectionId; top: number }

const COMPONENT_STORYBOOK_LINKS = Object.fromEntries(
  COMPONENT_LINKS.map((componentLink) => [
    componentLink.id,
    storybookEntryUrl(componentLink.storybookPath),
  ])
) as Record<string, string>

function Components() {
  const pageTopRef = useRef<HTMLDivElement | null>(null)
  const navStickyRef = useRef<HTMLDivElement | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [inputDate, setInputDate] = useState('')
  const [inputDropdown, setInputDropdown] = useState('')
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(true)
  const [copied, setCopied] = useState(false)
  const copyValue = 'npm install @design/system'
  const [activeComponent, setActiveComponent] = useState<string | null>(null)
  const [isNavSticky, setIsNavSticky] = useState(false)

  const getHeaderOffset = () => {
    const header = document.querySelector('.header')

    if (!(header instanceof HTMLElement)) {
      return window.innerWidth <= 640 ? 76 : 72
    }

    return header.getBoundingClientRect().height
  }

  const getStickyOffset = () => {
    const headerOffset = getHeaderOffset()
    const stickyHeight = navStickyRef.current?.getBoundingClientRect().height ?? 0

    return headerOffset + stickyHeight
  }

  useEffect(() => {
    const updateStickyState = () => {
      if (!navStickyRef.current) {
        return
      }

      const stickyOffset = getHeaderOffset()
      setIsNavSticky(navStickyRef.current.getBoundingClientRect().top <= stickyOffset)
    }

    updateStickyState()
    window.addEventListener('scroll', updateStickyState, { passive: true })
    window.addEventListener('resize', updateStickyState)

    return () => {
      window.removeEventListener('scroll', updateStickyState)
      window.removeEventListener('resize', updateStickyState)
    }
  }, [])

  useEffect(() => {
    const throttleMs = 80
    let timeoutId = 0
    let lastRunAt = 0

    const getStickyOffset = () => {
      const headerOffset = getHeaderOffset()
      const stickyHeight = navStickyRef.current?.getBoundingClientRect().height ?? 0

      return headerOffset + stickyHeight
    }

    const getActiveSectionId = () => {
      const scrollAnchor = window.scrollY + getStickyOffset() + 32
      const sections = COMPONENT_LINKS
        .map((componentLink) => {
          const section = sectionRefs.current[componentLink.id]

          if (!section) {
            return null
          }

          return {
            id: componentLink.id,
            top: section.getBoundingClientRect().top + window.scrollY,
          }
        })
        .filter((section): section is ComponentSectionPosition => section !== null)

      if (sections.length === 0) {
        return null
      }

      let nextActiveSection: string | null = null

      for (const section of sections) {
        if (scrollAnchor >= section.top) {
          nextActiveSection = section.id
          continue
        }

        break
      }

      return nextActiveSection
    }

    const updateActiveSection = () => {
      const nextActiveSection = getActiveSectionId()

      setActiveComponent((currentActiveSection) => {
        if (currentActiveSection === nextActiveSection) {
          return currentActiveSection
        }

        return nextActiveSection
      })

      lastRunAt = window.performance.now()
      timeoutId = 0
    }

    const scheduleActiveSectionUpdate = () => {
      const now = window.performance.now()
      const timeUntilNextRun = Math.max(0, throttleMs - (now - lastRunAt))

      if (timeoutId !== 0) {
        return
      }

      timeoutId = window.setTimeout(updateActiveSection, timeUntilNextRun)
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true })
    window.addEventListener('resize', scheduleActiveSectionUpdate)

    return () => {
      if (timeoutId !== 0) {
        window.clearTimeout(timeoutId)
      }

      window.removeEventListener('scroll', scheduleActiveSectionUpdate)
      window.removeEventListener('resize', scheduleActiveSectionUpdate)
    }
  }, [])

  const handleComponentSelect = (componentId: string) => {
    if (activeComponent === componentId && pageTopRef.current) {
      const headerOffset = getHeaderOffset()
      const top = pageTopRef.current.getBoundingClientRect().top + window.scrollY - headerOffset

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      })

      return
    }

    const stickyOffset = getStickyOffset()
    const targetSection = sectionRefs.current[componentId]

    if (targetSection) {
      const top = targetSection.getBoundingClientRect().top + window.scrollY - stickyOffset

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      })
    }
  }

  return (
    <div ref={pageTopRef} className="page components-page">
      <h1>Components</h1>
      <div className="components-intro">
        <p>
          Reusable UI components built with accessibility and consistency in mind.
          Each component includes a live example and a direct Storybook entry for deeper review.
        </p>
      </div>

      <div
        ref={navStickyRef}
        className={`components-nav-sticky ${isNavSticky ? 'is-sticky' : ''}`}
      >
        <div className="components-overview-card">
          <div className="components-storybook-callout">
            <div>
              <strong>Need deeper component detail?</strong>
              <p>
                Open the integrated Storybook for isolated states, controls, and component-level documentation.
              </p>
            </div>
            <a href={storybookUrl} className="components-storybook-link" target="_blank" rel="noreferrer">
              Open Storybook
            </a>
          </div>

          <nav className="components-nav" aria-label="Component sections">
            <ul className="components-nav-list">
              {COMPONENT_LINKS.map((componentLink) => (
                <li key={componentLink.id}>
                  <button
                    className={`components-nav-link ${activeComponent === componentLink.id ? 'is-active' : ''}`}
                    type="button"
                    onClick={() => handleComponentSelect(componentLink.id)}
                    aria-pressed={activeComponent === componentLink.id}
                  >
                    {componentLink.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <section
        id="buttons"
        className="component-section"
        ref={(element) => {
          sectionRefs.current.buttons = element
        }}
      >
        <h2>Buttons</h2>
        <p>
          Buttons are the primary way users take actions in the interface. Use primary
          buttons for main actions and secondary buttons for alternative actions.
        </p>

        <div className="component-demo">
          <h3>Preview</h3>
          <div className="demo-area">
            <a href={COMPONENT_STORYBOOK_LINKS.buttons} className="component-storybook-button" target="_blank" rel="noreferrer">
              View in Storybook
            </a>
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
        </div>
      </section>

      <section
        id="inputs"
        className="component-section"
        ref={(element) => {
          sectionRefs.current.inputs = element
        }}
      >
        <h2>Inputs</h2>
        <p>
          Form inputs allow users to enter data. Always include a label for accessibility.
        </p>

        <div className="component-demo">
          <h3>Preview</h3>
          <div className="demo-area">
            <a href={COMPONENT_STORYBOOK_LINKS.inputs} className="component-storybook-button" target="_blank" rel="noreferrer">
              View in Storybook
            </a>
            <div className="input-group">
              <label htmlFor="demo-email" className="input-label">Email</label>
              <input
                type="email"
                id="demo-email"
                className="input"
                placeholder="Enter your email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="demo-password" className="input-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="demo-password"
                  className="input input--has-icon"
                  placeholder="Enter your password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="demo-copy" className="input-label">Copy field</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="demo-copy"
                  className="input input--has-icon"
                  value={copyValue}
                  readOnly
                />
                <button
                  type="button"
                  className={`input-icon-btn${copied ? ' input-icon-btn--success' : ''}`}
                  onClick={async () => {
                    try { await navigator.clipboard.writeText(copyValue); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* */ }
                  }}
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="demo-date" className="input-label">Date</label>
              <input
                type="date"
                id="demo-date"
                className="input input--date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="demo-role" className="input-label">Role</label>
              <div className="select-wrapper">
                <select
                  id="demo-role"
                  className="select"
                  value={inputDropdown}
                  onChange={(e) => setInputDropdown(e.target.value)}
                >
                  <option value="" disabled>Select a role…</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <span className="input-label">Preferences</span>
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" checked={check1} onChange={(e) => setCheck1(e.target.checked)} />
                <span className="checkbox-text">Email notifications</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" checked={check2} onChange={(e) => setCheck2(e.target.checked)} />
                <span className="checkbox-text">Marketing emails</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cards"
        className="component-section"
        ref={(element) => {
          sectionRefs.current.cards = element
        }}
      >
        <h2>Cards</h2>
        <p>
          Cards are flexible containers for grouping related content and actions.
        </p>

        <div className="component-demo">
          <h3>Preview</h3>
          <div className="demo-area">
            <a href={COMPONENT_STORYBOOK_LINKS.cards} className="component-storybook-button" target="_blank" rel="noreferrer">
              View in Storybook
            </a>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Card Title</h3>
              <p>Card content goes here with descriptive text that explains the card's purpose.</p>
              <button className="btn btn-primary">Action</button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="loader"
        className="component-section"
        ref={(element) => {
          sectionRefs.current.loader = element
        }}
      >
        <h2>Loader</h2>
        <p>
          Loaders communicate progress without blocking the interface. This library now
          uses a single circular spinner with a rotating gradient indicator so loading
          states stay visually consistent across the product.
        </p>

        <div className="component-demo">
          <h3>Preview</h3>
          <div className="demo-area loader-demo-area">
            <a href={COMPONENT_STORYBOOK_LINKS.loader} className="component-storybook-button" target="_blank" rel="noreferrer">
              View in Storybook
            </a>
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
        </div>
      </section>
    </div>
  )
}

export default Components

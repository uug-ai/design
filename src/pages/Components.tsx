import { useEffect, useRef, useState } from 'react'
import { Plus, Star, Trash, Xmark } from 'iconoir-react'
import {
  HubBadge, HubBlock, HubButton, HubCard, HubCheckbox, HubInfobox, HubInput,
  HubKpi, HubModal, HubMultiToggle, HubPlaceholder, HubProgress, HubSelect,
  HubSpinner, HubStatus, HubTextarea, HubTheme, HubToggle,
} from '../components/HubWidgets'
import { storybookEntryUrl, storybookUrl } from '../config/storybook'
import './Components.css'
import {
  AdditionalFieldsExample, DataExample, DateTimeExample, MenuExample, ModalPreviewExample, NavigationExample,
  NotificationExample, SchedulingExample, SelectionExample,
} from '../components/HubWidgets/examples'

const COMPONENT_LINKS = [
  { id: 'buttons', label: 'Buttons', storybookPath: '/docs/components-buttons--docs', description: 'Compact production actions with primary, neutral, success, destructive, outlined and loading states.' },
  { id: 'forms', label: 'Forms', storybookPath: '/docs/components-forms--docs', description: 'Hub fields, searchable selection, checkboxes, switches and segmented controls.' },
  { id: 'selection', label: 'Selection', storybookPath: '/docs/components-selection--docs', description: 'Searchable single and multi-selection, locked options, clear, overlay placement and loading states.' },
  { id: 'datetime', label: 'Date and time', storybookPath: '/docs/components-date-and-time--docs', description: 'Calendars, date fields and precise time spinners with bounds and recording availability.' },
  { id: 'scheduling', label: 'Scheduling', storybookPath: '/docs/components-scheduling--docs', description: 'Editable time segments and weekly schedules with keyboard controls and explicit timezones.' },
  { id: 'menus', label: 'Menus', storybookPath: '/docs/components-menus--docs', description: 'Action menus and compact control popups with disabled, hidden and destructive actions.' },
  { id: 'data', label: 'Data', storybookPath: '/docs/components-data--docs', description: 'Responsive tables, pagination, search, empty/loading states and load-more controls.' },
  { id: 'navigation', label: 'Navigation', storybookPath: '/docs/components-navigation--docs', description: 'Breadcrumbs, grid and aspect-ratio controls, and language selection.' },
  { id: 'notifications', label: 'Notifications', storybookPath: '/docs/components-notifications--docs', description: 'Toast messages, actions, dismissal, identity badges and colored labels.' },
  { id: 'surfaces', label: 'Surfaces', storybookPath: '/docs/components-surfaces--docs', description: 'Production cards, KPI tiles and compositional blocks with expandable content.' },
  { id: 'feedback', label: 'Feedback', storybookPath: '/docs/components-feedback--docs', description: 'Status badges, messages, progress, loading and empty states from Hub.' },
  { id: 'modal', label: 'Modal', storybookPath: '/docs/components-modal--docs', description: 'Complete header, body and footer preview, plus overlay dialogs and centered confirmations with keyboard focus management.' },
] as const

const SITE_OPTIONS = [
  { value: 'ghent', text: 'Ghent - Bijlokehof' },
  { value: 'new-york', text: 'New York - Midtown' },
  { value: 'cape-town', text: 'Cape Town - Waterfront' },
]

type ComponentSectionId = (typeof COMPONENT_LINKS)[number]['id']
type ComponentSectionPosition = { id: ComponentSectionId; top: number }

const LEGACY_SECTION_IDS: Partial<Record<ComponentSectionId, string>> = {
  forms: 'inputs', surfaces: 'cards', feedback: 'loader',
}

function Components() {
  const pageTopRef = useRef<HTMLDivElement | null>(null)
  const navStickyRef = useRef<HTMLDivElement | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [previewThemePreference, setPreviewThemePreference] = useState<'auto' | 'light' | 'dark'>('auto')
  const [siteTheme, setSiteTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
  const previewTheme = previewThemePreference === 'auto' ? siteTheme : previewThemePreference
  const [site, setSite] = useState('ghent')
  const [filterSite, setFilterSite] = useState('all')
  const [mediaView, setMediaView] = useState('recordings')
  const [messageVisible, setMessageVisible] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(65)
  const [preferencesSaved, setPreferencesSaved] = useState(false)
  const [modal, setModal] = useState<'edit' | 'confirmation' | null>(null)
  const [modalResult, setModalResult] = useState('')
  const [activeComponent, setActiveComponent] = useState<string | null>(null)
  const [isNavSticky, setIsNavSticky] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const updateSiteTheme = () => setSiteTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
    const observer = new MutationObserver(updateSiteTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    updateSiteTheme()
    return () => observer.disconnect()
  }, [])

  const getHeaderOffset = () => {
    const header = document.querySelector('.header')
    return header instanceof HTMLElement ? header.getBoundingClientRect().height : 77
  }

  const getStickyOffset = () => getHeaderOffset() + (navStickyRef.current?.getBoundingClientRect().height ?? 0)

  useEffect(() => {
    const updateStickyState = () => {
      pageTopRef.current?.style.setProperty('--components-header-height', `${getHeaderOffset()}px`)
      if (navStickyRef.current) {
        pageTopRef.current?.style.setProperty('--components-nav-height', `${navStickyRef.current.getBoundingClientRect().height}px`)
        setIsNavSticky(navStickyRef.current.getBoundingClientRect().top <= getHeaderOffset())
      }
    }

    const observer = new ResizeObserver(updateStickyState)
    const header = document.querySelector('.header')
    if (header) observer.observe(header)
    if (navStickyRef.current) observer.observe(navStickyRef.current)
    updateStickyState()
    window.addEventListener('scroll', updateStickyState, { passive: true })
    window.addEventListener('resize', updateStickyState)
    return () => {
      window.removeEventListener('scroll', updateStickyState)
      window.removeEventListener('resize', updateStickyState)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    let timeoutId = 0
    let lastRunAt = 0

    const updateActiveSection = () => {
      const stickyOffset = getHeaderOffset() + (navStickyRef.current?.getBoundingClientRect().height ?? 0)
      const scrollAnchor = window.scrollY + stickyOffset + 32
      const sections = COMPONENT_LINKS.map(({ id }) => {
        const section = sectionRefs.current[id]
        return section ? { id, top: section.getBoundingClientRect().top + window.scrollY } : null
      }).filter((section): section is ComponentSectionPosition => section !== null)
      let nextActiveSection: string | null = null
      for (const section of sections) {
        if (scrollAnchor < section.top) break
        nextActiveSection = section.id
      }
      setActiveComponent(nextActiveSection)
      lastRunAt = window.performance.now()
      timeoutId = 0
    }

    const scheduleActiveSectionUpdate = () => {
      const timeUntilNextRun = Math.max(0, 80 - (window.performance.now() - lastRunAt))
      if (timeoutId === 0) timeoutId = window.setTimeout(updateActiveSection, timeUntilNextRun)
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true })
    window.addEventListener('resize', scheduleActiveSectionUpdate)
    return () => {
      if (timeoutId !== 0) window.clearTimeout(timeoutId)
      window.removeEventListener('scroll', scheduleActiveSectionUpdate)
      window.removeEventListener('resize', scheduleActiveSectionUpdate)
    }
  }, [])

  useEffect(() => {
    const scrollToFragment = () => {
      const target = document.getElementById(window.location.hash.slice(1))
      if (target && pageTopRef.current?.contains(target)) target.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    let cancelled = false
    let frame = 0
    void document.fonts.ready.then(() => {
      if (!cancelled) frame = window.requestAnimationFrame(scrollToFragment)
    })
    window.addEventListener('hashchange', scrollToFragment)
    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', scrollToFragment)
    }
  }, [])

  const handleComponentSelect = (componentId: ComponentSectionId) => {
    const target = activeComponent === componentId ? pageTopRef.current : sectionRefs.current[componentId]
    if (!target) return
    const offset = activeComponent === componentId ? getHeaderOffset() : getStickyOffset()
    window.scrollTo({
      top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  const closeModal = () => setModal(null)
  const previews = {
    buttons: <div className="hub-stack">
      <div className="hub-row">
        <HubButton icon={<Plus />}>Add camera</HubButton>
        <HubButton variant="neutral">Cancel</HubButton>
        <HubButton variant="success">Save settings</HubButton>
        <HubButton variant="alert" icon={<Trash />}>Delete camera</HubButton>
        <HubButton variant="outlined">View details</HubButton>
        <HubButton variant="borderless">More actions</HubButton>
        <HubButton variant="submit">Apply changes</HubButton>
        <HubButton variant="transparent">Transparent</HubButton>
        <HubButton variant="starred" active icon={<Star />} aria-pressed>Favourite</HubButton>
        <HubButton variant="borderless" icon={<Xmark />} aria-label="Close panel" />
      </div>
      <div className="hub-row">
        <HubButton disabled>Disabled</HubButton>
        <HubButton loading disabled>Saving settings</HubButton>
        <HubButton active aria-pressed>Active</HubButton>
      </div>
    </div>,
    forms: <div className="hub-stack">
      <div className="hub-demo-grid">
        <HubInput label="Camera name" defaultValue="Entrance camera" />
        <HubSelect label="Site" value={site} onChange={setSite} options={SITE_OPTIONS} />
        <HubInput label="Required field" error="Camera name is required." />
        <HubInput label="Camera ID" defaultValue="entrance-01" readOnly />
        <HubInput label="Disabled field" defaultValue="Managed by organisation" disabled />
        <HubInput label="Empty field" placeholder="Enter a camera name" />
      </div>
      <HubSelect label="Filter sites" variant="filter" value={filterSite} onChange={setFilterSite}
        options={[{ value: 'all', text: 'All sites' }, ...SITE_OPTIONS]} />
      <HubTextarea label="Description" placeholder="Describe this camera's location" />
      <div className="hub-row">
        <HubCheckbox defaultChecked>Include offline cameras</HubCheckbox>
        <HubCheckbox defaultChecked disabled>Managed by organisation</HubCheckbox>
      </div>
      <HubToggle label="Motion detection" description="Record when motion is detected." defaultChecked />
      <HubToggle label="Disabled switch" checked disabled />
      <div className="component-segmented-preview">
        <HubMultiToggle label="Media view" value={mediaView} onChange={setMediaView} options={[
          { value: 'recordings', text: 'Recordings' }, { value: 'snapshots', text: 'Snapshots' }, { value: 'events', text: 'Events' },
        ]} />
      </div>
      <AdditionalFieldsExample />
    </div>,
    selection: <SelectionExample locked />,
    datetime: <DateTimeExample />,
    scheduling: <SchedulingExample weekly />,
    menus: <MenuExample />,
    data: <DataExample />,
    navigation: <NavigationExample />,
    notifications: <NotificationExample />,
    surfaces: <div className="hub-stack">
      <div className="hub-row">
        <h3 className="hub-demo-title">Site overview</h3>
        <HubBadge title="Online cameras" count={25} total={25} />
      </div>
      <div className="hub-demo-grid">
        <HubCard title="Storage" subtitle="Recording storage used" percentage={68} footer="Your current subscription" />
        <HubCard title="Cameras" subtitle="Connected to this project" percentage={25} unit="" footer="All cameras are online" />
        <HubKpi value={25} total={25} footer="Cameras online" />
        <HubKpi value={1284} change={24} footer="Recordings today" />
        <HubKpi value={68} unit="%" change={-3} footer="Storage used" />
        <HubKpi value={0} footer="Loading recordings" loading />
      </div>
      <HubBlock title="Recording preferences" expandable footer={<>
        <span>Project settings</span>
        <HubButton onClick={() => setPreferencesSaved(true)}>Save settings</HubButton>
      </>}>
        <div style={{ padding: 24 }}>
          <HubToggle label="Notifications" description="Notify the team when an alert rule matches." defaultChecked />
        </div>
      </HubBlock>
      {preferencesSaved && <p role="status">Recording preferences saved in this demo. No Hub data was changed.</p>}
    </div>,
    feedback: <div className="hub-stack">
      <div className="hub-row">
        <HubBadge title="Online" tone="success" />
        <HubBadge title="Offline" tone="alert" />
        <HubBadge title="Updating" tone="updating" />
        <HubBadge title="Neutral" />
        <HubBadge title="Information" tone="info" />
        <HubBadge title="Featured" tone="gold" />
      </div>
      <div className="hub-row">
        <HubBadge title="Online cameras" count={25} total={25} />
        <HubBadge title="Online cameras" count={48} total={50} />
        <HubBadge title="No cameras" count={0} total={0} />
      </div>
      <div className="hub-row">
        <HubStatus tone="success">Connected</HubStatus>
        <HubStatus>Offline</HubStatus>
        <HubStatus tone="updating">Idle</HubStatus>
        <HubStatus tone="alert">Motion detected</HubStatus>
      </div>
      {messageVisible
        ? <HubInfobox onDismiss={() => setMessageVisible(false)}>Settings apply to all cameras in this site.</HubInfobox>
        : <HubButton variant="outlined" onClick={() => setMessageVisible(true)}>Restore message</HubButton>}
      <HubInfobox tone="success">Camera settings saved successfully.</HubInfobox>
      <HubInfobox tone="warning">Some cameras are offline. Check their connection.</HubInfobox>
      <HubInfobox tone="error">Unable to connect to the camera. Please try again.</HubInfobox>
      <HubProgress label="Uploading recording" value={uploadProgress} />
      <label>Upload progress: {uploadProgress}%
        <input aria-label="Upload progress" type="range" min={0} max={100} value={uploadProgress}
          onChange={event => setUploadProgress(event.target.valueAsNumber)} />
      </label>
      <HubSpinner label="Loading recordings" />
      <div className="hub-demo-grid">
        <HubPlaceholder title="No recordings yet" description="Recordings will appear here when your cameras start capturing." />
        <HubPlaceholder error title="Unable to load recordings" description="Check your connection and try again." />
      </div>
    </div>,
    modal: <div className="hub-stack">
      <ModalPreviewExample />
      <p>Try the overlay dialogs:</p>
      <div className="hub-row">
        <HubButton onClick={() => { setModal('edit'); setModalResult('') }}>Edit camera</HubButton>
        <HubButton variant="alert" onClick={() => { setModal('confirmation'); setModalResult('') }}>Delete camera</HubButton>
      </div>
      {modalResult && <p role="status">{modalResult}</p>}
      <HubModal open={modal !== null} confirmation={modal === 'confirmation'}
        title={modal === 'confirmation' ? 'Delete camera?' : 'Edit camera'} onClose={closeModal}
        actions={<>
          <HubButton variant="neutral" onClick={closeModal}>Cancel</HubButton>
          <HubButton variant={modal === 'confirmation' ? 'alert' : 'primary'} onClick={() => {
            setModalResult(modal === 'confirmation' ? 'Camera deleted in this demo. No Hub data was changed.' : 'Camera settings saved in this demo.')
            closeModal()
          }}>{modal === 'confirmation' ? 'Delete camera' : 'Save settings'}</HubButton>
        </>}>
        {modal === 'confirmation'
          ? <p>This action removes the camera from this project. This is a presentation-only demo.</p>
          : <div className="hub-stack">
            <HubInput label="Camera name" defaultValue="Entrance camera" />
            <HubTextarea label="Description" defaultValue="Camera at the building entrance." />
          </div>}
      </HubModal>
    </div>,
  }

  return (
    <div ref={pageTopRef} className="page components-page">
      <h1>Components</h1>
      <div className="components-intro">
        <p>The production Hub widgets are the component library. These live previews use the same
          components as Storybook, with Hub typography, spacing, surfaces and interaction states.</p>
      </div>

      <div ref={navStickyRef} className={`components-nav-sticky ${isNavSticky ? 'is-sticky' : ''}`}>
        <div className="components-overview-card">
          <div className="components-storybook-callout">
            <div>
              <strong>Hub widget library</strong>
              <p>Explore every state in Storybook. All examples use local demo data only.</p>
              <label className="components-widget-theme">
                Widget theme
                <select value={previewThemePreference} onChange={event => {
                  const theme = event.target.value
                  if (theme === 'auto' || theme === 'light' || theme === 'dark') setPreviewThemePreference(theme)
                }}>
                  <option value="auto">Follow site</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
            </div>
            <a href={storybookUrl} className="components-storybook-link" target="_blank" rel="noreferrer">Open Storybook</a>
          </div>
          <nav className="components-nav" aria-label="Component sections">
            <ul className="components-nav-list">
              {COMPONENT_LINKS.map(({ id, label }) => <li key={id}>
                <button className={`components-nav-link ${activeComponent === id ? 'is-active' : ''}`}
                  type="button" onClick={() => handleComponentSelect(id)} aria-pressed={activeComponent === id}>{label}</button>
              </li>)}
            </ul>
          </nav>
        </div>
      </div>

      {COMPONENT_LINKS.map(({ id, label, description, storybookPath }) => (
        <section key={id} id={id} className="component-section" ref={element => { sectionRefs.current[id] = element }}>
          {LEGACY_SECTION_IDS[id] && <span className="component-section-anchor"
            id={LEGACY_SECTION_IDS[id]} aria-hidden="true" />}
          <h2>{label}</h2>
          <p>{description}</p>
          <div className="component-demo">
            <div className="component-demo-toolbar">
              <h3>Preview</h3>
              <a href={storybookEntryUrl(storybookPath)} className="component-storybook-button" target="_blank" rel="noreferrer">
                View in Storybook
              </a>
            </div>
            <HubTheme theme={previewTheme}>{previews[id]}</HubTheme>
          </div>
        </section>
      ))}
    </div>
  )
}

export default Components

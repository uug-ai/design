import { useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { BlockShadow, BlockView } from './production/BlockView'
import { blockSections, blockType, minBlockSize, newBlock } from './production/blocks'
import './production/blocks.css'
import './component.css'

export interface DrawBlockProps {
  blockKey: string
  header?: string
  title?: string
  subtitle?: string
  badges?: string[]
  width?: number
  height?: number
  theme?: 'light' | 'dark'
  headerColor?: string
  cardColor?: string
  titleColor?: string
  subtitleColor?: string
  accentColor?: string
  radius?: number
}

const badgeNames = ['minio', 'ceph', 'aws', 'gcp', 'azure', 'docker', 'linux', 'raspberrypi', 'kubernetes']

export function DrawBlockPreview(props: DrawBlockProps) {
  const id = `draw-${useId().replace(/:/g, '')}`
  const type = blockType(props.blockKey)
  const minimum = minBlockSize(props.blockKey)
  const dimension = (value: number | undefined, fallback: number, min: number) =>
    value !== undefined && Number.isFinite(value) ? Math.max(min, Math.min(800, value)) : fallback
  const shape = {
    ...newBlock(props.blockKey, id, 20, 20),
    w: dimension(props.width, type.w, minimum.w),
    h: dimension(props.height, type.h, minimum.h),
    header: props.header ?? type.header,
    title: props.title ?? type.title,
    subtitle: props.subtitle ?? type.subtitle,
    badges: props.badges ?? type.badges,
  }
  const style = {
    '--draw-header-color': props.headerColor ?? type.color,
    '--draw-card-color': props.cardColor,
    '--draw-title-color': props.titleColor,
    '--draw-subtitle-color': props.subtitleColor,
    '--iso-accent': props.accentColor,
    '--draw-radius': `${props.radius ?? 12}px`,
  } as CSSProperties
  return <div className="draw-block-preview" data-draw-theme={props.theme} style={style}>
    <svg viewBox={`0 0 ${shape.w + 40} ${shape.h + 40}`} width={shape.w + 40} height={shape.h + 40}
      role="img" aria-label={`${shape.title || type.title} building block`}>
      <defs><BlockShadow idPrefix={`${id}-`} /></defs>
      <BlockView shape={shape} idPrefix={`${id}-`} />
    </svg>
  </div>
}

export function DrawBlockCatalogue({ onSelect, group }: { onSelect?: (key: string) => void; group?: string }) {
  const [query, setQuery] = useState('')
  const search = query.trim().toLowerCase()
  const sections = blockSections.map(section => ({
    ...section,
    blocks: section.blocks.filter(block =>
      (!group || (section.group ?? section.title) === group) &&
      [block.key, block.label, block.title, block.subtitle, section.group, section.title].join(' ').toLowerCase().includes(search)),
  })).filter(section => section.blocks.length)
  const count = sections.reduce((total, section) => total + section.blocks.length, 0)
  return <div className="draw-catalogue">
    <label className="draw-field">Search building blocks
      <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Agent, Kubernetes, camera, storage..." />
    </label>
    <p className="draw-result-count" role="status">{count} building blocks</p>
    {!count && <p>No building blocks match your search.</p>}
    {sections.map(section => <section key={`${section.group ?? ''}-${section.title}`} className="draw-catalogue-section">
      <h3>{section.group ? `${section.group} / ` : ''}{section.title}</h3>
      <div className="draw-catalogue-grid">
        {section.blocks.map(block => <div key={block.key} className="draw-catalogue-item" data-block-key={block.key}>
          {onSelect ? <button type="button" className="draw-catalogue-pick" onClick={() => onSelect(block.key)}
            aria-label={`Design ${block.label ?? block.title}`}>
            <DrawBlockPreview blockKey={block.key} />
            <span>{block.label ?? block.title}</span>
          </button> : <>
            <DrawBlockPreview blockKey={block.key} />
            <p>{block.label ?? block.title}</p>
          </>}
          <code>{block.key}</code>
        </div>)}
      </div>
    </section>)}
  </div>
}

function Inspector({ blockKey }: { blockKey: string }) {
  const id = useId()
  const type = blockType(blockKey)
  const minimum = minBlockSize(blockKey)
  const [design, setDesign] = useState<DrawBlockProps>({
    blockKey, header: type.header, title: type.title, subtitle: type.subtitle, badges: type.badges ?? [],
    width: type.w, height: type.h, headerColor: type.color, radius: 12,
  })
  const [theme, setTheme] = useState('auto')
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null)
  const update = <K extends keyof DrawBlockProps>(key: K, value: DrawBlockProps[K]) => {
    setDesign(previous => ({ ...previous, [key]: value }))
    setMessage(null)
  }
  const settings = JSON.stringify(design, null, 2)
  return <div className="draw-inspector">
    <div className="draw-design-stage">
      <div className="draw-stage-toolbar">
        <h2>{type.label ?? type.title}</h2>
        <label className="draw-field">Preview theme
          <select value={theme} onChange={event => setTheme(event.target.value)}>
            <option value="auto">Follow site theme</option><option value="light">Light</option><option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <DrawBlockPreview {...design} theme={theme === 'light' || theme === 'dark' ? theme : undefined} />
      {type.icon && <p className="draw-help">Isometric artwork keeps its production geometry. Adjust its size and accent here; edit the SVG source for geometry changes.</p>}
      <details className="draw-settings">
        <summary>Design settings</summary>
        <textarea readOnly value={settings} aria-label="Block design JSON" rows={12} />
        <button type="button" onClick={async () => {
          try {
            await navigator.clipboard.writeText(settings)
            setMessage({ error: false, text: 'Design settings copied.' })
          } catch (error) {
            console.error('Could not copy Draw building-block settings', error)
            setMessage({ error: true, text: 'Could not copy settings. Select and copy the JSON above instead.' })
          }
        }}>Copy design settings</button>
        {message && <p role={message.error ? 'alert' : 'status'}>{message.text}</p>}
      </details>
    </div>
    <div className="draw-design-controls">
      <h2>Design controls</h2>
      <fieldset disabled={!!type.icon}>
        <legend>Card content</legend>
        {(['header', 'title', 'subtitle'] as const).map(key => <label key={key} className="draw-field">
          {key === 'header' ? 'Header' : key === 'title' ? 'Title' : 'Subtitle'}
          <input value={design[key] ?? ''} maxLength={200} onChange={event => update(key, event.target.value)} />
        </label>)}
        <div className="draw-badge-options" role="group" aria-label="Platform badges">
          {badgeNames.map(badge => <label key={badge}>
            <input type="checkbox" checked={design.badges?.includes(badge) ?? false} onChange={event =>
              update('badges', event.target.checked ? [...(design.badges ?? []), badge] : design.badges?.filter(value => value !== badge))} />
            {badge}
          </label>)}
        </div>
      </fieldset>
      <fieldset>
        <legend>Size and appearance</legend>
        {(['width', 'height'] as const).map(key => <label key={key} className="draw-field">
          {key === 'width' ? 'Width' : 'Height'}: {design[key]} px
          <input type="range" min={key === 'width' ? minimum.w : minimum.h} max="600" step="1"
            value={design[key]} onChange={event => update(key, Number(event.target.value))} />
        </label>)}
        <label className="draw-field">{type.icon ? 'Accent colour' : 'Header colour'}
          <input type="color" value={type.icon ? design.accentColor ?? '#7426ff' : design.headerColor}
            onChange={event => update(type.icon ? 'accentColor' : 'headerColor', event.target.value)} />
        </label>
        {!type.icon && <>
          {(['cardColor', 'titleColor', 'subtitleColor'] as const).map(key => <div key={key} className="draw-field">
            <label htmlFor={`${id}-${key}`}>{key === 'cardColor' ? 'Card colour' : key === 'titleColor' ? 'Title colour' : 'Subtitle colour'}</label>
            <span className="draw-colour-control">
              <input id={`${id}-${key}`} type="color" value={design[key] ?? (key === 'cardColor' ? '#ffffff' : key === 'titleColor' ? '#0b0b12' : '#6d6666')}
                onChange={event => update(key, event.target.value)} />
              <button type="button" disabled={!design[key]} onClick={() => update(key, undefined)}>Use theme</button>
            </span>
          </div>)}
          <label className="draw-field">Corner radius: {design.radius} px
            <input type="range" min="0" max="32" value={design.radius} onChange={event => update('radius', Number(event.target.value))} />
          </label>
        </>}
      </fieldset>
    </div>
  </div>
}

export function DrawBlockWorkbench() {
  const id = useId()
  const toolbar = useRef<HTMLDivElement>(null)
  const [blockKey, setBlockKey] = useState('agent')
  const [revision, setRevision] = useState(0)
  const choose = (key: string) => {
    setBlockKey(key)
    setRevision(value => value + 1)
  }
  return <div className="draw-workbench">
    <div className="draw-workbench-toolbar" ref={toolbar}>
      <div className="draw-field"><label htmlFor={`${id}-block`}>Building block</label>
        <select id={`${id}-block`} value={blockKey} onChange={event => choose(event.target.value)}>
          {blockSections.map(section => <optgroup key={`${section.group ?? ''}-${section.title}`}
            label={`${section.group ? `${section.group} / ` : ''}${section.title}`}>
            {section.blocks.map(block => <option key={block.key} value={block.key}>{block.label ?? block.title}</option>)}
          </optgroup>)}
        </select>
      </div>
      <button type="button" onClick={() => choose(blockKey)}>Reset design</button>
    </div>
    <Inspector key={`${blockKey}-${revision}`} blockKey={blockKey} />
    <p className="draw-help">A local design playground, not a second drawing editor. Settings are experiments for code review; they do not update live Draw or its boards.</p>
    <h2>Building-block catalogue</h2>
    <p>Choose a block to start designing it above. The catalogue always shows production defaults.</p>
    <DrawBlockCatalogue onSelect={key => {
      choose(key)
      toolbar.current?.scrollIntoView({ block: 'start' })
    }} />
  </div>
}

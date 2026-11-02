import { useId } from 'react'
import type { CSSProperties } from 'react'
import { storybookEntryUrl } from '../../config/storybook'
import { drawBlockCategories, drawBlockStoryId } from './catalogue'
import { BlockShadow, BlockView } from './production/BlockView'
import { blockType, minBlockSize, newBlock } from './production/blocks'
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

export function DrawBlockCatalogue({ category }: { category?: string }) {
  const categories = category === undefined ? drawBlockCategories : drawBlockCategories.filter(item => item.name === category)
  if (categories.length === 0) throw new Error(`Unknown Draw block category: ${category}`)
  const count = categories.reduce((total, category) => total + category.blocks.length, 0)
  return <div className="draw-catalogue">
    <p className="draw-result-count" role="status">{count} building blocks</p>
    {categories.map(category => <section key={category.id} id={category.id}
      className="draw-catalogue-section" aria-labelledby={`${category.id}-heading`}>
      <h2 id={`${category.id}-heading`}>{category.name}</h2>
      <div className="draw-catalogue-grid">
        {category.blocks.map(block => <div key={block.key} className="draw-catalogue-item" data-block-key={block.key}>
          <a className="draw-catalogue-pick"
            href={storybookEntryUrl(`/story/${drawBlockStoryId(category.name, block.key)}`)}
            target="_blank" rel="noreferrer" aria-label={`View ${block.label ?? block.title} in Storybook`}>
            <DrawBlockPreview blockKey={block.key} />
            <span>{block.label ?? block.title}</span>
          </a>
          <code>{block.key}</code>
        </div>)}
      </div>
    </section>)}
  </div>
}

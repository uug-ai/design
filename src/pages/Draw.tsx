import { storybookEntryUrl } from '../config/storybook'
import { DrawBlockWorkbench } from '../components/DrawBlocks/component'
import './Draw.css'

export default function Draw() {
  return <div className="page draw-page">
    <header className="draw-page-heading">
      <p className="draw-page-eyebrow">Draw / Design library</p>
      <h1>Building blocks</h1>
      <p>Design the components behind our architecture drawings. Explore the complete production catalogue, tune a block and compare its appearance in light and dark mode.</p>
      <div className="draw-page-links">
        <a href={storybookEntryUrl('/story/draw-building-blocks--single-block')} target="_blank" rel="noreferrer">Storybook controls</a>
        <a href="https://draw.uug.ai/" target="_blank" rel="noreferrer">Launch Draw</a>
      </div>
    </header>
    <DrawBlockWorkbench />
  </div>
}

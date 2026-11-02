import { storybookEntryUrl } from '../config/storybook'
import { DrawBlockCatalogue } from '../components/DrawBlocks/component'
import './Draw.css'

export default function Draw() {
  return <div className="page draw-page">
    <header className="draw-page-heading">
      <p className="draw-page-eyebrow">Draw / Design library</p>
      <h1>Building blocks</h1>
      <p>Browse architecture building blocks by category. Each block has its own Storybook entry, with a main Docs page showing the complete library.</p>
      <div className="draw-page-links">
        <a href={storybookEntryUrl('/docs/draw-building-blocks--docs')} target="_blank" rel="noreferrer">All blocks in Storybook</a>
        <a href="https://draw.uug.ai/" target="_blank" rel="noreferrer">Launch Draw</a>
      </div>
    </header>
    <DrawBlockCatalogue />
  </div>
}

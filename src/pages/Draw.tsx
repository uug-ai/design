import { Link } from 'react-router-dom'
import templates from '../config/drawTemplates.json'
import '../components/Button/component.css'
import './ToolLanding.css'
import './Draw.css'

export default function Draw() {
  return <div className="page tool-landing draw-page">
    <header className="tool-landing-heading">
      <p className="tool-landing-eyebrow">Draw / Architecture design</p>
      <h1>Ideas into architectures.</h1>
      <p>Draw is our way to design and draw architectures. Bring devices, services and connections together in a visual plan that everyone can understand, from the first idea to a shared system design.</p>
      <div className="tool-landing-actions">
        <a className="btn btn-primary" href="https://draw.uug.ai/" target="_blank" rel="noreferrer">Launch Draw</a>
        <Link className="tool-landing-text-link" to="/components">Explore our component library</Link>
      </div>
    </header>
    <section aria-labelledby="architecture-concepts">
      <h2 id="architecture-concepts">Start with a real architecture</h2>
      <p>These are real templates from Draw: complete deployment architectures with cameras, services and their connections. Explore the examples, then open Draw to start designing.</p>
      <div className="tool-landing-grid draw-architecture-grid">
        {templates.map(template => (
          <article className="tool-landing-card draw-template-card" key={template.id}>
            <h3>{template.title}</h3>
            <p>{template.description}</p>
            <div className="draw-template-preview">
              <img src={template.preview} alt={`${template.title} architecture template from Draw`} loading="lazy" />
            </div>
            <a className="tool-landing-text-link" href="https://draw.uug.ai/" target="_blank" rel="noreferrer">Open Draw</a>
          </article>
        ))}
      </div>
    </section>
  </div>
}

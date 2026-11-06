import { storybookEntryUrl, storybookUrl } from '../config/storybook'
import '../components/Button/component.css'
import './ToolLanding.css'

const products = [
  {
    id: 'agent',
    name: 'Agent',
    description: 'Connect mixed camera brands through one interface for live video, local recording and camera controls, ready for Vault and Hub.',
    url: 'https://uug.ai/products/agent/',
  },
  {
    id: 'vault',
    name: 'Vault',
    description: 'Collect and index Agent recordings in object storage you control, on-premise or in the cloud. Deliver new media to Hub and your processing pipelines.',
    url: 'https://uug.ai/products/vault/',
  },
  {
    id: 'factory',
    name: 'Factory',
    description: 'Deploy, configure and upgrade an Agent for every camera on your own Kubernetes cluster. Manage fleet-wide settings and troubleshoot from one place.',
    url: 'https://uug.ai/products/factory/',
  },
  {
    id: 'hub',
    name: 'Hub',
    description: 'Watch live cameras, search recordings across sites and automate video AI workflows. Manage alerts and collect recordings into evidence cases.',
    url: 'https://uug.ai/products/hub/',
  },
]

export default function Storybook() {
  return (
    <div className="page tool-landing storybook-page">
      <header className="tool-landing-heading">
        <p className="tool-landing-eyebrow">Storybook / Component library</p>
        <h1>One shared component library.</h1>
        <p>Storybook centralizes our reusable components for Agent, Vault, Factory and Hub. Explore the UI patterns, examples and documentation that give our solutions a consistent design language.</p>
        <div className="tool-landing-actions">
          <a className="btn btn-primary" href={storybookUrl} target="_blank" rel="noreferrer">Open Storybook</a>
          <a className="tool-landing-text-link" href={storybookEntryUrl('/docs/draw-building-blocks--docs')} target="_blank" rel="noreferrer">Browse Draw building blocks</a>
        </div>
      </header>
      <section aria-labelledby="storybook-solutions">
        <h2 id="storybook-solutions">Shared design, distinct solutions</h2>
        <p>Our components support each solution. Learn more about the products on our website.</p>
        <div className="tool-landing-grid">
          {products.map(product => (
            <article
              className={`tool-landing-card storybook-product-card storybook-product-${product.id}`}
              key={product.id}
              aria-labelledby={`storybook-product-${product.id}`}
            >
              <h3 id={`storybook-product-${product.id}`}>{product.name}</h3>
              <p>{product.description}</p>
              <a className="tool-landing-text-link" href={product.url} target="_blank" rel="noreferrer">Explore {product.name}</a>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

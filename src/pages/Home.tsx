import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="page home-page">
      <div className="hero">
        <h1>UUG.AI Design System</h1>
        <p className="hero-description">
          A comprehensive design system that ensures consistency, efficiency, and quality
          across all UUG.AI products and experiences.
        </p>
      </div>

      <section className="section">
        <h2>What is a Design System?</h2>
        <p>
          A design system is a collection of reusable components, guided by clear standards,
          that can be assembled together to build any number of applications. It serves as
          a single source of truth for design and development teams, ensuring consistency
          and efficiency across all digital products.
        </p>
      </section>

      <section className="section">
        <h2>Why Design Systems Matter</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Consistency</h3>
            <p>
              Unified visual language and user experience across all products and platforms.
            </p>
          </div>
          <div className="benefit-card">
            <h3>Efficiency</h3>
            <p>
              Reusable components and patterns accelerate design and development workflows.
            </p>
          </div>
          <div className="benefit-card">
            <h3>Scalability</h3>
            <p>
              Build new features faster while maintaining quality and brand consistency.
            </p>
          </div>
          <div className="benefit-card">
            <h3>Collaboration</h3>
            <p>
              Shared vocabulary and tools improve communication between teams.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Design System Foundations</h2>
        <p>
          Our design system is built on fundamental principles that guide every decision:
        </p>
        <div className="foundations-grid">
          <Link to="/colors" className="foundation-card">
            <div className="foundation-icon" style={{ backgroundColor: '#2563eb' }}></div>
            <h3>Colors</h3>
            <p>Thoughtful color palettes for accessibility and brand expression.</p>
          </Link>
          <Link to="/typography" className="foundation-card">
            <div className="foundation-icon" style={{ backgroundColor: '#8b5cf6' }}></div>
            <h3>Typography</h3>
            <p>Type scales, font families, and text styles for clear communication.</p>
          </Link>
          <Link to="/spacing" className="foundation-card">
            <div className="foundation-icon" style={{ backgroundColor: '#10b981' }}></div>
            <h3>Spacing</h3>
            <p>Consistent spacing system for layout harmony and visual rhythm.</p>
          </Link>
          <Link to="/branding" className="foundation-card">
            <div className="foundation-icon" style={{ backgroundColor: '#f59e0b' }}></div>
            <h3>Branding</h3>
            <p>Logo usage, brand values, and visual identity guidelines.</p>
          </Link>
          <Link to="/components" className="foundation-card">
            <div className="foundation-icon" style={{ backgroundColor: '#ec4899' }}></div>
            <h3>Components</h3>
            <p>Reusable UI components with code examples and best practices.</p>
          </Link>
        </div>
      </section>

      <section className="section cta-section">
        <h2>Get Started</h2>
        <p>
          Explore our design foundations and component library to start building with
          the UUG.AI design system.
        </p>
        <div className="cta-buttons">
          <Link to="/colors" className="btn btn-primary">
            View Colors
          </Link>
          <Link to="/components" className="btn btn-secondary">
            Browse Components
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

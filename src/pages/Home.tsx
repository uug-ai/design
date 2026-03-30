import { BadgeCheck, Component, Palette, RulerArrows, Text } from 'iconoir-react'
import { Link } from 'react-router-dom'
import { storybookUrl } from '../config/storybook'
import './Home.css'

function Home() {
  const foundations = [
    {
      to: '/colors',
      title: 'Colors',
      description: 'Thoughtful color palettes for accessibility and brand expression.',
      icon: Palette,
      iconClassName: 'foundation-icon-colors',
    },
    {
      to: '/typography',
      title: 'Typography',
      description: 'Type scales, font families, and text styles for clear communication.',
      icon: Text,
      iconClassName: 'foundation-icon-typography',
    },
    {
      to: '/spacing',
      title: 'Spacing',
      description: 'Consistent spacing system for layout harmony and visual rhythm.',
      icon: RulerArrows,
      iconClassName: 'foundation-icon-spacing',
    },
    {
      to: '/branding',
      title: 'Branding',
      description: 'Logo usage, brand values, and visual identity guidelines.',
      icon: BadgeCheck,
      iconClassName: 'foundation-icon-branding',
    },
    {
      to: '/components',
      title: 'Components',
      description: 'Reusable UI components with code examples and best practices.',
      icon: Component,
      iconClassName: 'foundation-icon-components',
    },
  ]

  return (
    <div className="page home-page">
      <div className="hero">
        <div className="hero-title-block">
          <h1 className="hero-title-main">AUGMENT VISION</h1>
          <div className="hero-title-sub">Design system</div>
        </div>
        <p className="hero-description">
          A design system is a collection of reusable components, guided by clear standards,
          that can be assembled together to build any number of applications. It serves as
          a single source of truth for design and development teams, ensuring consistency
          and efficiency across all digital products.
        </p>
      </div>


      <section className="section">
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

      <section className="section foundations-section">
        <h2>Design System Foundations</h2>
        <p>
          Our design system is built on fundamental principles that guide every decision:
        </p>
        <div className="foundations-grid">
          {foundations.map((foundation) => {
            const Icon = foundation.icon

            return (
              <Link key={foundation.to} to={foundation.to} className="foundation-card">
                <div className={`foundation-icon ${foundation.iconClassName}`}>
                  <Icon width={28} height={28} />
                </div>
                <h3>{foundation.title}</h3>
                <p>{foundation.description}</p>
              </Link>
            )
          })}
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
          <a href={storybookUrl} className="btn btn-secondary">
            Open Storybook
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home

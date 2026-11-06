import { ArrowUpRight, Github } from 'iconoir-react'
import { Link } from 'react-router-dom'
import { cookiePreferencesEvent } from '../../config/cookieConsent'
import './component.css'

interface FooterLink {
  label: string
  href: string
  isExternal?: boolean
}

interface FooterGroup {
  title: string
  links: FooterLink[]
}

const footerGroups: FooterGroup[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Control tower', href: 'https://uug.ai/#scale' },
      { label: 'Deployment modes', href: 'https://uug.ai/#platform' },
      { label: 'Platform stack', href: 'https://uug.ai/#composition' },
      { label: 'Workflow designer', href: 'https://uug.ai/#workflows' },
      { label: 'Enterprise features', href: 'https://uug.ai/#features' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Agent', href: 'https://uug.ai/products/agent/' },
      { label: 'Factory', href: 'https://uug.ai/products/factory/' },
      { label: 'Vault', href: 'https://uug.ai/products/vault/' },
      { label: 'Hub', href: 'https://uug.ai/products/hub/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: 'https://learn.uug.ai', isExternal: true },
      { label: 'Design system', href: '/' },
      { label: 'Live demo', href: 'https://app-demo.kerberos.io', isExternal: true },
      { label: 'GitHub', href: 'https://github.com/uug-ai', isExternal: true },
      { label: 'AI-readable site guide', href: 'https://uug.ai/llms.txt' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Careers', href: 'https://uug.ai/careers/' },
      { label: 'Financials', href: 'https://uug.ai/financials/' },
      { label: 'Contact', href: 'https://uug.ai/contact/' },
      { label: 'Our office', href: 'https://uug.ai/contact/#office-heading' },
      {
        label: 'OpenStreetMap',
        href: 'https://www.openstreetmap.org/?mlat=51.0466373&mlon=3.7148417#map=18/51.0466373/3.7148417',
        isExternal: true,
      },
    ],
  },
]

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <a className="site-footer-wordmark" href="https://uug.ai/" aria-label="UUG.AI home">
              UUG.AI
            </a>
            <p>
              Deploy, manage, and automate camera fleets across edge, hybrid, and cloud
              environments.
            </p>
            <a className="site-footer-cta" href="https://uug.ai/contact/">
              Talk to our team
              <ArrowUpRight width={18} height={18} aria-hidden="true" />
            </a>
          </div>

          <nav className="site-footer-nav" aria-label="Footer navigation">
            {footerGroups.map(group => (
              <div key={group.title} className="site-footer-group">
                <h3>{group.title}</h3>
                <ul>
                  {group.links.map(link => (
                    <li key={link.label}>
                      {link.href === '/' ? (
                        <Link to="/">{link.label}</Link>
                      ) : (
                        <a
                          href={link.href}
                          target={link.isExternal ? '_blank' : undefined}
                          rel={link.isExternal ? 'noreferrer' : undefined}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer-bottom">
          <p>&copy; {new Date().getFullYear()} UUG.AI &middot; VAT BE1013644852</p>
          <div className="site-footer-meta">
            <span>Ghent, Belgium</span>
            <a href="tel:+3293908078">09 390 80 78</a>
            <a href="mailto:support@uug.ai">support@uug.ai</a>
            <button type="button" onClick={() => window.dispatchEvent(new Event(cookiePreferencesEvent))}>
              Cookie settings
            </button>
            <a
              className="site-footer-social"
              href="https://github.com/uug-ai"
              target="_blank"
              rel="noreferrer"
              aria-label="UUG.AI on GitHub"
              title="GitHub"
            >
              <Github width={20} height={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter

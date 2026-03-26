import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/colors', label: 'Colors' },
    { path: '/typography', label: 'Typography' },
    { path: '/spacing', label: 'Spacing' },
    { path: '/branding', label: 'Branding' },
    { path: '/components', label: 'Components' },
  ]

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Link to="/">UUG.AI Design System</Link>
          </div>
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 UUG.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

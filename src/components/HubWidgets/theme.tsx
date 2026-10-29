import type { ReactNode } from 'react'
import './widgets.css'
import './extended.css'

export function HubTheme({ theme = 'light', children }: {
  theme?: 'light' | 'dark'
  children: ReactNode
}) {
  return <div className="hub-widgets" data-hub-theme={theme}>{children}</div>
}

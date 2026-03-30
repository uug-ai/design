import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import Layout from './Layout'

const meta = {
  title: 'Components/Layout',
  component: Layout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof Layout>

export default meta

type Story = StoryObj<typeof meta>

export const HomeRoute: Story = {
  args: {
    children: null,
  },
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <Layout>
        <section
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '72px 20px 96px',
          }}
        >
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Storybook Preview
          </p>
          <h1 style={{ fontFamily: 'var(--font-family-heading)', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', marginBottom: '16px' }}>
            Reusable page chrome for the design system.
          </h1>
          <p style={{ maxWidth: '68ch', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            This story isolates the global header, navigation, content shell, and footer so you can refine layout states without navigating the full app.
          </p>
        </section>
      </Layout>
    </MemoryRouter>
  ),
}

export const ComponentsRoute: Story = {
  args: {
    children: null,
  },
  render: () => (
    <MemoryRouter initialEntries={['/components']}>
      <Layout>
        <section
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '72px 20px 96px',
          }}
        >
          <h1 style={{ fontFamily: 'var(--font-family-heading)', fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: '12px' }}>
            Components
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
            Use this route variant to verify the active navigation state and how the shell frames long-form component documentation.
          </p>
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            {['Loader', 'Color Swatch', 'Code Block'].map((name) => (
              <div
                key={name}
                style={{
                  padding: '20px',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  background: 'var(--surface)',
                }}
              >
                <strong>{name}</strong>
                <p style={{ marginTop: '8px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Focused component docs and interaction coverage live here.
                </p>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </MemoryRouter>
  ),
}
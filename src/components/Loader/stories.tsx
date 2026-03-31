import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import Loader from './component'

const playgroundHtml = `
  <span class="loader loader--md loader--accent" role="status" aria-live="polite" aria-label="Loading">
    <span class="loader__spinner" aria-hidden="true">
      <svg class="loader__svg" viewBox="0 0 100 100" focusable="false">
        <defs>
          <linearGradient id="loader-gradient-accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--loader-gradient-start)"></stop>
            <stop offset="100%" stop-color="var(--loader-gradient-end)"></stop>
          </linearGradient>
        </defs>
        <circle class="loader__track-circle" cx="50" cy="50" r="42"></circle>
        <circle class="loader__indicator-circle" cx="50" cy="50" r="42" pathLength="100" style="stroke: url(#loader-gradient-accent);"></circle>
      </svg>
    </span>
    <span class="loader__sr-only">Loading</span>
  </span>
`

const inlineHtml = `
  <span class="loader loader--md loader--primary loader--inline" role="status" aria-live="polite" aria-label="Publishing updates">
    <span class="loader__spinner" aria-hidden="true">
      <svg class="loader__svg" viewBox="0 0 100 100" focusable="false">
        <defs>
          <linearGradient id="loader-gradient-primary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--loader-gradient-start)"></stop>
            <stop offset="100%" stop-color="var(--loader-gradient-end)"></stop>
          </linearGradient>
        </defs>
        <circle class="loader__track-circle" cx="50" cy="50" r="42"></circle>
        <circle class="loader__indicator-circle" cx="50" cy="50" r="42" pathLength="100" style="stroke: url(#loader-gradient-primary);"></circle>
      </svg>
    </span>
    <span class="loader__label">Publishing updates</span>
  </span>
`

const toneMatrixHtml = `
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; width: min(760px, 100%);">
    <div style="display: flex; flex-direction: column; gap: 14px; padding: 20px; border: 1px solid var(--border); border-radius: 18px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(247, 245, 251, 0.96) 100%);">
      <strong style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase;">neutral</strong>
      <span class="loader loader--sm loader--neutral" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
      <span class="loader loader--md loader--neutral" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
      <span class="loader loader--lg loader--neutral" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 14px; padding: 20px; border: 1px solid var(--border); border-radius: 18px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(247, 245, 251, 0.96) 100%);">
      <strong style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase;">primary</strong>
      <span class="loader loader--sm loader--primary" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
      <span class="loader loader--md loader--primary" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
      <span class="loader loader--lg loader--primary" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 14px; padding: 20px; border: 1px solid var(--border); border-radius: 18px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(247, 245, 251, 0.96) 100%);">
      <strong style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase;">secondary</strong>
      <span class="loader loader--sm loader--secondary" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
      <span class="loader loader--md loader--secondary" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
      <span class="loader loader--lg loader--secondary" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 14px; padding: 20px; border: 1px solid var(--border); border-radius: 18px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(247, 245, 251, 0.96) 100%);">
      <strong style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase;">accent</strong>
      <span class="loader loader--sm loader--accent" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
      <span class="loader loader--md loader--accent" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
      <span class="loader loader--lg loader--accent" role="status" aria-live="polite" aria-label="Loading"><span class="loader__spinner" aria-hidden="true"></span><span class="loader__sr-only">Loading</span></span>
    </div>
  </div>
`

const invertedHtml = `
  <span class="loader loader--md loader--accent loader--inline loader--inverted" role="status" aria-live="polite" aria-label="Loading on dark surfaces">
    <span class="loader__spinner" aria-hidden="true">
      <svg class="loader__svg" viewBox="0 0 100 100" focusable="false">
        <defs>
          <linearGradient id="loader-gradient-inverted" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--loader-gradient-start)"></stop>
            <stop offset="100%" stop-color="var(--loader-gradient-end)"></stop>
          </linearGradient>
        </defs>
        <circle class="loader__track-circle" cx="50" cy="50" r="42"></circle>
        <circle class="loader__indicator-circle" cx="50" cy="50" r="42" pathLength="100" style="stroke: url(#loader-gradient-inverted);"></circle>
      </svg>
    </span>
    <span class="loader__label">Loading on dark surfaces</span>
  </span>
`

const meta = {
  title: 'Components/Loader',
  component: Loader,
  tags: ['autodocs'],
  args: {
    size: 'md',
    tone: 'accent',
    inline: false,
    inverted: false,
    label: 'Loading',
  },
  argTypes: {
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof Loader>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: htmlCssSource(playgroundHtml, componentCss, {
    layout: 'centered',
  }),
}

export const Inline: Story = {
  parameters: htmlCssSource(inlineHtml, componentCss, {
    layout: 'centered',
  }),
  args: {
    inline: true,
    tone: 'primary',
    label: 'Publishing updates',
  },
}

export const ToneMatrix: Story = {
  parameters: htmlCssSource(toneMatrixHtml, componentCss),
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        width: 'min(760px, 100%)',
      }}
    >
      {(['neutral', 'primary', 'secondary', 'accent'] as const).map((tone) => (
        <div
          key={tone}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            padding: '20px',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(247, 245, 251, 0.96) 100%)',
          }}
        >
          <strong style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tone}</strong>
          <Loader tone={tone} size="sm" />
          <Loader tone={tone} size="md" />
          <Loader tone={tone} size="lg" />
        </div>
      ))}
    </div>
  ),
}

export const Inverted: Story = {
  parameters: htmlCssSource(invertedHtml, componentCss, {
    backgrounds: {
      default: 'dark',
    },
    layout: 'centered',
  }),
  args: {
    inline: true,
    inverted: true,
    tone: 'accent',
    label: 'Loading on dark surfaces',
  },
}
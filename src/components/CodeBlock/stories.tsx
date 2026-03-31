import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import CodeBlock from './component'

const defaultHtml = `
  <div class="code-block">
    <button class="copy-button" type="button" aria-label="Copy code">
      <span class="copy-button-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M8 8h10v12H8z"></path>
          <path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </span>
      Copy
    </button>
    <pre><code class="language-tsx">function Button({ label }) {
  return &lt;button type="button"&gt;{label}&lt;/button&gt;
}</code></pre>
  </div>
`

const cssTokensHtml = `
  <div class="code-block">
    <button class="copy-button" type="button" aria-label="Copy code">
      <span class="copy-button-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M8 8h10v12H8z"></path>
          <path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </span>
      Copy
    </button>
    <pre><code class="language-css">:root {
  --primary-color: #2713ff;
  --secondary-color: #ff0059;
  --surface: #f7f5fb;
}</code></pre>
  </div>
`

const longSnippetHtml = `
  <div class="code-block">
    <button class="copy-button" type="button" aria-label="Copy code">
      <span class="copy-button-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M8 8h10v12H8z"></path>
          <path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </span>
      Copy
    </button>
    <pre><code class="language-tsx">import Loader from './Loader'

export function LoadingPanel() {
  return (
    &lt;section aria-live="polite"&gt;
      &lt;h2&gt;Publishing updates&lt;/h2&gt;
      &lt;p&gt;Syncing tokens and generating component docs.&lt;/p&gt;
      &lt;Loader inline label="Publishing" tone="primary" /&gt;
    &lt;/section&gt;
  )
}</code></pre>
  </div>
`

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    language: 'tsx',
    code: `function Button({ label }: { label: string }) {
  return <button type="button">{label}</button>
}`,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(720px, 100%)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CodeBlock>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: htmlCssSource(defaultHtml, componentCss),
}

export const CssTokens: Story = {
  parameters: htmlCssSource(cssTokensHtml, componentCss),
  args: {
    language: 'css',
    code: `:root {
  --primary-color: #2713ff;
  --secondary-color: #ff0059;
  --surface: #f7f5fb;
}`,
  },
}

export const LongSnippet: Story = {
  parameters: htmlCssSource(longSnippetHtml, componentCss),
  args: {
    language: 'tsx',
    code: `import Loader from './Loader'

export function LoadingPanel() {
  return (
    <section aria-live="polite">
      <h2>Publishing updates</h2>
      <p>Syncing tokens and generating component docs.</p>
      <Loader inline label="Publishing" tone="primary" />
    </section>
  )
}`,
  },
}
import type { Meta, StoryObj } from '@storybook/react-vite'
import CodeBlock from './CodeBlock'

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

export const Default: Story = {}

export const CssTokens: Story = {
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
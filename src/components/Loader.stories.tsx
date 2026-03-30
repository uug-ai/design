import type { Meta, StoryObj } from '@storybook/react-vite'
import Loader from './Loader'

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
  parameters: {
    layout: 'centered',
  },
}

export const Inline: Story = {
  parameters: {
    layout: 'centered',
  },
  args: {
    inline: true,
    tone: 'primary',
    label: 'Publishing updates',
  },
}

export const ToneMatrix: Story = {
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
          <strong style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {tone}
          </strong>
          <Loader tone={tone} size="sm" />
          <Loader tone={tone} size="md" />
          <Loader tone={tone} size="lg" />
        </div>
      ))}
    </div>
  ),
}

export const Inverted: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    layout: 'centered',
  },
  args: {
    inline: true,
    inverted: true,
    tone: 'accent',
    label: 'Loading on dark surfaces',
  },
}
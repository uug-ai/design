import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import IsoIllustration from '../../IsoIllustration'
import { ISO_FIGURE_NAMES } from '../../IsoIllustration/figures'

const meta = {
  title: 'Components/Illustrations',
  component: IsoIllustration,
  tags: ['autodocs'],
  args: { figure: 'agent', glow: 'auto' },
  argTypes: {
    figure: { control: 'inline-radio', options: ISO_FIGURE_NAMES },
    glow: { control: 'inline-radio', options: ['auto', 'on', 'off'] },
  },
  decorators: [
    (Story, { parameters }) => <div style={{ width: parameters.isoWidth ?? '260px', maxWidth: '100%', margin: '0 auto' }}>
      <Story />
    </div>,
  ],
  parameters: { docs: { description: { component: 'Isometric line art for empty states (agent), hero backgrounds (control-tower) and explaining Hub (hub). Faces use the Hub card tones and only live parts use the --hub accent, so white-label themes recolour them; set --iso-accent to override. With glow="auto" lit parts glow in the dark Hub theme and stay flat in light. Decorative unless a label is passed. The figures render plain SVG strings (renderIsoSvg), which the Angular Hub frontend and the docs reuse.' } } },
} satisfies Meta<typeof IsoIllustration>

export default meta
type Story = StoryObj<typeof meta>

export const Agent: Story = {}
export const ControlTower: Story = { args: { figure: 'control-tower' }, parameters: { isoWidth: '160px' } }
export const Hub: Story = {
  args: { figure: 'hub', label: 'Hub event flow: a camera event travels through the Agent and the Hub pipeline to a videowall tile and a phone alert.' },
  parameters: { isoWidth: '640px' },
}
export const AccentOverride: Story = {
  render: args => <div style={{ '--iso-accent': 'hsl(205, 74%, 53%)' } as CSSProperties}>
    <IsoIllustration {...args} />
  </div>,
}

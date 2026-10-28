import type { Meta, StoryObj } from '@storybook/react-vite'
import { htmlCssSource } from '../../config/storybookSource'
import componentCss from './component.css?raw'
import IsoIllustration from './component'
import { ISO_FIGURE_NAMES, renderIsoSvg, type IsoFigure } from './figures'

const sourceHtml = (figure: IsoFigure, glow: string, style = '') => `
  <div class="iso-illustration iso-illustration--glow-${glow}" aria-hidden="true"${style ? ` style="${style}"` : ''}>
    ${renderIsoSvg(figure, `iso-${figure}`)}
  </div>
`

const meta = {
  title: 'Components/Iso Illustration',
  component: IsoIllustration,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    figure: {
      control: 'inline-radio',
      options: ISO_FIGURE_NAMES,
    },
    glow: {
      control: 'inline-radio',
      options: ['auto', 'on', 'off'],
    },
  },
  args: {
    figure: 'agent',
    glow: 'auto',
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ width: parameters.isoWidth ?? '280px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IsoIllustration>

export default meta

type Story = StoryObj<typeof meta>

export const Agent: Story = {
  parameters: htmlCssSource(sourceHtml('agent', 'auto', 'width: 240px'), componentCss),
}

export const ControlTower: Story = {
  parameters: htmlCssSource(sourceHtml('control-tower', 'auto', 'width: 260px'), componentCss),
  args: {
    figure: 'control-tower',
  },
}

export const Hub: Story = {
  parameters: htmlCssSource(sourceHtml('hub', 'auto', 'width: 520px'), componentCss, {
    isoWidth: '520px',
  }),
  args: {
    figure: 'hub',
  },
}

export const DarkTheme: Story = {
  parameters: htmlCssSource(
    `<div data-theme="dark" style="padding: 24px; background: var(--background);">${sourceHtml('agent', 'auto', 'width: 240px')}</div>`,
    componentCss,
  ),
  render: (args) => (
    <div data-theme="dark" style={{ padding: '24px', borderRadius: '16px', background: 'var(--background)' }}>
      <IsoIllustration {...args} />
    </div>
  ),
}

export const AccentOverride: Story = {
  parameters: htmlCssSource(
    sourceHtml('agent', 'auto', 'width: 240px; --iso-accent: var(--secondary-color)'),
    componentCss,
  ),
  render: (args) => (
    <div style={{ '--iso-accent': 'var(--secondary-color)' } as React.CSSProperties}>
      <IsoIllustration {...args} />
    </div>
  ),
}

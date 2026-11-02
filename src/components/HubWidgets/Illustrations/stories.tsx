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
  parameters: { docs: { description: { component: 'Isometric line art for empty states (agent), hero backgrounds (control-tower) and explaining Hub (hub), Vault (vault) and Factory (factory), the whole platform at a glance (ecosystem), whose product zones can be links, and a wide banner per docs tutorial (tutorial-*). Faces use the Hub card tones and only live parts use the --hub accent, so white-label themes recolour them; set --iso-accent to override. With glow="auto" lit parts glow in the dark Hub theme and stay flat in light. Decorative unless a label is passed. The figures render plain SVG strings (renderIsoSvg), which the Angular Hub frontend and the docs reuse.' } } },
} satisfies Meta<typeof IsoIllustration>

export default meta
type Story = StoryObj<typeof meta>

export const Agent: Story = {}
export const ControlTower: Story = { args: { figure: 'control-tower' }, parameters: { isoWidth: '160px' } }
export const Hub: Story = {
  args: { figure: 'hub', label: 'Hub event flow: a camera event travels through its own Agent on the site gateway and the Hub pipeline to a videowall tile and a phone alert.' },
  parameters: { isoWidth: '640px' },
}
export const Factory: Story = {
  args: { figure: 'factory', label: 'Factory: each camera on a site gets its own Agent, built by Factory, stamped with the global settings and deployed to a cluster node, where it records that camera.' },
  parameters: { isoWidth: '640px' },
}
export const Vault: Story = {
  args: { figure: 'vault', label: 'Vault: four Agents upload recordings to the Vault, a crane drops each one into the S3, Azure or Ceph bucket its account uses, and Hub reads a recording straight from its bucket.' },
  parameters: { isoWidth: '640px' },
}
const ECOSYSTEM_LINKS = { factory: '#factory', agent: '#agent', vault: '#vault', hub: '#hub' }

export const Ecosystem: Story = {
  args: {
    figure: 'ecosystem',
    label: 'The Kerberos platform: Factory deploys an Agent for every camera, the Agents upload recordings to Vault and send events to Hub, and Hub plays recordings back from Vault.',
    links: ECOSYSTEM_LINKS,
  },
  parameters: {
    isoWidth: '720px',
    docs: {
      description: {
        story: `
A map of the platform for landing pages: every product is a zone, and with \`links\` each zone is a real link (keyboard focusable, announced by name) that lights its outline on hover and focus. The scene runs one product step per 3s beat: deploy, upload, events, playback.

Each zone can take its own colour: set \`--iso-zone-accent\` on \`[data-iso-zone="factory" | "agent" | "vault" | "hub"]\`. This example uses the docs' product colours; without them every zone uses the figure's accent.
`,
      },
    },
  },
  render: args => <div className="iso-zone-colours">
    <style>{`
      .iso-zone-colours [data-iso-zone='agent'] { --iso-zone-accent: #933734; }
      .iso-zone-colours [data-iso-zone='factory'] { --iso-zone-accent: #4a786a; }
      .iso-zone-colours [data-iso-zone='vault'] { --iso-zone-accent: #56618f; }
      .iso-zone-colours [data-iso-zone='hub'] { --iso-zone-accent: #a239d7; }
    `}</style>
    <IsoIllustration {...args} />
  </div>,
}
const TUTORIAL_FIGURES = ISO_FIGURE_NAMES.filter(name => name.startsWith('tutorial-'))

export const TutorialBanners: Story = {
  parameters: {
    isoWidth: '720px',
    docs: {
      description: {
        story: 'Wide 10:3 banners for the docs tutorials, one per tutorial, each animating its subject on a 6s round: Install Agent, Connect any IP camera, Set up your own workflow stage, Deploy a MoQ relay on Kubernetes, MoQ vs HLS vs WebRTC, Set up HLS live view and Set up WebRTC with TURN. Set --iso-accent to the product colour.',
      },
    },
  },
  render: args => <div style={{ display: 'grid', gap: '16px' }}>
    {TUTORIAL_FIGURES.map(figure => <div key={figure} style={{ aspectRatio: '10 / 3', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--card-muted, #ddd)' }}>
      <IsoIllustration {...args} figure={figure} label={figure.replace('tutorial-', '').split('-').join(' ')} />
    </div>)}
  </div>,
}
export const AccentOverride: Story = {
  render: args => <div style={{ '--iso-accent': 'hsl(205, 74%, 53%)' } as CSSProperties}>
    <IsoIllustration {...args} />
  </div>,
}

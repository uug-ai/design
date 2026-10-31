import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailOverview } from './component'

const meta = {
  title: 'Emails/Overview',
  component: EmailOverview,
  parameters: {
    docs: {
      description: {
        component: 'Every email we send customers, with its category and illustration. All of them share one layout: a card with a category colour (License, Account, Security, Detection, Camera status, Usage, Sharing, Tasks) on its top edge, label and button, and a 16:9 isometric spot illustration with the UUG coin, so the purpose of each email reads before its text. Each email has its own page under Emails with examples and its plain-text version. The license emails use hub-license\'s `$placeholders` (plus `$expires`); the others use the `{{placeholders}}` hub-pipeline-notification fills. The illustrations are SVG here; the templates reference 1280 x 720 PNG exports at `https://uug.ai/email/<template>.png`.',
      },
    },
  },
} satisfies Meta<typeof EmailOverview>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {}

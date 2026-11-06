import type { Meta, StoryObj } from '@storybook/react-vite'
import { NavigationExample } from '../examples'

const meta = {
  title: 'Components/Navigation',
  component: NavigationExample,
  tags: ['autodocs'],
  args: { disabled: false, pageActions: false },
  parameters: { docs: { description: { component: 'Hub Breadcrumb, GridToggle, AspectRatioToggle, LanguageSelect and LanguageSwitcher presentations. Layout choices expose pressed state and labels for icon-only buttons. Language selection updates local demo state; it does not install or invoke Hub translation services. Page actions shows a list-page breadcrumb with several actions: outlined Clear filters and Refresh buttons next to an Export menu, as on the Audit page.' } } },
} satisfies Meta<typeof NavigationExample>

export default meta
type Story = StoryObj<typeof meta>
export const BreadcrumbAndLayout: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const PageActions: Story = { args: { pageActions: true } }

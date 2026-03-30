import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  features: {
    sidebarOnboardingChecklist: false,
  },
  framework: '@storybook/react-vite',
  viteFinal: async (config, { configType }) => {
    return mergeConfig(config, {
      base: configType === 'PRODUCTION' ? '/design/storybook/' : '/',
    })
  },
}

export default config
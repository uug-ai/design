import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  theme: create({
    base: 'dark',
    fontBase: 'Outfit, sans-serif',
    fontCode: 'Inter, sans-serif',
    brandTitle: 'UUG',
    brandTarget: '_self',
    colorSecondary: '#ffffff',
    appBg: '#111426',
    appContentBg: '#1a1730',
    appBorderColor: 'rgba(255, 255, 255, 0.08)',
    appBorderRadius: 18,
    barBg: '#0f1222',
    barTextColor: 'rgba(255, 255, 255, 0.76)',
    barSelectedColor: '#ffffff',
    textColor: '#f7f7fb',
    textInverseColor: '#111426',
    inputBg: '#171a2b',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    inputTextColor: '#f7f7fb',
  }),
})
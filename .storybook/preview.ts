import type { Preview } from '@storybook/react-vite'
import { createElement } from 'react'
import '../src/index.css'

const preview: Preview = {
  decorators: [
    (Story, context) => context.parameters.hubVisuals
      ? createElement('div', { className: 'hub-ui hub-ui-example', style: { padding: 12 } }, createElement(Story))
      : createElement(Story),
  ],
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#ffffff' },
        { name: 'surface', value: '#f7f5fb' },
        { name: 'dark', value: '#111426' },
      ],
    },
  },
}

export default preview

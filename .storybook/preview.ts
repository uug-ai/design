import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
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

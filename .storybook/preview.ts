import type { Preview } from '@storybook/react-vite'
import { createElement } from 'react'
import { HubTheme } from '../src/components/HubWidgets/theme'
import '../src/index.css'

const preview: Preview = {
  globalTypes: {
    hubTheme: {
      description: 'Production Hub widget theme',
      toolbar: {
        title: 'Hub theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { hubTheme: 'light' },
  decorators: [
    (Story, context) => createElement(HubTheme, {
      theme: context.globals.hubTheme === 'dark' ? 'dark' : 'light',
      children: createElement(Story),
    }),
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
        { name: 'surface', value: 'hsl(0, 5%, 93%)' },
        { name: 'dark', value: 'hsl(0, 0%, 10%)' },
      ],
    },
  },
}

export default preview

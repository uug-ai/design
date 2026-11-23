import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { HubActivation } from '../activation'
import type { HubActivationState } from '../activation'

const meta = {
  title: 'Areas/Account activation',
  component: HubActivation,
  tags: ['autodocs'],
  args: { state: 'enter', pin: '', onPinChange: () => undefined, onActivate: () => undefined },
  argTypes: {
    state: { control: 'select', options: ['enter', 'verifying', 'success', 'mail-failed', 'already-active', 'invalid', 'error'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The page behind the link in the welcome email (/login/activate/:pin) and the manual PIN entry (/login/activate). One card on the login background: the activate figure, a title and line per state, the five-cell PIN field and one action. Each state follows one answer of POST /activate instead of the single red "not valid, or already activated" message: an already active account is not an error and leads to sign in, an unknown PIN keeps the field editable with the message under it, and a server failure offers to try again. The PIN text always uses the body colour; state shows on the cell border and tint, so it reads in both themes. Pasting fills all five cells; Backspace and the arrow keys move between them.',
      },
    },
  },
} satisfies Meta<typeof HubActivation>

export default meta
type Story = StoryObj<typeof meta>

export const EnterPin: Story = {
  args: { state: 'enter', pin: '' },
  parameters: { docs: { description: { story: 'Opened without a PIN: the first cell has focus and the action waits for all five characters.' } } },
}
export const Verifying: Story = {
  args: { state: 'verifying', pin: 'FBG5J' },
  parameters: { docs: { description: { story: 'Opened from the email link, or right after the fifth character: the cells lock and pulse while the button shows progress. No full-page black overlay.' } } },
}
export const Activated: Story = {
  args: { state: 'success', pin: 'FBG5J' },
  parameters: { docs: { description: { story: 'ACTIVATE_SUCCESS: the badge checks green and the only action is signing in.' } } },
}
export const ActivatedWithoutEmail: Story = {
  args: { state: 'mail-failed', pin: 'FBG5J' },
  parameters: { docs: { description: { story: 'ACTIVATE_MAIL_FAILED: the account is active but the confirmation email did not go out. Today this answer shows as "not valid"; it is a success with a note.' } } },
}
export const AlreadyActive: Story = {
  args: { state: 'already-active', pin: 'FBG5J' },
  parameters: { docs: { description: { story: 'ACTIVATE_ALREADY_DONE: the link was opened a second time. Not an error, so no red: send the user to sign in, with the password reset close by.' } } },
}
export const InvalidPin: Story = {
  args: { state: 'invalid', pin: 'FBG5J' },
  parameters: { docs: { description: { story: 'ACTIVATE_TOKEN_NOT_VALID / ACTIVATE_TOKEN_NOT_FOUND: red borders, readable characters, the message under the field (announced as an alert) and the field still editable.' } } },
}
export const ServerError: Story = {
  args: { state: 'error', pin: 'FBG5J' },
  parameters: { docs: { description: { story: 'ACTIVATE_FAILED or no answer: the PIN stays as typed and the button retries.' } } },
}

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Type or paste a PIN. 7KQ2M activates, A1B2C is already active, Z9Z9Z fails on the server and any other PIN is unknown.' } } },
  render: function PlaygroundStory() {
    const [state, setState] = useState<HubActivationState>('enter')
    const [pin, setPin] = useState('')
    const [checking, setChecking] = useState<string | null>(null)
    useEffect(() => {
      if (!checking) return
      const timer = window.setTimeout(() => {
        setState(checking === '7KQ2M' ? 'success' : checking === 'A1B2C' ? 'already-active' : checking === 'Z9Z9Z' ? 'error' : 'invalid')
        setChecking(null)
      }, 900)
      return () => window.clearTimeout(timer)
    }, [checking])
    return <HubActivation state={state} pin={pin}
      onPinChange={(next) => { setPin(next); if (state === 'invalid' || state === 'error') setState('enter') }}
      onActivate={(next) => { setState('verifying'); setChecking(next) }}
      onSignIn={() => { setState('enter'); setPin('') }} />
  },
}

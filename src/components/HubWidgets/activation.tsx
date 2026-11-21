import { useEffect, useRef } from 'react'
import type { ClipboardEvent, FormEvent, KeyboardEvent } from 'react'
import { ArrowLeft, Mail } from 'iconoir-react'
import IsoIllustration from '../IsoIllustration'
import { HubButton } from './controls'
import { HubInfobox } from './feedback'
import './activation.css'

export const PIN_LENGTH = 5

/**
 * What the activation screen shows. Each state follows one answer of
 * POST /activate, so the page no longer folds them into one red error:
 * - enter: no PIN yet (opened from /login/activate)
 * - verifying: the PIN is being checked (also on arrival from the email link)
 * - success: ACTIVATE_SUCCESS
 * - mail-failed: ACTIVATE_MAIL_FAILED, activated but the confirmation email bounced
 * - already-active: ACTIVATE_ALREADY_DONE, not an error: point to sign in
 * - invalid: ACTIVATE_TOKEN_NOT_VALID or ACTIVATE_TOKEN_NOT_FOUND
 * - error: ACTIVATE_FAILED or no answer, try again later
 */
export type HubActivationState = 'enter' | 'verifying' | 'success' | 'mail-failed' | 'already-active' | 'invalid' | 'error'

const COPY: Record<HubActivationState, { title: string; text: string }> = {
  enter: {
    title: 'Activate your account',
    text: 'Enter the 5-character PIN from your welcome email.',
  },
  verifying: {
    title: 'Activating your account',
    text: 'Checking your PIN, this only takes a moment.',
  },
  success: {
    title: 'Your account is active',
    text: 'You are all set. We sent a confirmation to your email; sign in to start using Hub.',
  },
  'mail-failed': {
    title: 'Your account is active',
    text: 'You are all set; sign in to start using Hub.',
  },
  'already-active': {
    title: 'Your account is already active',
    text: 'This PIN was used before, so there is nothing left to do. Sign in with your email and password.',
  },
  invalid: {
    title: 'Activate your account',
    text: 'Enter the 5-character PIN from your welcome email.',
  },
  error: {
    title: 'Activate your account',
    text: 'Enter the 5-character PIN from your welcome email.',
  },
}

const ACCENT: Record<HubActivationState, string | undefined> = {
  enter: undefined,
  verifying: undefined,
  success: 'var(--success)',
  'mail-failed': 'var(--success)',
  'already-active': 'var(--success)',
  invalid: 'var(--alert)',
  error: 'var(--alert)',
}

const DONE: HubActivationState[] = ['success', 'mail-failed', 'already-active']

const clean = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '')

/** Five single-character cells that act as one field: typing advances, Backspace goes back, a paste fills them all. */
export function HubPinInput({ value, onChange, onComplete, invalid = false, disabled = false, autoFocus = false, describedBy }: {
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  invalid?: boolean
  disabled?: boolean
  autoFocus?: boolean
  describedBy?: string
}) {
  const cells = useRef<Array<HTMLInputElement | null>>([])
  const chars = Array.from({ length: PIN_LENGTH }, (_, i) => value[i] ?? '')

  useEffect(() => {
    if (autoFocus && !disabled) cells.current[Math.min(value.length, PIN_LENGTH - 1)]?.focus()
    // Only on mount and when the field unlocks again after a check.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus, disabled])

  const update = (next: string, focus: number) => {
    const pin = clean(next).slice(0, PIN_LENGTH)
    onChange(pin)
    cells.current[Math.max(0, Math.min(focus, PIN_LENGTH - 1))]?.focus()
    if (pin.length === PIN_LENGTH) onComplete?.(pin)
  }

  const onInput = (index: number, event: FormEvent<HTMLInputElement>) => {
    const typed = clean(event.currentTarget.value).slice(-1)
    if (!typed) return
    const next = chars.slice()
    next[index] = typed
    update(next.join(''), index + 1)
  }

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault()
      const next = chars.slice()
      const at = chars[index] ? index : index - 1
      if (at < 0) return
      next.splice(at, 1)
      update(next.join(''), at)
    } else if (event.key === 'ArrowLeft') {
      cells.current[index - 1]?.focus()
    } else if (event.key === 'ArrowRight') {
      cells.current[index + 1]?.focus()
    }
  }

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = clean(event.clipboardData.getData('text'))
    update(pasted, pasted.length)
  }

  return (
    <div className={`hub-pin ${invalid ? 'is-invalid' : ''}`} role="group" aria-label="Activation PIN" aria-describedby={describedBy}>
      {chars.map((char, index) => (
        <input key={index} ref={(el) => { cells.current[index] = el }}
          className="hub-pin-cell" value={char} disabled={disabled}
          inputMode="text" autoCapitalize="characters" autoComplete={index === 0 ? 'one-time-code' : 'off'} spellCheck={false}
          maxLength={PIN_LENGTH} aria-label={`Character ${index + 1} of ${PIN_LENGTH}`} aria-invalid={invalid || undefined}
          onFocus={(event) => event.currentTarget.select()}
          onInput={(event) => onInput(index, event)} onChange={() => undefined}
          onKeyDown={(event) => onKeyDown(index, event)} onPaste={onPaste} />
      ))}
    </div>
  )
}

/** The Hub account activation screen (/login/activate and /login/activate/:pin). */
export function HubActivation({ state, pin, onPinChange, onActivate, onSignIn, brand = 'Hub' }: {
  state: HubActivationState
  pin: string
  onPinChange: (pin: string) => void
  onActivate: (pin: string) => void
  onSignIn?: () => void
  brand?: string
}) {
  const done = DONE.includes(state)
  const verifying = state === 'verifying'
  const copy = COPY[state]
  const accent = ACCENT[state]

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (pin.length === PIN_LENGTH && !verifying) onActivate(pin)
  }

  return (
    <div className={`hub-activation hub-activation--${state}`}>
      <main className="hub-activation-card">
        <div className="hub-activation-figure" style={accent ? { ['--iso-accent' as string]: accent } : undefined}>
          <IsoIllustration figure="activate" className={done ? '' : 'is-pending'} />
        </div>

        <form className="hub-activation-body" onSubmit={submit} noValidate aria-busy={verifying || undefined}>
          <h1 className="hub-activation-title">{copy.title}</h1>
          <p className="hub-activation-text">{copy.text}</p>

          {!done && <>
            <HubPinInput value={pin} onChange={onPinChange} onComplete={onActivate}
              invalid={state === 'invalid'} disabled={verifying} autoFocus
              describedBy={state === 'invalid' ? 'hub-activation-error' : undefined} />

            {state === 'invalid' && <p id="hub-activation-error" className="hub-activation-error" role="alert">
              This PIN does not match an account. Check the 5 characters in your welcome email and try again.
            </p>}

            {state === 'error' && <HubInfobox tone="error" className="hub-activation-note">
              We could not activate your account right now. Try again in a moment.
            </HubInfobox>}

            <HubButton type="submit" className="hub-activation-action" loading={verifying}
              disabled={pin.length < PIN_LENGTH || verifying}>
              {verifying ? 'Activating…' : state === 'error' ? 'Try again' : 'Activate account'}
            </HubButton>
          </>}

          {state === 'mail-failed' && <HubInfobox tone="warning" className="hub-activation-note">
            We could not send the confirmation email. You do not need it to sign in.
          </HubInfobox>}

          {done && <HubButton type="button" className="hub-activation-action" onClick={onSignIn}>
            Sign in to {brand}
          </HubButton>}
        </form>

        <footer className="hub-activation-footer">
          {done
            ? <a href="#forgot-password">Forgot your password?</a>
            : <>
              <span className="hub-activation-hint"><Mail width={16} height={16} aria-hidden="true" />No email? Check your spam folder.</span>
              <a href="#login"><ArrowLeft width={16} height={16} aria-hidden="true" />Back to sign in</a>
            </>}
        </footer>
      </main>
    </div>
  )
}

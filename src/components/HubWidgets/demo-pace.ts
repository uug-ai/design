// Timing for the self-playing Demo stories (Areas). 1 is the base timing each
// demo is written in, higher is slower: typing, pauses between screens and
// simulated server answers all scale with it.
export const DEMO_PACE = 1.6

/** Typing speed for userEvent.setup({ delay }), in milliseconds per key. */
export const DEMO_TYPING_DELAY = 55 * DEMO_PACE

/** Waits so an audience can read a screen before the next action. */
export const pause = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms * DEMO_PACE))

export const cookieConsentKey = 'uug-analytics-consent'
export const cookiePreferencesEvent = 'uug:analytics-preferences'

export type CookieConsent = 'granted' | 'denied'

export function getCookieConsent(): CookieConsent | null {
  const stored = window.localStorage.getItem(cookieConsentKey)
  if (stored === 'granted' || stored === 'denied') return stored
  if (stored !== null) console.warn('Unrecognized cookie preference; asking again.')
  return null
}

export function setCookieConsent(consent: CookieConsent) {
  window.localStorage.setItem(cookieConsentKey, consent)
}

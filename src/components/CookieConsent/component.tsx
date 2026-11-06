import { useEffect, useRef, useState } from 'react'
import {
  cookieConsentKey,
  cookiePreferencesEvent,
  getCookieConsent,
  setCookieConsent,
  type CookieConsent,
} from '../../config/cookieConsent'
import './component.css'

function CookieConsentNotice() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const synchronize = () => {
      try {
        setOpen(getCookieConsent() === null)
        setError('')
      } catch (storageError) {
        console.warn('Cookie preferences could not be read.', storageError)
        setOpen(true)
        setError('Your cookie preference could not be read. Check your browser storage settings.')
      }
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === cookieConsentKey || event.key === null) synchronize()
    }
    const showPreferences = () => {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      headingRef.current?.focus()
      setOpen(true)
    }
    synchronize()
    window.addEventListener('storage', onStorage)
    window.addEventListener(cookiePreferencesEvent, showPreferences)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(cookiePreferencesEvent, showPreferences)
    }
  }, [])

  useEffect(() => {
    if (open && triggerRef.current) headingRef.current?.focus()
  }, [open])

  const choose = (consent: CookieConsent) => {
    try {
      setCookieConsent(consent)
      setError('')
      setOpen(false)
      triggerRef.current?.focus()
      triggerRef.current = null
    } catch (storageError) {
      console.warn('Cookie preferences could not be saved.', storageError)
      setError('Your preference could not be saved. Check your browser storage settings.')
    }
  }

  if (!open) return null

  return (
    <section className="cookie-consent" aria-labelledby="cookie-consent-heading">
      <h2 id="cookie-consent-heading" ref={headingRef} tabIndex={-1}>
        Cookie settings
      </h2>
      <p>
        This design site remembers essential preferences only. No analytics or advertising
        trackers are loaded, regardless of your choice. <a href="https://uug.ai/privacy/">Privacy policy</a>
      </p>
      {error && <p role="alert">{error}</p>}
      <div className="cookie-consent-actions">
        <button type="button" onClick={() => choose('granted')}>
          Accept cookies
        </button>
        <button type="button" onClick={() => choose('denied')}>
          Reject cookies
        </button>
      </div>
    </section>
  )
}

export default CookieConsentNotice

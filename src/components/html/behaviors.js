const initialized = new WeakMap()

/** Optional native behavior. Framework consumers can bind their own events instead. */
export function enhanceComponents(root = document) {
  const components = [...root.querySelectorAll('[data-ui-component]')]
  if (root instanceof Element && root.matches('[data-ui-component]')) components.unshift(root)
  const cleanups = []

  for (const component of components) {
    if (initialized.has(component)) continue
    const listeners = []
    const on = (element, type, handler) => {
      element.addEventListener(type, handler)
      listeners.push(() => element.removeEventListener(type, handler))
    }

    switch (component.dataset.uiComponent) {
      case 'segmented-control': {
        const options = [...component.querySelectorAll('button[data-value]')]
        on(component, 'click', (event) => {
          const button = event.target instanceof Element ? event.target.closest('button[data-value]') : null
          if (!options.includes(button) || button.matches(':disabled')) return
          for (const option of options) option.setAttribute('aria-pressed', String(option === button))
          component.dispatchEvent(new CustomEvent('ui:change', {
            bubbles: true,
            detail: { value: button.dataset.value },
          }))
        })
        break
      }
      case 'search-field': {
        const input = component.querySelector('input[type="search"]')
        const clear = component.querySelector('[data-ui-clear]')
        if (!(input instanceof HTMLInputElement) || !(clear instanceof HTMLButtonElement)) {
          throw new Error('Search field requires a search input and a data-ui-clear button')
        }
        const update = () => {
          clear.hidden = input.value === ''
          clear.disabled = input.matches(':disabled')
        }
        update()
        on(input, 'input', update)
        on(clear, 'click', () => {
          if (input.matches(':disabled')) return
          input.value = ''
          input.dispatchEvent(new Event('input', { bubbles: true }))
          input.focus()
        })
        break
      }
      case 'notice': {
        const dismiss = component.querySelector('[data-ui-dismiss]')
        if (!dismiss) break
        const restore = component.closest('[data-ui-notice-example]')?.querySelector('[data-ui-restore]')
        on(dismiss, 'click', () => {
          component.hidden = true
          if (restore instanceof HTMLButtonElement) {
            restore.disabled = false
            restore.focus()
          }
          component.dispatchEvent(new CustomEvent('ui:dismiss', { bubbles: true }))
        })
        if (restore instanceof HTMLButtonElement) {
          on(restore, 'click', () => {
            component.hidden = false
            restore.disabled = true
            dismiss.focus()
          })
        }
        break
      }
      default:
        throw new Error(`Unknown native component: ${component.dataset.uiComponent}`)
    }

    const cleanup = () => {
      for (const remove of listeners) remove()
      initialized.delete(component)
    }
    initialized.set(component, cleanup)
    cleanups.push(cleanup)
  }

  return () => {
    for (const cleanup of cleanups) cleanup()
  }
}

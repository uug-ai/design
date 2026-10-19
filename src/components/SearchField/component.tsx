import { useId, useRef } from 'react'
import { Xmark } from 'iconoir-react'
import HubIcon from '../html/HubIcon'
import './component.css'

export interface SearchFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  clearLabel?: string
  /** Optional extension; Hub's existing SearchField has no clear button. */
  showClear?: boolean
}

/** Controlled query input; fetching, debounce and result announcements belong to the caller. */
export default function SearchField({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  clearLabel = 'Clear search',
  showClear = false,
}: SearchFieldProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="query-field">
      <label htmlFor={id} className="query-field__label">{label}</label>
      <div className="query-field__control">
        <HubIcon name="search" />
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        {showClear && value && (
          <button
            type="button"
            className="query-field__clear"
            aria-label={clearLabel}
            disabled={disabled}
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
          >
            <Xmark width={18} height={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

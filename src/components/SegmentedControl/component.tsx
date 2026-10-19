import type { ReactNode } from 'react'
import './component.css'

export interface SegmentOption {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps {
  label: string
  options: readonly SegmentOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  iconOnly?: boolean
}

/** A button group, not tabs: consumers own the filtered view and selected value. */
export default function SegmentedControl({
  label,
  options,
  value,
  onChange,
  disabled = false,
  iconOnly = false,
}: SegmentedControlProps) {
  return (
    <div className="segmented-control" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="segmented-control__option"
          aria-pressed={value === option.value}
          aria-label={iconOnly && option.icon ? option.label : undefined}
          title={iconOnly && option.icon ? option.label : undefined}
          disabled={disabled || option.disabled}
          onClick={() => onChange(option.value)}
        >
          {option.icon && <span className="segmented-control__icon" aria-hidden="true">{option.icon}</span>}
          {(!iconOnly || !option.icon) && <span>{option.label}</span>}
        </button>
      ))}
    </div>
  )
}

import './component.css'

interface ColorSwatchProps {
  name: string
  value: string
  variable?: string
}

function ColorSwatch({ name, value, variable }: ColorSwatchProps) {
  return (
    <div className="color-swatch">
      <div className="color-preview" style={{ background: value }} aria-label={`Color: ${name}`} />
      <div className="color-info">
        <div className="color-name">{name}</div>
        <div className="color-value">{value}</div>
        {variable && <div className="color-variable">var({variable})</div>}
      </div>
    </div>
  )
}

export default ColorSwatch
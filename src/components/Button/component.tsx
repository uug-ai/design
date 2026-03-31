import './component.css'

function ButtonShowcase() {
  return (
    <div className="demo-area">
      <button className="btn btn-primary">Primary Button</button>
      <button className="btn btn-secondary">Secondary Button</button>
      <button className="btn btn-primary" disabled>
        Disabled Button
      </button>
    </div>
  )
}

export default ButtonShowcase
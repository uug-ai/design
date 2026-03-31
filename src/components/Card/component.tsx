import '../Button/component.css'
import './component.css'

function CardShowcase() {
  return (
    <div className="demo-area">
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Card Title</h3>
        <p>Card content goes here with descriptive text that explains the card's purpose.</p>
        <button className="btn btn-primary">Action</button>
      </div>
    </div>
  )
}

export default CardShowcase
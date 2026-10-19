import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Colors from './pages/Colors'
import Typography from './pages/Typography'
import Spacing from './pages/Spacing'
import Branding from './pages/Branding'
import Components from './pages/Components'
import './App.css'

function App() {
  const { hash } = useLocation()
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/colors" element={<Colors />} />
        <Route path="/typography" element={<Typography />} />
        <Route path="/spacing" element={<Spacing />} />
        <Route path="/branding" element={<Branding />} />
        <Route path="/components" element={<Components />} />
        <Route path="/hub-patterns" element={<Navigate to={`/components${hash}`} replace />} />
      </Routes>
    </Layout>
  )
}

export default App

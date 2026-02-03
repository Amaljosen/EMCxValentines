import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Create from './Create'
import View from './View'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/create" />} />
        <Route path="/create" element={<Create />} />
        <Route path="/view/:gameId" element={<View />} />
      </Routes>
    </Router>
  )
}

export default App
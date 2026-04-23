import {Routes, Route} from 'react-router'
import Auth from '../auth/page/main.tsx'
import Directory from '../directory/page/main.tsx'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/about" element={<h1>About</h1>} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/directorio" element={<Directory />} />
    </Routes>
  )
}

export default AppRouter
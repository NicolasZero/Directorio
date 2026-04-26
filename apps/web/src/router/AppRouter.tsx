import {Routes, Route} from 'react-router'
import Auth from '../auth/page/main.tsx'
import Directory from '../directory/page/main.tsx'
import Home from '../home/page/main.tsx'
import MainLayout from '../layaout.tsx'

function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/clases" element={<h1>Clases</h1>} />
        <Route path="/clases" element={<h1>Mapa</h1>} />
        <Route path="/directorio" element={<Directory />} />
      </Route>

      {/* Private */}
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default AppRouter
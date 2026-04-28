import { Routes, Route } from 'react-router'
// Routes
import Auth from '../modules/auth/page/login.tsx'
import Directory from '../modules/directory/page/mainDirectory.tsx'
import Home from '../modules/home/page/mainHome.tsx'
import Map from '../modules/map/page/mainMap.tsx'
// layouts
import MainLayout from '../layaout.tsx'

function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path='/' element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/conocenos" element={<h1>Conócenos</h1>} />
        <Route path="/clases" element={<h1>Clases</h1>} />
        <Route path="/mapa" element={<Map />} />
        <Route path="/directorio" element={<Directory />} />
      </Route>

      {/* Private */}
      <Route path="/auth/login" element={<Auth />} />
    </Routes>
  )
}

export default AppRouter
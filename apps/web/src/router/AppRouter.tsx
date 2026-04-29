import { Routes, Route } from 'react-router'
// Routes
import Auth from '../modules/auth/page/login.tsx'
import Directory from '../modules/directory/page/mainDirectory.tsx'
import DirectoryDetail from '../modules/directory/page/directoryDetail.tsx'
import Home from '../modules/home/page/homePage.tsx'
import Map from '../modules/map/page/mainMap.tsx'
import Classes from '../modules/classes/page/classesMain.tsx'
import CourseDetail from '../modules/classes/page/courseDetail.tsx'
import About from '../modules/about/page/about.tsx'

// layouts
import MainLayout from '../layaout.tsx'

function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path='/' element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/conocenos" element={<About />} />
        <Route path="/clases" element={<Classes />} />
        <Route path="/clases/curso/:id" element={<CourseDetail />} />
        <Route path="/mapa" element={<Map />} />
        <Route path="/directorio" element={<Directory />} />
        <Route path="/directorio/:id" element={<DirectoryDetail />} />
      </Route>

      {/* Private */}
      <Route path="/auth/login" element={<Auth />} />
    </Routes>
  )
}

export default AppRouter
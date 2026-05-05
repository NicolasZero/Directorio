import { Routes, Route } from 'react-router'
import React, { Suspense } from 'react'
import Loading from '@/components/loading'
import NotFound from '@/components/not-found'

// Routes
const Login = React.lazy(() => import('../modules/auth/page/login'))
const Directory = React.lazy(() => import('../modules/directory/page/mainDirectory.tsx'))
const DirectoryDetail = React.lazy(() => import('../modules/directory/page/directoryDetail.tsx'))
const Home = React.lazy(() => import('../modules/home/page/homePage.tsx'))
const Map = React.lazy(() => import('../modules/map/page/mainMap.tsx'))
const Classes = React.lazy(() => import('../modules/classes/page/classesMain.tsx'))
const CourseDetail = React.lazy(() => import('../modules/classes/page/classesDetail.tsx'))
const About = React.lazy(() => import('../modules/about/page/about.tsx'))

// layouts
import MainLayout from '../layaout.tsx'

function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
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
        <Route path="/auth/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
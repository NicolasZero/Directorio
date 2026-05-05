import { Routes, Route } from 'react-router'
import React, { Suspense } from 'react'
import Loading from '@/components/loading'

// Routes
const Login = React.lazy(() => import('../modules/auth/page/login'))
const Directory = React.lazy(() => import('../modules/directory/page/mainDirectory.tsx'))
const DirectoryDetail = React.lazy(() => import('../modules/directory/page/directoryDetail.tsx'))
const Home = React.lazy(() => import('../modules/home/page/homePage.tsx'))
const Map = React.lazy(() => import('../modules/map/page/mainMap.tsx'))
const Classes = React.lazy(() => import('../modules/classes/page/classesMain.tsx'))
const CourseDetail = React.lazy(() => import('../modules/classes/page/classesDetail.tsx'))
const About = React.lazy(() => import('../modules/about/page/about.tsx'))
const NotFound = React.lazy(() => import('@/components/not-found.tsx'))

// Private routes
const PrivateRouter = React.lazy(() => import('@/router/privateRouter.tsx'))

// layouts
const MainLayout = React.lazy(() => import('@/layout/mainLayaout.tsx'))

type Status = 'checking' | 'authenticated' | 'no-authenticated'
let status: Status = 'no-authenticated'

function AppRouter() {
  if (status === 'checking') return <Loading />
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/conocenos" element={<About />} />
          <Route path="/clases" element={<Classes />} />
          <Route path="/clases/curso/:id" element={<CourseDetail />} />
          <Route path="/mapa" element={<Map />} />
          <Route path="/directorio" element={<Directory />} />
          <Route path="/directorio/:id" element={<DirectoryDetail />} />
        </Route>
        {/* Public routes - without layout */}
        <Route path="/auth/login" element={<Login />} />
        {/* Private routes - without layout */}
        {
          status === 'authenticated' && (
            <Route path="/admin/*" element={<PrivateRouter />} />
          )
        }
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
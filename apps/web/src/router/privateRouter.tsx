import { Routes, Route, Navigate } from 'react-router'
import React from 'react'
import Loading from '@/components/loading.tsx'
import { useAuth } from '@/context/authContext.tsx'

const HomeAdminPage = React.lazy(() => import('@/modules/home/page/homeAdminPage.tsx'))
const EditDirectory = React.lazy(() => import('@/modules/directory/page/directoryList'))
const DirectoryForm = React.lazy(() => import('@/modules/directory/page/addDirectory.tsx'))
const EditClass = React.lazy(() => import('@/modules/classes/page/classList'))
const ClassForm = React.lazy(() => import('@/modules/classes/page/addClass.tsx'))
const UserList = React.lazy(() => import('@/modules/user/page/userList.tsx'))
const AdminLayout = React.lazy(() => import('@/layout/adminLayout.tsx'))
const EditAbout = React.lazy(() => import('@/modules/about/page/editAbout.tsx'))

export default function PrivateRouter() {
    const { status } = useAuth()
    if (status === 'checking') return <Loading />
    if (status !== 'authenticated') return <Navigate to="/auth/login" replace />

    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path='inicio' element={<HomeAdminPage />} />
                <Route path="directorio" element={<EditDirectory />} />
                <Route path="directorio/nuevo" element={<DirectoryForm />} />
                <Route path="directorio/editar/:id" element={<DirectoryForm />} />
                <Route path='clases' element={<EditClass />} />
                <Route path='clases/nuevo' element={<ClassForm />} />
                <Route path='clases/editar/:id' element={<ClassForm />} />
                <Route path='usuarios' element={<UserList />} />
                <Route path='about' element={<EditAbout />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin/inicio" replace />} />
        </Routes>
    )
}
import { Routes, Route, Navigate } from 'react-router'
import React from 'react'
import Loading from '@/components/loading.tsx'
import { useAuth } from '@/context/authContext.tsx'

const EditDirectory = React.lazy(() => import('@/modules/directory/page/editDirectory.tsx'))
const AddDirectory = React.lazy(() => import('@/modules/directory/page/addDirectory.tsx'))
const AdminLayout = React.lazy(() => import('@/layout/adminLayout.tsx'))

export default function PrivateRouter() {
    const { status } = useAuth()
    if (status === 'checking') return <Loading />
    if (status !== 'authenticated') return <Navigate to="/auth/login" replace />

    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path='inicio' element={<h1>Welcome Admin</h1>} />
                <Route path="directorio" element={<EditDirectory />} />
                <Route path="directorio/nuevo" element={<AddDirectory />} />
                <Route path='clases' element={<h1>Class Edit Page</h1>} />

            </Route>
            <Route path="*" element={<Navigate to="/admin/inicio" replace />} />
        </Routes>
    )
}
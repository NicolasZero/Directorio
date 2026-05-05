import { Routes, Route } from 'react-router'
import React from 'react'

const EditDirectory = React.lazy(() => import('../modules/directory/page/editDirectory.tsx'))
const AdminLayout = React.lazy(() => import('@/layout/adminLayout.tsx'))
const NotFound = React.lazy(() => import('@/components/not-found.tsx'))

export default function PrivateRouter() {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<h1>Home Admin</h1>} />
                <Route path="directorio" element={<EditDirectory />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
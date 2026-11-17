import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import Layout from '../components/Layout.jsx'

/* Carga diferida: cada página se descarga solo cuando se visita por primera vez. */
const Inicio = lazy(() => import('../pages/Inicio.jsx'))
const Categoria = lazy(() => import('../pages/Categoria.jsx'))
const DetalleLibro = lazy(() => import('../pages/DetalleLibro.jsx'))
const MiLista = lazy(() => import('../pages/MiLista.jsx'))
const NotFound = lazy(() => import('../pages/NotFound.jsx'))

/** Todas las rutas del sitio, anidadas bajo <Layout> (encabezado + <Outlet>). */
function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="categorias/:slug" element={<Categoria />} />
        <Route path="libros/:id" element={<DetalleLibro />} />
        <Route path="mi-lista" element={<MiLista />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

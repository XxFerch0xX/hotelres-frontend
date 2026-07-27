import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Clientes from './pages/Clientes'
import Habitaciones from './pages/Habitaciones'
import Reservas from './pages/Reservas'
import Facturacion from './pages/Facturacion'
import Finanzas from './pages/Finanzas'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="sidebar">
          <h2>🏨 HotelRes</h2>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/usuarios">Usuarios</NavLink>
          <NavLink to="/clientes">Clientes</NavLink>
          <NavLink to="/habitaciones">Habitaciones</NavLink>
          <NavLink to="/reservas">Reservas</NavLink>
          <NavLink to="/facturacion">Facturación</NavLink>
          <NavLink to="/finanzas">Finanzas</NavLink>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/habitaciones" element={<Habitaciones />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/finanzas" element={<Finanzas />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

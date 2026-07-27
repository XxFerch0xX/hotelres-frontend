import { useState, useEffect } from 'react'
import { clienteService, habitacionService, reservaService } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ clientes: 0, habitaciones: 0, reservas: 0, activas: 0 })

  useEffect(() => {
    Promise.all([
      clienteService.listar().catch(() => ({ data: [] })),
      habitacionService.listar().catch(() => ({ data: [] })),
      reservaService.listar().catch(() => ({ data: [] })),
      reservaService.activas().catch(() => ({ data: [] })),
    ]).then(([c, h, r, a]) => {
      setStats({ clientes: c.data.length, habitaciones: h.data.length, reservas: r.data.length, activas: a.data.length })
    })
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-card">
          <div className="number">{stats.clientes}</div>
          <div className="label">Clientes</div>
        </div>
        <div className="stat-card">
          <div className="number">{stats.habitaciones}</div>
          <div className="label">Habitaciones</div>
        </div>
        <div className="stat-card">
          <div className="number">{stats.reservas}</div>
          <div className="label">Reservas Totales</div>
        </div>
        <div className="stat-card">
          <div className="number">{stats.activas}</div>
          <div className="label">Huéspedes Activos</div>
        </div>
      </div>
      <div className="card">
        <h2>Bienvenido a HotelRes</h2>
        <p style={{marginTop: '10px', color: '#666'}}>
          Sistema de Gestión de Reservas de Hoteles. Utilice el menú lateral para navegar entre los módulos.
        </p>
      </div>
    </div>
  )
}

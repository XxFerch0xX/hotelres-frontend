import { useState, useEffect } from 'react'
import { reservaService, clienteService, habitacionService } from '../services/api'

const ESTADOS = { PENDIENTE: 'badge-gray', CONFIRMADA: 'badge-blue', EN_CURSO: 'badge-green', COMPLETADA: 'badge-orange', CANCELADA: 'badge-red' }

export default function Reservas() {
  const [reservas, setReservas] = useState([])
  const [clientes, setClientes] = useState([])
  const [habitaciones, setHabitaciones] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ cliente_id: '', habitacion_ids: [], fecha_checkin: '', fecha_checkout: '', num_huespedes: 1, usuario_id: 1 })
  const [msg, setMsg] = useState(null)

  const cargar = () => {
    reservaService.listar().then(r => setReservas(r.data)).catch(() => {})
    clienteService.listar().then(r => setClientes(r.data)).catch(() => {})
    habitacionService.disponibles().then(r => setHabitaciones(r.data)).catch(() => {})
  }
  useEffect(() => { cargar() }, [])

  const guardar = async (e) => {
    e.preventDefault()
    try {
      await reservaService.crear({ ...form, cliente_id: Number(form.cliente_id), habitacion_ids: form.habitacion_ids.map(Number), num_huespedes: Number(form.num_huespedes), usuario_id: Number(form.usuario_id) })
      setShowModal(false)
      setMsg({ type: 'success', text: 'Reserva creada' })
      cargar()
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.detail || 'Error' }) }
  }

  const accion = async (id, tipo) => {
    try {
      if (tipo === 'checkin') await reservaService.checkin(id)
      else if (tipo === 'checkout') await reservaService.checkout(id)
      else if (tipo === 'cancelar') {
        const motivo = prompt('Motivo de cancelación:')
        if (!motivo) return
        await reservaService.cancelar(id, { motivo_cancelacion: motivo })
      }
      setMsg({ type: 'success', text: `${tipo} realizado correctamente` })
      cargar()
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.detail || 'Error' }) }
  }

  const getNombreCliente = (id) => { const c = clientes.find(c => c.id === id); return c ? `${c.nombres} ${c.apellidos}` : id }

  return (
    <div>
      <h1>Gestión de Reservas</h1>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="toolbar">
        <span>{reservas.length} reservas</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nueva Reserva</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>ID</th><th>Cliente</th><th>Check-in</th><th>Check-out</th><th>Huéspedes</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {reservas.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td><td>{getNombreCliente(r.cliente_id)}</td><td>{r.fecha_checkin}</td><td>{r.fecha_checkout}</td>
                <td>{r.num_huespedes}</td>
                <td><span className={`badge ${ESTADOS[r.estado]}`}>{r.estado}</span></td>
                <td style={{ display: 'flex', gap: '5px' }}>
                  {(r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA') && <button className="btn btn-success btn-sm" onClick={() => accion(r.id, 'checkin')}>Check-in</button>}
                  {r.estado === 'EN_CURSO' && <button className="btn btn-warning btn-sm" onClick={() => accion(r.id, 'checkout')}>Check-out</button>}
                  {(r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA') && <button className="btn btn-danger btn-sm" onClick={() => accion(r.id, 'cancelar')}>Cancelar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva Reserva</h2>
            <form onSubmit={guardar}>
              <div className="form-group"><label>Cliente</label>
                <select required value={form.cliente_id} onChange={e => setForm({...form, cliente_id: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nombres} {c.apellidos} - {c.cedula_pasaporte}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Habitación</label>
                <select required value={form.habitacion_ids[0] || ''} onChange={e => setForm({...form, habitacion_ids: [e.target.value]})}>
                  <option value="">Seleccionar...</option>
                  {habitaciones.map(h => <option key={h.id} value={h.id}>Hab. {h.numero} - Piso {h.piso}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Check-in</label><input type="date" required value={form.fecha_checkin} onChange={e => setForm({...form, fecha_checkin: e.target.value})} /></div>
                <div className="form-group"><label>Check-out</label><input type="date" required value={form.fecha_checkout} onChange={e => setForm({...form, fecha_checkout: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Número de huéspedes</label><input type="number" min="1" required value={form.num_huespedes} onChange={e => setForm({...form, num_huespedes: e.target.value})} /></div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear Reserva</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { habitacionService } from '../services/api'

const ESTADOS = { DISPONIBLE: 'badge-green', RESERVADA: 'badge-blue', OCUPADA: 'badge-orange', MANTENIMIENTO: 'badge-gray', FUERA_SERVICIO: 'badge-red' }

export default function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([])
  const [tipos, setTipos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showTipoModal, setShowTipoModal] = useState(false)
  const [form, setForm] = useState({ numero: '', piso: '', tipo_habitacion_id: '', descripcion_amenidades: '' })
  const [tipoForm, setTipoForm] = useState({ nombre: '', capacidad_maxima: '', tarifa_base: '' })
  const [msg, setMsg] = useState(null)

  const cargar = () => {
    habitacionService.listar().then(r => setHabitaciones(r.data)).catch(() => {})
    habitacionService.listarTipos().then(r => setTipos(r.data)).catch(() => {})
  }
  useEffect(() => { cargar() }, [])

  const guardarHab = async (e) => {
    e.preventDefault()
    try {
      await habitacionService.crear({ ...form, piso: Number(form.piso), tipo_habitacion_id: Number(form.tipo_habitacion_id) })
      setShowModal(false)
      setMsg({ type: 'success', text: 'Habitación creada' })
      cargar()
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.detail || 'Error' }) }
  }

  const guardarTipo = async (e) => {
    e.preventDefault()
    try {
      await habitacionService.crearTipo({ ...tipoForm, capacidad_maxima: Number(tipoForm.capacidad_maxima), tarifa_base: Number(tipoForm.tarifa_base) })
      setShowTipoModal(false)
      setTipoForm({ nombre: '', capacidad_maxima: '', tarifa_base: '' })
      setMsg({ type: 'success', text: 'Tipo de habitación creado' })
      cargar()
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.detail || 'Error' }) }
  }

  const getNombreTipo = (id) => tipos.find(t => t.id === id)?.nombre || '-'

  return (
    <div>
      <h1>Gestión de Habitaciones</h1>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="toolbar">
        <span>{habitaciones.length} habitaciones | {tipos.length} tipos</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-success" onClick={() => setShowTipoModal(true)}>+ Tipo</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Habitación</button>
        </div>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Nro</th><th>Piso</th><th>Tipo</th><th>Estado</th><th>Amenidades</th><th>Acciones</th></tr></thead>
          <tbody>
            {habitaciones.map(h => (
              <tr key={h.id}>
                <td>{h.numero}</td><td>{h.piso}</td><td>{getNombreTipo(h.tipo_habitacion_id)}</td>
                <td><span className={`badge ${ESTADOS[h.estado]}`}>{h.estado}</span></td>
                <td>{h.descripcion_amenidades || '-'}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => { habitacionService.eliminar(h.id).then(cargar) }}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva Habitación</h2>
            <form onSubmit={guardarHab}>
              <div className="form-row">
                <div className="form-group"><label>Número</label><input required value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} /></div>
                <div className="form-group"><label>Piso</label><input type="number" required value={form.piso} onChange={e => setForm({...form, piso: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Tipo</label>
                <select required value={form.tipo_habitacion_id} onChange={e => setForm({...form, tipo_habitacion_id: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre} - ${t.tarifa_base}/noche</option>)}
                </select>
              </div>
              <div className="form-group"><label>Amenidades</label><input value={form.descripcion_amenidades} onChange={e => setForm({...form, descripcion_amenidades: e.target.value})} /></div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showTipoModal && (
        <div className="modal-overlay" onClick={() => setShowTipoModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo Tipo de Habitación</h2>
            <form onSubmit={guardarTipo}>
              <div className="form-group"><label>Nombre</label><input required value={tipoForm.nombre} onChange={e => setTipoForm({...tipoForm, nombre: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Capacidad Máx.</label><input type="number" required value={tipoForm.capacidad_maxima} onChange={e => setTipoForm({...tipoForm, capacidad_maxima: e.target.value})} /></div>
                <div className="form-group"><label>Tarifa Base ($)</label><input type="number" step="0.01" required value={tipoForm.tarifa_base} onChange={e => setTipoForm({...tipoForm, tarifa_base: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowTipoModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

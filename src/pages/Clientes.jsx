import { useState, useEffect } from 'react'
import { clienteService } from '../services/api'

const emptyForm = { cedula_pasaporte: '', nombres: '', apellidos: '', telefono: '', email: '', nacionalidad: '', tipo_cliente: 'NACIONAL' }

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [msg, setMsg] = useState(null)

  const cargar = () => clienteService.listar().then(r => setClientes(r.data)).catch(() => {})
  useEffect(() => { cargar() }, [])

  const guardar = async (e) => {
    e.preventDefault()
    try {
      await clienteService.crear(form)
      setShowModal(false)
      setForm(emptyForm)
      setMsg({ type: 'success', text: 'Cliente registrado correctamente' })
      cargar()
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Error al crear cliente' })
    }
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return
    await clienteService.eliminar(id)
    cargar()
  }

  return (
    <div>
      <h1>Gestión de Clientes</h1>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="toolbar">
        <span>{clientes.length} clientes registrados</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Cliente</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>ID</th><th>Cédula</th><th>Nombres</th><th>Apellidos</th><th>Teléfono</th><th>Email</th><th>Tipo</th><th>Acciones</th></tr></thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td><td>{c.cedula_pasaporte}</td><td>{c.nombres}</td><td>{c.apellidos}</td>
                <td>{c.telefono || '-'}</td><td>{c.email || '-'}</td>
                <td><span className="badge badge-blue">{c.tipo_cliente}</span></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(c.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo Cliente</h2>
            <form onSubmit={guardar}>
              <div className="form-row">
                <div className="form-group"><label>Cédula/Pasaporte</label><input required value={form.cedula_pasaporte} onChange={e => setForm({...form, cedula_pasaporte: e.target.value})} /></div>
                <div className="form-group"><label>Tipo</label>
                  <select value={form.tipo_cliente} onChange={e => setForm({...form, tipo_cliente: e.target.value})}>
                    <option value="NACIONAL">Nacional</option><option value="EXTRANJERO">Extranjero</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Nombres</label><input required value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})} /></div>
                <div className="form-group"><label>Apellidos</label><input required value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Teléfono</label><input value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} /></div>
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Nacionalidad</label><input value={form.nacionalidad} onChange={e => setForm({...form, nacionalidad: e.target.value})} /></div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
# Formularios clientes 

import { useState, useEffect } from 'react'
import { usuarioService } from '../services/api'

const ROLES = ['ADMINISTRADOR', 'RECEPCIONISTA', 'AUDITOR', 'GERENTE']
const emptyForm = { nombres: '', apellidos: '', email: '', password: '', rol: 'RECEPCIONISTA' }

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [msg, setMsg] = useState(null)

  const cargar = () => usuarioService.listar().then(r => setUsuarios(r.data)).catch(() => {})
  useEffect(() => { cargar() }, [])

  const guardar = async (e) => {
    e.preventDefault()
    try {
      await usuarioService.crear(form)
      setShowModal(false)
      setForm(emptyForm)
      setMsg({ type: 'success', text: 'Usuario creado correctamente' })
      cargar()
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Error al crear usuario' })
    }
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return
    await usuarioService.eliminar(id)
    cargar()
  }

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="toolbar">
        <span>{usuarios.length} usuarios registrados</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Usuario</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>ID</th><th>Nombres</th><th>Apellidos</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td><td>{u.nombres}</td><td>{u.apellidos}</td><td>{u.email}</td>
                <td><span className="badge badge-blue">{u.rol}</span></td>
                <td><span className={`badge ${u.estado ? 'badge-green' : 'badge-red'}`}>{u.estado ? 'Activo' : 'Inactivo'}</span></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(u.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo Usuario</h2>
            <form onSubmit={guardar}>
              <div className="form-row">
                <div className="form-group"><label>Nombres</label><input required value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})} /></div>
                <div className="form-group"><label>Apellidos</label><input required value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Email</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="form-group"><label>Contraseña</label><input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
              <div className="form-group"><label>Rol</label>
                <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
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

import { useState, useEffect } from 'react'
import { finanzasService } from '../services/api'

export default function Finanzas() {
  const [gastos, setGastos] = useState([])
  const [cuentas, setCuentas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ descripcion: '', categoria: '', cuenta_id: '', monto: '', proveedor: '', usuario_id: 1 })
  const [msg, setMsg] = useState(null)

  const cargar = () => {
    finanzasService.listarGastos().then(r => setGastos(r.data)).catch(() => {})
    finanzasService.listarCuentas().then(r => setCuentas(r.data)).catch(() => {})
  }
  useEffect(() => { cargar() }, [])

  const guardar = async (e) => {
    e.preventDefault()
    try {
      await finanzasService.crearGasto({ ...form, cuenta_id: Number(form.cuenta_id), monto: Number(form.monto), usuario_id: Number(form.usuario_id) })
      setShowModal(false)
      setMsg({ type: 'success', text: 'Gasto registrado' })
      cargar()
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.detail || 'Error' }) }
  }

  return (
    <div>
      <h1>Finanzas - Gastos Operativos</h1>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="toolbar">
        <span>{gastos.length} gastos registrados</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Registrar Gasto</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>ID</th><th>Descripción</th><th>Categoría</th><th>Monto</th><th>Proveedor</th><th>Fecha</th></tr></thead>
          <tbody>
            {gastos.map(g => (
              <tr key={g.id}>
                <td>{g.id}</td><td>{g.descripcion}</td><td><span className="badge badge-blue">{g.categoria}</span></td>
                <td><strong>${g.monto.toFixed(2)}</strong></td><td>{g.proveedor || '-'}</td>
                <td>{new Date(g.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Registrar Gasto</h2>
            <form onSubmit={guardar}>
              <div className="form-group"><label>Descripción</label><input required value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Categoría</label><input required value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} /></div>
                <div className="form-group"><label>Monto ($)</label><input type="number" step="0.01" required value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Cuenta Contable</label>
                <select required value={form.cuenta_id} onChange={e => setForm({...form, cuenta_id: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  {cuentas.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Proveedor</label><input value={form.proveedor} onChange={e => setForm({...form, proveedor: e.target.value})} /></div>
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
# Registro de gastos 

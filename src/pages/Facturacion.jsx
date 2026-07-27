import { useState, useEffect } from 'react'
import { facturacionService } from '../services/api'

export default function Facturacion() {
  const [facturas, setFacturas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ reserva_id: '', cliente_id: '', metodo_pago: 'EFECTIVO', descripcion: '', cantidad: 1, precio_unitario: '' })
  const [msg, setMsg] = useState(null)

  const cargar = () => facturacionService.listarFacturas().then(r => setFacturas(r.data)).catch(() => {})
  useEffect(() => { cargar() }, [])

  const guardar = async (e) => {
    e.preventDefault()
    const subtotal = Number(form.cantidad) * Number(form.precio_unitario)
    try {
      await facturacionService.crearFactura({
        reserva_id: Number(form.reserva_id), cliente_id: Number(form.cliente_id),
        metodo_pago: form.metodo_pago,
        detalles: [{ descripcion: form.descripcion, cantidad: Number(form.cantidad), precio_unitario: Number(form.precio_unitario), subtotal }]
      })
      setShowModal(false)
      setMsg({ type: 'success', text: 'Factura emitida' })
      cargar()
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.detail || 'Error' }) }
  }

  return (
    <div>
      <h1>Facturación</h1>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
      <div className="toolbar">
        <span>{facturas.length} facturas emitidas</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Emitir Factura</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Nro Factura</th><th>Reserva</th><th>Subtotal</th><th>IVA</th><th>Total</th><th>Método</th><th>Fecha</th></tr></thead>
          <tbody>
            {facturas.map(f => (
              <tr key={f.id}>
                <td>{f.numero_factura}</td><td>#{f.reserva_id}</td>
                <td>${f.subtotal.toFixed(2)}</td><td>${f.iva.toFixed(2)}</td><td><strong>${f.total.toFixed(2)}</strong></td>
                <td><span className="badge badge-blue">{f.metodo_pago}</span></td>
                <td>{new Date(f.fecha_emision).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Emitir Factura</h2>
            <form onSubmit={guardar}>
              <div className="form-row">
                <div className="form-group"><label>ID Reserva</label><input type="number" required value={form.reserva_id} onChange={e => setForm({...form, reserva_id: e.target.value})} /></div>
                <div className="form-group"><label>ID Cliente</label><input type="number" required value={form.cliente_id} onChange={e => setForm({...form, cliente_id: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Descripción</label><input required value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Cantidad</label><input type="number" min="1" required value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} /></div>
                <div className="form-group"><label>Precio Unit. ($)</label><input type="number" step="0.01" required value={form.precio_unitario} onChange={e => setForm({...form, precio_unitario: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Método de Pago</label>
                <select value={form.metodo_pago} onChange={e => setForm({...form, metodo_pago: e.target.value})}>
                  <option value="EFECTIVO">Efectivo</option><option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                  <option value="TARJETA_DEBITO">Tarjeta de Débito</option><option value="TRANSFERENCIA">Transferencia</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Emitir</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
# Emision de facturas 

import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const usuarioService = {
  listar: () => api.get('/usuarios/'),
  obtener: (id) => api.get(`/usuarios/${id}`),
  crear: (data) => api.post('/usuarios/', data),
  actualizar: (id, data) => api.put(`/usuarios/${id}`, data),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
}

export const clienteService = {
  listar: () => api.get('/clientes/'),
  obtener: (id) => api.get(`/clientes/${id}`),
  crear: (data) => api.post('/clientes/', data),
  actualizar: (id, data) => api.put(`/clientes/${id}`, data),
  eliminar: (id) => api.delete(`/clientes/${id}`),
}

export const habitacionService = {
  listarTipos: () => api.get('/habitaciones/tipos'),
  crearTipo: (data) => api.post('/habitaciones/tipos', data),
  listar: () => api.get('/habitaciones/'),
  disponibles: () => api.get('/habitaciones/disponibles'),
  crear: (data) => api.post('/habitaciones/', data),
  actualizar: (id, data) => api.put(`/habitaciones/${id}`, data),
  eliminar: (id) => api.delete(`/habitaciones/${id}`),
}

export const reservaService = {
  listar: () => api.get('/reservas/'),
  obtener: (id) => api.get(`/reservas/${id}`),
  crear: (data) => api.post('/reservas/', data),
  actualizar: (id, data) => api.put(`/reservas/${id}`, data),
  checkin: (id) => api.post(`/reservas/${id}/checkin`),
  checkout: (id) => api.post(`/reservas/${id}/checkout`),
  cancelar: (id, data) => api.post(`/reservas/${id}/cancelar`, data),
  historial: (clienteId) => api.get(`/reservas/cliente/${clienteId}`),
  activas: () => api.get('/reservas/activas'),
}

export const facturacionService = {
  listarConsumos: (reservaId) => api.get(`/facturacion/consumos/${reservaId}`),
  crearConsumo: (data) => api.post('/facturacion/consumos', data),
  listarFacturas: () => api.get('/facturacion/facturas'),
  crearFactura: (data) => api.post('/facturacion/facturas', data),
  listarPagos: (reservaId) => api.get(`/facturacion/pagos/${reservaId}`),
  crearPago: (data) => api.post('/facturacion/pagos', data),
}

export const finanzasService = {
  listarCuentas: () => api.get('/finanzas/cuentas'),
  crearCuenta: (data) => api.post('/finanzas/cuentas', data),
  crearGasto: (data) => api.post('/finanzas/gastos', data),
  listarGastos: () => api.get('/finanzas/gastos'),
}

export const configService = {
  obtener: () => api.get('/configuracion/parametros'),
  guardar: (data) => api.post('/configuracion/parametros', data),
}

export default api

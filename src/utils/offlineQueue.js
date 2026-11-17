/**
 * Manejo de cola local para registros diarios sin conexión (PWA / Modo Offline).
 * Persiste registros en localStorage (con fallback en memoria) para sincronización automática al recuperar red.
 */

const STORAGE_KEY = 'hengest_offline_queue'
let memoryQueue = []

/**
 * Obtiene el almacenamiento adecuado (localStorage con fallback seguro).
 */
function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage
    }
  } catch {}
  return null
}

/**
 * Genera un identificador único seguro (UUID v4) para idempotencia en el servidor.
 * @returns {string}
 */
export function generateClientUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Obtiene la lista actual de registros encolados.
 * @returns {Array<Object>}
 */
export function getQueuedRecords() {
  const storage = getStorage()
  if (storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return memoryQueue
    }
  }
  return [...memoryQueue]
}

/**
 * Guarda la lista de registros encolados.
 * @param {Array<Object>} queue
 */
function saveQueue(queue) {
  memoryQueue = [...queue]
  const storage = getStorage()
  if (storage) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(queue))
    } catch {}
  }
}

/**
 * Añade un registro diario a la cola local.
 * Si ya existe uno con el mismo client_uuid, lo actualiza sin duplicar.
 * @param {Object} record
 * @returns {Object} registro con client_uuid y metadatos de cola
 */
export function enqueueDailyRecord(record) {
  const queue = getQueuedRecords()
  const client_uuid = record.client_uuid || generateClientUuid()

  const queuedItem = {
    ...record,
    client_uuid,
    queued_at: new Date().toISOString(),
    sync_status: 'PENDIENTE',
  }

  const existingIndex = queue.findIndex((item) => item.client_uuid === client_uuid)
  if (existingIndex >= 0) {
    queue[existingIndex] = queuedItem
  } else {
    queue.push(queuedItem)
  }

  saveQueue(queue)
  return queuedItem
}

/**
 * Remueve un registro de la cola por su client_uuid tras sincronización exitosa.
 * @param {string} client_uuid
 */
export function removeQueuedRecord(client_uuid) {
  const queue = getQueuedRecords()
  const filtered = queue.filter((item) => item.client_uuid !== client_uuid)
  saveQueue(filtered)
}

/**
 * Cuenta la cantidad de registros pendientes de sincronización.
 * @returns {number}
 */
export function getPendingCount() {
  return getQueuedRecords().length
}

/**
 * Limpia toda la cola offline.
 */
export function clearQueue() {
  memoryQueue = []
  const storage = getStorage()
  if (storage) {
    try {
      storage.removeItem(STORAGE_KEY)
    } catch {}
  }
}

/**
 * Sincroniza todos los registros pendientes enviándolos al backend mediante la función provista.
 * @param {(record: Object) => Promise<any>} submitFn
 * @returns {Promise<{ syncedCount: number, failedCount: number, errors: Array }>}
 */
export async function syncOfflineQueue(submitFn) {
  const queue = getQueuedRecords()
  let syncedCount = 0
  let failedCount = 0
  const errors = []

  for (const item of queue) {
    try {
      await submitFn(item)
      removeQueuedRecord(item.client_uuid)
      syncedCount++
    } catch (err) {
      failedCount++
      errors.push({ client_uuid: item.client_uuid, error: err })
    }
  }

  return {
    syncedCount,
    failedCount,
    errors,
  }
}

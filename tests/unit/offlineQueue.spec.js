import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  enqueueDailyRecord,
  getQueuedRecords,
  getPendingCount,
  removeQueuedRecord,
  syncOfflineQueue,
  clearQueue,
} from '@/utils/offlineQueue'

describe('Cola local de registros sin conexión (Offline Queue)', () => {
  beforeEach(() => {
    clearQueue()
  })

  it('encola un registro diario asignándole un client_uuid si no lo tiene', () => {
    const item = enqueueDailyRecord({
      lote: 1,
      fecha: '2026-11-16',
      total_huevos: 2160,
    })

    expect(item.client_uuid).toBeDefined()
    expect(item.sync_status).toBe('PENDIENTE')
    expect(getPendingCount()).toBe(1)

    const queued = getQueuedRecords()
    expect(queued.length).toBe(1)
    expect(queued[0].total_huevos).toBe(2160)
  })

  it('no duplica registros con el mismo client_uuid al encolar de nuevo', () => {
    const uuid = 'test-uuid-12345'
    enqueueDailyRecord({ client_uuid: uuid, lote: 1, total_huevos: 100 })
    expect(getPendingCount()).toBe(1)

    // Re-encolar con el mismo uuid
    enqueueDailyRecord({ client_uuid: uuid, lote: 1, total_huevos: 200 })
    expect(getPendingCount()).toBe(1)

    const queued = getQueuedRecords()
    expect(queued[0].total_huevos).toBe(200)
  })

  it('remueve un registro de la cola por su client_uuid', () => {
    const item1 = enqueueDailyRecord({ lote: 1, fecha: '2026-11-15' })
    const item2 = enqueueDailyRecord({ lote: 1, fecha: '2026-11-16' })
    expect(getPendingCount()).toBe(2)

    removeQueuedRecord(item1.client_uuid)
    expect(getPendingCount()).toBe(1)
    expect(getQueuedRecords()[0].client_uuid).toBe(item2.client_uuid)
  })

  it('sincroniza correctamente todos los registros pendientes llamando a submitFn', async () => {
    enqueueDailyRecord({ lote: 1, fecha: '2026-11-15' })
    enqueueDailyRecord({ lote: 2, fecha: '2026-11-15' })
    expect(getPendingCount()).toBe(2)

    const mockSubmit = vi.fn().mockResolvedValue({ id: 10, status: 'ok' })

    const result = await syncOfflineQueue(mockSubmit)

    expect(mockSubmit).toHaveBeenCalledTimes(2)
    expect(result.syncedCount).toBe(2)
    expect(result.failedCount).toBe(0)
    expect(getPendingCount()).toBe(0)
  })

  it('retiene en la cola los registros que fallen en la sincronización', async () => {
    const item1 = enqueueDailyRecord({ lote: 1, fecha: '2026-11-15' })
    const item2 = enqueueDailyRecord({ lote: 2, fecha: '2026-11-15' })

    const mockSubmit = vi.fn().mockImplementation((rec) => {
      if (rec.client_uuid === item1.client_uuid) {
        return Promise.resolve({ ok: true })
      }
      return Promise.reject(new Error('Fallo de red'))
    })

    const result = await syncOfflineQueue(mockSubmit)

    expect(result.syncedCount).toBe(1)
    expect(result.failedCount).toBe(1)
    expect(getPendingCount()).toBe(1)
    expect(getQueuedRecords()[0].client_uuid).toBe(item2.client_uuid)
  })
})

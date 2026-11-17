/**
 * Utilidades de formato regional para HENGEST.
 * Toda la interfaz se formatea en español de Colombia (es-CO)
 * y las fechas se calculan bajo la zona horaria 'America/Bogota'.
 */

const BOGOTA_TZ = 'America/Bogota'

/**
 * Obtiene la fecha actual en la zona horaria de Bogotá en formato YYYY-MM-DD.
 * @returns {string} Ej: '2026-11-16'
 */
export function getTodayBogota() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: BOGOTA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(new Date())
}

/**
 * Formatea una fecha YYYY-MM-DD o ISO a formato visual campesino dd/mm/aaaa.
 * @param {string|Date} dateStr
 * @returns {string} Ej: '16/11/2026'
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    // Si viene en formato simple 'YYYY-MM-DD'
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    }
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('es-CO', {
      timeZone: BOGOTA_TZ,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d)
  } catch {
    return dateStr
  }
}

/**
 * Formatea una fecha y hora completa en formato dd/mm/aaaa hh:mm a.
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('es-CO', {
      timeZone: BOGOTA_TZ,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d)
  } catch {
    return dateStr
  }
}

/**
 * Formatea números con separador de miles '.' y decimal ','.
 * @param {number|string} val
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatNumber(val, decimals = 1) {
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (num === null || num === undefined || isNaN(num)) return '-'
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Formatea valores monetarios en pesos colombianos (COP) enteros, sin decimales.
 * @param {number|string} amount
 * @returns {string} Ej: '$ 60.000'
 */
export function formatCurrency(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (num === null || num === undefined || isNaN(num)) return '$ 0'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Formatea porcentajes (ej. 88.8 -> '88,8 %').
 * @param {number|string} val
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatPercent(val, decimals = 1) {
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (num === null || num === undefined || isNaN(num)) return '-'
  return `${formatNumber(num, decimals)} %`
}

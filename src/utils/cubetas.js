/**
 * Regla de negocio de cubetas de huevo comercial para HENGEST.
 * Cada cubeta estándar equivale exactamente a 30 unidades de huevo.
 *
 * Fuente de verdad compartida con el backend de Django:
 * - cubetas = unidades // 30
 * - sueltos = unidades % 30
 */

/**
 * Calcula la cantidad de cubetas completas de 30 unidades y el remanente suelto.
 * @param {number|string} unidades
 * @returns {{ cubetas: number, sueltos: number, total_unidades: number }}
 */
export function calcularCubetas(unidades) {
  const parsed = parseInt(unidades, 10)
  const u = isNaN(parsed) || parsed < 0 ? 0 : parsed

  return {
    cubetas: Math.floor(u / 30),
    sueltos: u % 30,
    total_unidades: u,
  }
}

/**
 * Devuelve una cadena legible para el productor campesino ("26 cubetas + 20 sueltos").
 * @param {number|string} unidades
 * @returns {string}
 */
export function formatearCubetasTexto(unidades) {
  const { cubetas, sueltos } = calcularCubetas(unidades)

  if (cubetas === 0 && sueltos === 0) {
    return '0 cubetas'
  }
  if (cubetas === 0) {
    return `${sueltos} suelto${sueltos !== 1 ? 's' : ''}`
  }
  if (sueltos === 0) {
    return `${cubetas} cubeta${cubetas !== 1 ? 's' : ''}`
  }
  return `${cubetas} cubeta${cubetas !== 1 ? 's' : ''} + ${sueltos} suelto${sueltos !== 1 ? 's' : ''}`
}

/**
 * Calcula el desglose y los totales combinados para las 5 categorías comerciales (AAA, AA, A, B, C).
 * @param {Record<string, number|string>} categorias
 * @returns {{
 *   cubetas: Record<string, { cubetas: number, sueltos: number }>,
 *   total_huevos: number,
 *   total_cubetas: number,
 *   total_sueltos: number
 * }}
 */
export function calcularTotalesCategorias(categorias = {}) {
  const claves = ['aaa', 'aa', 'a', 'b', 'c']
  const cubetas = {}
  let total_huevos = 0
  let total_cubetas = 0
  let total_sueltos = 0

  for (const cat of claves) {
    const u = parseInt(categorias[cat], 10) || 0
    const res = calcularCubetas(u)
    cubetas[cat] = {
      cubetas: res.cubetas,
      sueltos: res.sueltos,
    }
    total_huevos += res.total_unidades
    total_cubetas += res.cubetas
    total_sueltos += res.sueltos
  }

  return {
    cubetas,
    total_huevos,
    total_cubetas,
    total_sueltos,
  }
}

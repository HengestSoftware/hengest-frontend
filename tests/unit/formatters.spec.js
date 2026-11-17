import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatCurrency,
  formatNumber,
  formatPercent,
  getTodayBogota,
} from '@/utils/formatters'

describe('Utilidades de formato regional colombiano (es-CO)', () => {
  it('obtiene la fecha de hoy en formato YYYY-MM-DD', () => {
    const today = getTodayBogota()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('formatea fechas YYYY-MM-DD a dd/mm/aaaa', () => {
    expect(formatDate('2026-11-16')).toBe('16/11/2026')
    expect(formatDate('2026-03-01')).toBe('01/03/2026')
    expect(formatDate(null)).toBe('-')
  })

  it('formatea moneda en pesos colombianos (COP) sin decimales', () => {
    const mensual = formatCurrency(60000)
    expect(mensual).toContain('60.000')

    const anual = formatCurrency(648000)
    expect(anual).toContain('648.000')

    expect(formatCurrency(0)).toContain('0')
  })

  it('formatea porcentajes con coma decimal y espacio antes del %', () => {
    expect(formatPercent(88.8)).toBe('88,8 %')
    expect(formatPercent(92)).toBe('92 %')
    expect(formatPercent(null)).toBe('-')
  })

  it('formatea números decimales con coma decimal y punto de miles', () => {
    expect(formatNumber(12500)).toBe('12.500')
    expect(formatNumber(115.4)).toBe('115,4')
  })
})

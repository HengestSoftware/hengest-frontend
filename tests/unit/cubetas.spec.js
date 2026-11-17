import { describe, it, expect } from 'vitest'
import {
  calcularCubetas,
  formatearCubetasTexto,
  calcularTotalesCategorias,
} from '@/utils/cubetas'

describe('Regla de cubetas comerciales (1 cubeta = 30 huevos)', () => {
  it('maneja el borde 0 unidades', () => {
    const res = calcularCubetas(0)
    expect(res.cubetas).toBe(0)
    expect(res.sueltos).toBe(0)
    expect(formatearCubetasTexto(0)).toBe('0 cubetas')
  })

  it('maneja el borde 29 unidades (casi una cubeta)', () => {
    const res = calcularCubetas(29)
    expect(res.cubetas).toBe(0)
    expect(res.sueltos).toBe(29)
    expect(formatearCubetasTexto(29)).toBe('29 sueltos')
  })

  it('maneja el borde 30 unidades (exactamente una cubeta)', () => {
    const res = calcularCubetas(30)
    expect(res.cubetas).toBe(1)
    expect(res.sueltos).toBe(0)
    expect(formatearCubetasTexto(30)).toBe('1 cubeta')
  })

  it('maneja el borde 31 unidades (una cubeta y un huevo suelto)', () => {
    const res = calcularCubetas(31)
    expect(res.cubetas).toBe(1)
    expect(res.sueltos).toBe(1)
    expect(formatearCubetasTexto(31)).toBe('1 cubeta + 1 suelto')
  })

  it('maneja el borde 59 unidades (una cubeta y 29 sueltos)', () => {
    const res = calcularCubetas(59)
    expect(res.cubetas).toBe(1)
    expect(res.sueltos).toBe(29)
    expect(formatearCubetasTexto(59)).toBe('1 cubeta + 29 sueltos')
  })

  it('maneja el borde 60 unidades (exactamente dos cubetas)', () => {
    const res = calcularCubetas(60)
    expect(res.cubetas).toBe(2)
    expect(res.sueltos).toBe(0)
    expect(formatearCubetasTexto(60)).toBe('2 cubetas')
  })

  it('calcula correctamente los totales de las 5 categorías comerciales', () => {
    const categorias = {
      aaa: 120, // 4 cubetas, 0 sueltos
      aa: 800,  // 26 cubetas, 20 sueltos
      a: 900,   // 30 cubetas, 0 sueltos
      b: 300,   // 10 cubetas, 0 sueltos
      c: 40,    // 1 cubeta, 10 sueltos
    }

    const resultado = calcularTotalesCategorias(categorias)

    expect(resultado.total_huevos).toBe(2160)
    expect(resultado.total_cubetas).toBe(71)
    expect(resultado.total_sueltos).toBe(30)

    expect(resultado.cubetas.aaa).toEqual({ cubetas: 4, sueltos: 0 })
    expect(resultado.cubetas.aa).toEqual({ cubetas: 26, sueltos: 20 })
    expect(resultado.cubetas.a).toEqual({ cubetas: 30, sueltos: 0 })
    expect(resultado.cubetas.b).toEqual({ cubetas: 10, sueltos: 0 })
    expect(resultado.cubetas.c).toEqual({ cubetas: 1, sueltos: 10 })
  })

  it('tolera valores nulos o negativos sanitizándolos a 0', () => {
    expect(calcularCubetas(-5)).toEqual({ cubetas: 0, sueltos: 0, total_unidades: 0 })
    expect(calcularCubetas(null)).toEqual({ cubetas: 0, sueltos: 0, total_unidades: 0 })
    expect(calcularCubetas('abc')).toEqual({ cubetas: 0, sueltos: 0, total_unidades: 0 })
  })
})

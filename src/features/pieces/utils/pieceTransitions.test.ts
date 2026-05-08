import { describe, it, expect } from 'vitest'
import { isValidTransition, getValidTransitions, getTransitionError } from './pieceTransitions'

describe('pieceTransitions', () => {
  describe('admin_agency transitions', () => {
    const role = 'admin_agency' as const

    it('draft → sent_client es válido', () => {
      expect(isValidTransition('draft', 'sent_client', role)).toBe(true)
    })

    it('draft → published NO es válido (no puede saltear aprobación)', () => {
      expect(isValidTransition('draft', 'published', role)).toBe(false)
    })

    it('sent_client → approved es válido', () => {
      expect(isValidTransition('sent_client', 'approved', role)).toBe(true)
    })

    it('sent_client → rejected es válido', () => {
      expect(isValidTransition('sent_client', 'rejected', role)).toBe(true)
    })

    it('sent_client → draft es válido (retirar)', () => {
      expect(isValidTransition('sent_client', 'draft', role)).toBe(true)
    })

    it('approved → published es válido', () => {
      expect(isValidTransition('approved', 'published', role)).toBe(true)
    })

    it('approved → draft es válido (volver a borrador)', () => {
      expect(isValidTransition('approved', 'draft', role)).toBe(true)
    })

    it('rejected → draft es válido (corregir)', () => {
      expect(isValidTransition('rejected', 'draft', role)).toBe(true)
    })

    it('rejected → published NO es válido', () => {
      expect(isValidTransition('rejected', 'published', role)).toBe(false)
    })

    it('published no tiene transiciones', () => {
      expect(getValidTransitions('published', role)).toEqual([])
    })
  })

  describe('client transitions', () => {
    const role = 'client' as const

    it('sent_client → approved es válido', () => {
      expect(isValidTransition('sent_client', 'approved', role)).toBe(true)
    })

    it('sent_client → rejected es válido', () => {
      expect(isValidTransition('sent_client', 'rejected', role)).toBe(true)
    })

    it('sent_client → draft NO es válido (cliente no puede retirar)', () => {
      expect(isValidTransition('sent_client', 'draft', role)).toBe(false)
    })

    it('draft → sent_client NO es válido (cliente no envía)', () => {
      expect(isValidTransition('draft', 'sent_client', role)).toBe(false)
    })

    it('approved → published NO es válido (cliente no publica)', () => {
      expect(isValidTransition('approved', 'published', role)).toBe(false)
    })

    it('cliente no tiene transiciones desde draft', () => {
      expect(getValidTransitions('draft', role)).toEqual([])
    })
  })

  describe('team_member transitions', () => {
    it('tiene las mismas transiciones que admin', () => {
      expect(getValidTransitions('draft', 'team_member')).toEqual(
        getValidTransitions('draft', 'admin_agency'),
      )
    })
  })

  describe('getTransitionError', () => {
    it('retorna null para transición válida', () => {
      expect(getTransitionError('draft', 'sent_client', 'admin_agency')).toBeNull()
    })

    it('retorna mensaje para transición inválida', () => {
      const err = getTransitionError('draft', 'published', 'admin_agency')
      expect(err).toBeTruthy()
      expect(err).toContain('sent_client')
    })

    it('retorna mensaje específico para cliente fuera de sent_client', () => {
      const err = getTransitionError('draft', 'sent_client', 'client')
      expect(err).toContain('revision')
    })

    it('retorna mensaje para published (inmutable)', () => {
      const err = getTransitionError('published', 'draft', 'admin_agency')
      expect(err).toContain('publicada')
    })
  })
})

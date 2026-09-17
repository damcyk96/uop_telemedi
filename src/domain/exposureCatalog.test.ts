import { describe, expect, it, vi } from 'vitest'
import type { ExposureFactor, ReferralTemplate } from './types'
import { removeExposureFactor, validateFactorName } from './exposureCatalog'

const factor: ExposureFactor = { id: 'factor-1', category: 'OTHER', name: 'Praca nocna', source: 'CUSTOM' }

describe('Katalog czynników narażenia', () => {
  it('rozpoznaje duplikat nazwy bez względu na wielkość liter', () => {
    expect(validateFactorName('praca NOCNA', 'OTHER', [factor])).toEqual({ ok: false, messageKey: 'validation.exposureFactor.nameDuplicate' })
  })

  it('usuwa czynnik z szablonów przed usunięciem ze słownika', async () => {
    const template: ReferralTemplate = { id: 'template-1', name: 'Nocna zmiana', factorIds: ['factor-1', 'factor-2'] }
    const calls: string[] = []
    const replaceTemplate = vi.fn(async (next: ReferralTemplate) => { calls.push('template'); expect(next.factorIds).toEqual(['factor-2']) })
    const removeFactor = vi.fn(async () => { calls.push('factor') })

    await removeExposureFactor(factor, [template], { replaceTemplate, removeFactor })

    expect(calls).toEqual(['template', 'factor'])
  })
})

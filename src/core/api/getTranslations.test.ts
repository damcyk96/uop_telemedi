import { describe, expect, it } from 'vitest'
import { pl } from '@/i18n/locales/pl'
import { getTranslations } from './getTranslations'

describe('getTranslations', () => {
  it('zwraca wszystkie klucze locale jak odpowiedź z API', async () => {
    const translations = await getTranslations('pl')

    expect(translations).toEqual(pl)
    expect(translations).not.toBe(pl)
  })
})

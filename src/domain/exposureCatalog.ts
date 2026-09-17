import type { TranslationKey } from '@/i18n/types'
import type { ExposureFactor, ReferralTemplate } from './types'

export function validateFactorName(name: string, category: ExposureFactor['category'], factors: readonly ExposureFactor[]) {
  const normalized = name.trim()
  if (!normalized) {
    return { ok: false as const, messageKey: 'validation.exposureFactor.nameRequired' as TranslationKey }
  }
  const duplicate = factors.some(factor => factor.category === category && factor.name.localeCompare(normalized, 'pl', { sensitivity: 'base' }) === 0)
  if (duplicate) {
    return { ok: false as const, messageKey: 'validation.exposureFactor.nameDuplicate' as TranslationKey }
  }
  return { ok: true as const, name: normalized }
}

export interface ExposureCatalogPersistence {
  replaceTemplate(template: ReferralTemplate): Promise<unknown>
  removeFactor(id: string): Promise<unknown>
}

export async function removeExposureFactor(
  factor: ExposureFactor,
  templates: readonly ReferralTemplate[],
  persistence: ExposureCatalogPersistence,
) {
  if (factor.source === 'SYSTEM') {
    throw new Error('System exposure factors cannot be removed')
  }
  const affected = templates.filter(template => template.factorIds.includes(factor.id))
  await Promise.all(affected.map(template => persistence.replaceTemplate({ ...template, factorIds: template.factorIds.filter(id => id !== factor.id) })))
  await persistence.removeFactor(factor.id)
  return { updatedTemplates: affected.length }
}


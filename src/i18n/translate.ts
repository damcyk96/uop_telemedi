import type { Locale, PluralForms, Translate, TranslationKey, TranslationParams, Translations } from './types'

function resolve(translations: Translations, key: TranslationKey): unknown {
  return key.split('.').reduce<unknown>((node, segment) => {
    if (node && typeof node === 'object') {
      return (node as Record<string, unknown>)[segment]
    }
    return undefined
  }, translations)
}

function isPluralForms(value: unknown): value is PluralForms {
  return Boolean(value) && typeof value === 'object' && 'one' in (value as object) && 'many' in (value as object)
}

function interpolate(template: string, params: TranslationParams = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) => (
    name in params ? String(params[name]) : placeholder
  ))
}

export function createTranslator(translations: Translations, locale: Locale): Translate {
  const pluralRules = new Intl.PluralRules(locale)

  return function translate(key, params) {
    const value = resolve(translations, key)

    if (typeof value === 'string') {
      return interpolate(value, params)
    }

    if (isPluralForms(value)) {
      const count = Number(params?.count ?? 0)
      const form = pluralRules.select(count) as keyof PluralForms
      return interpolate(value[form] ?? value.other, { ...params, count })
    }

    return key
  }
}

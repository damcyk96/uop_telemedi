import type { pl } from './locales/pl'

export type Locale = 'pl'

export interface PluralForms {
  one: string
  few: string
  many: string
  other: string
}

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> }

type JoinKey<Prefix extends string, Key extends string> = Prefix extends '' ? Key : `${Prefix}.${Key}`

type KeyPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string | PluralForms
    ? JoinKey<Prefix, K>
    : KeyPaths<T[K], JoinKey<Prefix, K>>
}[keyof T & string]

export type Translations = Widen<typeof pl>

export type TranslationKey = KeyPaths<typeof pl>

export type TranslationParams = Record<string, string | number>

export type Translate = (key: TranslationKey, params?: TranslationParams) => string

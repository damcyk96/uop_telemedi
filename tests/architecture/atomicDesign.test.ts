import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'

const src = resolve(process.cwd(), 'src')

function collectFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? collectFiles(path) : [path]
  })
}

function importsOf(file: string) {
  const source = readFileSync(file, 'utf8')
  return [...source.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map(match => match[1])
}

const sourceFiles = collectFiles(src)
  .filter(file => ['.ts', '.tsx'].includes(extname(file)))
  .map(file => relative(process.cwd(), file))

const levels = ['atoms', 'molecules', 'organisms'] as const
const uiFiles = sourceFiles.filter(file => file.startsWith('src/ui/'))
const consumerFiles = sourceFiles.filter(file => !file.startsWith('src/ui/'))

describe('atomic design w src/ui', () => {
  it.each(uiFiles)('%s nie zależy od domeny, danych ani funkcji aplikacji', file => {
    for (const specifier of importsOf(file)) {
      expect(specifier).not.toMatch(/^@\/(features|core|domain|layout)\b/)
    }
  })

  it.each(uiFiles)('%s importuje tylko z niższych lub tego samego poziomu', file => {
    const level = levels.findIndex(name => file.startsWith(`src/ui/${name}/`))
    for (const specifier of importsOf(file)) {
      const target = levels.findIndex(name => specifier.startsWith(`@/ui/${name}`))
      if (target !== -1) {
        expect(target).toBeLessThanOrEqual(level)
      }
    }
  })

  it.each(consumerFiles)('%s korzysta z ui wyłącznie przez barrel poziomu', file => {
    for (const specifier of importsOf(file).filter(item => item.startsWith('@/ui'))) {
      expect(specifier).toMatch(/^@\/ui\/(atoms|molecules|organisms)$/)
    }
  })
})

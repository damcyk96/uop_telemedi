import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, extname, join, resolve } from 'node:path'

const componentRoots = ['features', 'layout', 'ui'].map(directory => (
  resolve(process.cwd(), 'src', directory)
))

function collectFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? collectFiles(path) : [path]
  })
}

const componentFiles = componentRoots
  .flatMap(collectFiles)
  .filter(file => extname(file) === '.tsx')

describe('konwencja modułów UI', () => {
  it.each(componentFiles)('%s ma własny katalog i publiczny index', file => {
    const componentName = basename(file, '.tsx')
    const componentDirectory = dirname(file)

    expect(basename(componentDirectory)).toBe(componentName)
    expect(existsSync(join(componentDirectory, 'index.ts'))).toBe(true)
  })

  it.each(componentFiles)('%s nie zawiera inline returnów JSX ani anonimowych typów propsów', file => {
    const source = readFileSync(file, 'utf8')

    expect(source).not.toMatch(/return\s*</)
    expect(source).not.toMatch(/=>\s*</)
    expect(source).not.toMatch(/\}:\s*\{/)
  })
})

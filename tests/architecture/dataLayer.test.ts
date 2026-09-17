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

const componentFiles = collectFiles(src)
  .filter(file => extname(file) === '.tsx')
  .map(file => relative(process.cwd(), file))

describe('warstwa danych (src/core)', () => {
  it.each(componentFiles)('%s pobiera dane wyłącznie przez hooki z core/queries', file => {
    const source = readFileSync(file, 'utf8')

    expect(source).not.toMatch(/\bfetch\(/)
    expect(source).not.toMatch(/\buse(Query|Mutation|QueryClient)\(/)
    expect(source).not.toMatch(/core\/api['/]/)
  })
})

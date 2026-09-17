import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import ts from 'typescript'

const textualProps = new Set([
  'label',
  'title',
  'placeholder',
  'aria-label',
  'description',
  'eyebrow',
  'hint',
  'text',
  'message',
  'caption',
  'subtitle',
  'alt',
  'emptyCategoryText',
])
const polishLetters = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/
const letters = /\p{L}/u

function collectFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? collectFiles(path) : [path]
  })
}

const files = collectFiles(resolve(process.cwd(), 'src'))
  .map(file => relative(process.cwd(), file))
  .filter(file => ['.ts', '.tsx'].includes(extname(file)))
  .filter(file => !file.startsWith('src/i18n/locales/') && !file.endsWith('.test.ts'))

function findHardcodedTexts(file: string) {
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, kind)
  const found: string[] = []

  function report(node: ts.Node) {
    const line = source.getLineAndCharacterOfPosition(node.getStart()).line + 1
    found.push(`${file}:${line} ${node.getText().trim().slice(0, 80)}`)
  }

  function visit(node: ts.Node) {
    if (ts.isJsxText(node) && letters.test(node.text)) {
      report(node)
    }

    if (ts.isJsxAttribute(node) && textualProps.has(node.name.getText()) && node.initializer && ts.isStringLiteral(node.initializer) && letters.test(node.initializer.text)) {
      report(node)
    }

    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) && polishLetters.test(node.text)) {
      report(node)
    }

    ts.forEachChild(node, visit)
  }

  visit(source)
  return found
}

describe('tłumaczenia', () => {
  it.each(files)('%s nie zawiera tekstów poza src/i18n/locales', file => {
    expect(findHardcodedTexts(file)).toEqual([])
  })
})

import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import ts from 'typescript'

const roots = ['src', 'tests', 'scripts']
const extensions = new Set(['.ts', '.tsx', '.mjs'])

function collectFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? collectFiles(path) : [path]
  })
}

const files = roots
  .flatMap(root => collectFiles(resolve(process.cwd(), root)))
  .filter(file => extensions.has(extname(file)))
  .map(file => relative(process.cwd(), file))

function lineOf(source: ts.SourceFile, position: number) {
  return source.getLineAndCharacterOfPosition(position).line + 1
}

function isFunctionDeclarationLike(arrow: ts.ArrowFunction) {
  const parent = arrow.parent
  return ts.isVariableDeclaration(parent) || ts.isReturnStatement(parent) || ts.isArrowFunction(parent)
}

function findViolations(file: string) {
  const text = readFileSync(file, 'utf8')
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind)
  const violations: string[] = []

  function report(node: ts.Node, message: string) {
    violations.push(`${file}:${lineOf(source, node.getStart())} ${message}`)
  }

  function visit(node: ts.Node) {
    if (ts.isIfStatement(node)) {
      if (!ts.isBlock(node.thenStatement)) {
        report(node, 'if bez klamer')
      }
      if (node.elseStatement && !ts.isBlock(node.elseStatement) && !ts.isIfStatement(node.elseStatement)) {
        report(node, 'else bez klamer')
      }
    }

    if ((ts.isReturnStatement(node) || ts.isThrowStatement(node)) && ts.isBlock(node.parent)) {
      const block = node.parent
      if (lineOf(source, block.getStart()) === lineOf(source, block.getEnd())) {
        report(node, 'return/throw w jednolinijkowym bloku')
      }
    }

    if (ts.isArrowFunction(node) && !ts.isBlock(node.body) && isFunctionDeclarationLike(node)) {
      report(node, 'funkcja z niejawnym returnem — użyj bloku i jawnego return')
    }

    ts.forEachChild(node, visit)
  }

  visit(source)
  return violations
}

describe('jawne returny', () => {
  it.each(files)('%s nie używa inline returnów', file => {
    expect(findViolations(file)).toEqual([])
  })
})

describe('komentarze', () => {
  it.each(files)('%s nie zawiera komentarzy JSDoc', file => {
    expect(readFileSync(file, 'utf8')).not.toMatch(/\/\*\*/)
  })
})

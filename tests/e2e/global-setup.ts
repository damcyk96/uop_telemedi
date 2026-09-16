import { copyFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const seed = resolve(process.cwd(), 'server/db.seed.json')
const testDatabase = resolve(process.cwd(), 'server/db.test.json')

export default async function globalSetup() {
  copyFileSync(seed, testDatabase)
  return async () => rmSync(testDatabase, { force: true })
}

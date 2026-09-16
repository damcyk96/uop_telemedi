import { copyFileSync } from 'node:fs'
import concurrently from 'concurrently'

copyFileSync('server/db.seed.json', 'server/db.test.json')

const { result } = concurrently([
  { command: 'vite --mode test --host 127.0.0.1 --port 4173', name: 'app' },
  { command: 'json-server --watch server/db.test.json --host 127.0.0.1 --port 3002', name: 'api' },
], { killOthersOn: ['failure', 'success'] })

try {
  await result
} catch {
  process.exitCode = 1
}

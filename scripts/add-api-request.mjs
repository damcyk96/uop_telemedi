#!/usr/bin/env node
// Scaffolds a request in src/core/api and its hook in src/core/queries.
// Usage: npm run add:api -- getReferral
import { appendFileSync, existsSync, writeFileSync } from 'node:fs'

const name = process.argv[2]
if (!/^(get|post|put|delete)[A-Z]\w*$/.test(name ?? '')) {
  console.error('Podaj nazwę w formacie get|post|put|delete + Zasób, np. getReferral')
  process.exit(1)
}

const verb = name.match(/^(get|post|put|delete)/)[1]
const method = verb.toUpperCase()
const hook = `use${name[0].toUpperCase()}${name.slice(1)}`
const apiFile = `src/core/api/${name}.ts`
const hookFile = `src/core/queries/${hook}.ts`

for (const file of [apiFile, hookFile]) {
  if (existsSync(file)) {
    console.error(`${file} już istnieje`)
    process.exit(1)
  }
}

writeFileSync(apiFile, `import { apiClient, HttpMethod } from './client'

export function ${name}() {
  return apiClient<unknown>({ method: HttpMethod.${method}, path: '/TODO' })
}
`)

const hookSource = verb === 'get'
  ? `import { useQuery } from '@tanstack/react-query'
import { ${name} } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { QueryOptions } from './types'

// TODO: add the key to queryKeys.ts and set the response type.
export function ${hook}(options?: QueryOptions<unknown>) {
  return useQuery({ queryKey: queryKeys.TODO, queryFn: ${name}, ...options })
}
`
  : `import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ${name} } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { MutationOptions } from './types'

// TODO: set response/variables types and the keys this mutation invalidates.
export function ${hook}(options?: MutationOptions<unknown, void>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ${name},
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.TODO })
      await options?.onSuccess?.(...args)
    },
  })
}
`
writeFileSync(hookFile, hookSource)

appendFileSync('src/core/api/index.ts', `export { ${name} } from './${name}'\n`)
appendFileSync('src/core/queries/index.ts', `export { ${hook} } from './${hook}'\n`)

console.log(`Utworzono ${apiFile} i ${hookFile}`)

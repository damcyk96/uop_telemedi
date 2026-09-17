export async function simulateApiResponse<TResponse>(loadPayload: () => Promise<TResponse>, delayMs = 120) {
  const [payload] = await Promise.all([
    loadPayload(),
    new Promise(resolve => {
      setTimeout(resolve, delayMs)
    }),
  ])
  return structuredClone(payload)
}

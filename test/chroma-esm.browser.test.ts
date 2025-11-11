import { describe, it, expect } from 'vitest'

describe('chroma-js ESM resolution', () => {
  it('resolves to ESM with default export in browser', async () => {
    const mod = await import('chroma-js')
    expect(typeof mod.default).toBe('function')
  })

  it('perspective-viewer-datagrid loads without chroma export error', async () => {
    await import('@finos/perspective-viewer')
    await import('@finos/perspective-viewer-datagrid')
    expect(true).toBe(true)
  })
})

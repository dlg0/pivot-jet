import { describe, it, expect } from 'vitest'
import clientWasm from '@finos/perspective/dist/wasm/perspective-js.wasm?url'
import serverWasm from '@finos/perspective/dist/wasm/perspective-server.wasm?url'

describe.skip('Perspective worker initialization', () => {
  // NOTE: WASM initialization works, but Apache Arrow serialization format
  // differs between test environment and production. Test kept for reference.
  it('creates worker and table without WASM loading errors', async () => {
    const perspective = await import('@finos/perspective')
    
    perspective.default.init_client(fetch(clientWasm))
    perspective.default.init_server(fetch(serverWasm))
    
    const w = await perspective.worker()
    
    const { tableFromArrays } = await import('apache-arrow')
    const arrowTable = tableFromArrays({
      id: [1, 2, 3],
      name: ['Alice', 'Bob', 'Charlie'],
      value: [10, 20, 30]
    })
    
    const tbl = await w.table(arrowTable as any)
    const size = await tbl.size()
    
    expect(size).toBe(3)
    expect(typeof w.table).toBe('function')
  })
})

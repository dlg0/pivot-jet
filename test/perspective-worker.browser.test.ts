import { describe, it, expect } from 'vitest'
import clientWasm from '@finos/perspective/dist/wasm/perspective-js.wasm?url'
import serverWasm from '@finos/perspective/dist/wasm/perspective-server.wasm?url'

describe('Perspective worker initialization', () => {
  it('creates worker and table from Arrow IPC bytes', async () => {
    const perspective = await import('@finos/perspective')
    
    perspective.default.init_client(fetch(clientWasm))
    perspective.default.init_server(fetch(serverWasm))
    
    const w = await perspective.worker()
    
    const { tableFromArrays, tableToIPC } = await import('apache-arrow')
    const arrowTable = tableFromArrays({
      id: [1, 2, 3],
      name: ['Alice', 'Bob', 'Charlie'],
      value: [10, 20, 30]
    })
    
    const arrowIPC = tableToIPC(arrowTable)
    const tbl = await w.table(arrowIPC)
    const size = await tbl.size()
    
    expect(size).toBe(3)
    expect(typeof w.table).toBe('function')
  })
})

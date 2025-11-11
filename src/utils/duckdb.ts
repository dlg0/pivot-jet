import { AsyncDuckDB, duckdb, selectBundle } from 'duckdb-wasm'
import { tableFromIPC } from 'apache-arrow'

let _db: AsyncDuckDB | null = null

export async function initDuckDB(): Promise<AsyncDuckDB>{
  if (_db) return _db
  const bundle = await selectBundle({
    mvp: {
      mainModule: new URL('duckdb-mvp.wasm', import.meta.url).toString(),
      mainWorker: new URL('duckdb-browser-mvp.worker.js', import.meta.url).toString(),
    },
  })
  const worker = new Worker(bundle.mainWorker)
  const db = new AsyncDuckDB(new duckdb.ConsoleLogger(), worker)
  await db.instantiate(bundle.mainModule)
  _db = db
  return db
}

export async function loadCsvToArrowTable(db: AsyncDuckDB, file: File){
  const conn = await db.connect()
  const buf = new Uint8Array(await file.arrayBuffer())
  await db.registerFileHandle(file.name, buf, duckdb.DuckDBDataProtocol.BUFFER, true)
  const q = `SELECT * FROM read_csv_auto('${file.name}')`
  const result = await conn.query(q)
  const ipc = result.toIPC()
  const table = tableFromIPC(ipc)
  await conn.close()
  return { arrowTable: table, name: file.name }
}

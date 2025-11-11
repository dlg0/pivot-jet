import * as duckdb from '@duckdb/duckdb-wasm'

let _db: duckdb.AsyncDuckDB | null = null

export async function initDuckDB(): Promise<duckdb.AsyncDuckDB>{
  if (_db) return _db
  const bundle = await duckdb.selectBundle({
    mvp: {
      mainModule: new URL('@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm', import.meta.url).toString(),
      mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js', import.meta.url).toString(),
    },
  })
  const worker = new Worker(bundle.mainWorker!)
  const db = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), worker)
  await db.instantiate(bundle.mainModule!)
  _db = db
  return db
}

export async function loadCsvToArrowTable(db: duckdb.AsyncDuckDB, file: File){
  const conn = await db.connect()
  try {
    const buf = new Uint8Array(await file.arrayBuffer())
    await db.registerFileBuffer(file.name, buf)
    const q = `SELECT * FROM read_csv_auto('${file.name}')`
    const table = await conn.query(q)
    return { arrowTable: table, name: file.name }
  } finally {
    await conn.close()
  }
}

export async function terminateDuckDB() {
  if (_db && 'terminate' in _db && typeof (_db as any).terminate === 'function') {
    await (_db as any).terminate()
  }
  _db = null
}

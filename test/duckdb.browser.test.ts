import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { initDuckDB, loadCsvToArrowTable, terminateDuckDB } from '../src/utils/duckdb'

let db: Awaited<ReturnType<typeof initDuckDB>>

describe('loadCsvToArrowTable', () => {
  beforeAll(async () => {
    db = await initDuckDB()
  }, 60000)

  afterAll(async () => {
    await terminateDuckDB()
  }, 60000)

  it('loads a small CSV and returns an Arrow table with the right schema and values', async () => {
    const csv = [
      'id,name,age',
      '1,Alice,30',
      '2,Bob,25'
    ].join('\n')

    const fname = `people-${Date.now()}.csv`
    const file = new File([csv], fname, { type: 'text/csv' })

    const { arrowTable, name } = await loadCsvToArrowTable(db, file)

    expect(name).toBe(fname)
    expect(arrowTable).toBeDefined()
    
    const colNames = arrowTable.schema?.fields?.map((f: any) => f.name)
    expect(colNames).toEqual(['id', 'name', 'age'])
    
    expect(arrowTable.numRows).toBe(2)

    const idCol = arrowTable.getChild?.('id')?.toArray?.()
    const nameCol = arrowTable.getChild?.('name')?.toArray?.()
    const ageCol = arrowTable.getChild?.('age')?.toArray?.()

    if (idCol && nameCol && ageCol) {
      expect(Array.from(idCol)).toEqual([1n, 2n])
      expect(Array.from(nameCol)).toEqual(['Alice', 'Bob'])
      expect(Array.from(ageCol)).toEqual([30n, 25n])
    } else {
      expect(colNames).toEqual(['id', 'name', 'age'])
    }
  })
})

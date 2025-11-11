import React, { useEffect, useState } from 'react'
import { useAppStore } from './state/store'
import { initDuckDB, loadCsvToArrowTable } from './utils/duckdb'
import { setupHotkeys } from './utils/hotkeys'
import Shelves from './components/Shelves'
import Filters from './components/Filters'
import PerspectiveGrid from './components/PerspectiveGrid'
import ChartArea from './components/ChartArea'

export default function App() {
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  const { setDataset, datasetName, setDuckReady } = useAppStore()

  useEffect(() => { document.body.className = theme }, [theme])
  useEffect(() => { setupHotkeys() }, [])

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setDuckReady(false); const db = await initDuckDB(); setDuckReady(true)
    const { arrowTable, name } = await loadCsvToArrowTable(db, file)
    setDataset(arrowTable, name)
  }

  return (
    <div className="app">
      <header>
        <strong>Pivot Chart Tool</strong>
        <input type="file" accept=".csv,text/csv" onChange={onFile} />
        <div className="muted">Theme</div>
        <select value={theme} onChange={(e)=>setTheme(e.target.value as any)}>
          <option value="light">Light</option><option value="dark">Dark</option>
        </select>
        <div className="muted" style={{marginLeft:'auto'}}>
          Hotkeys: <span className="kbd">R</span> Rows <span className="kbd">C</span> Columns <span className="kbd">A</span> Values <span className="kbd">F</span> Facet
          <span className="kbd">[</span>/<span className="kbd">]</span> agg <span className="kbd">L</span> legend <span className="kbd">Shift+S</span> facet scales
        </div>
      </header>
      <aside className="sidebar"><Shelves /><Filters /></aside>
      <main className="content">
        <div className="muted">Dataset: {datasetName ?? '—'}</div>
        <ChartArea />
        <div className="viewer"><PerspectiveGrid /></div>
      </main>
    </div>
  )
}
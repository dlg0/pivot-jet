import React, { useState } from 'react'
import { useAppStore } from '../state/store'

export default function Shelves(){
  const { fields, view, addToShelf, removeFromShelves, setChartType } = useAppStore()
  const [selected, setSelected] = useState<string|undefined>(undefined)

  return (
    <div>
      <div className="shelf">
        <h4>Fields</h4>
        <div className="row">
          {fields.map(f=> (
            <span key={f} className="field" onClick={()=>setSelected(f)} title="Select then use hotkeys R/C/A/F">
              {f} {selected===f ? '✓' : ''}
            </span>
          ))}
        </div>
        <div className="muted" style={{marginTop:8}}>Select a field then use <span className="kbd">R</span>, <span className="kbd">C</span>, <span className="kbd">A</span>, <span className="kbd">F</span></div>
      </div>

      <div className="shelf">
        <h4>Rows</h4>
        <div className="row">{view.shelves.rows.map(f => (<span className="field" key={f} onClick={()=>removeFromShelves(f)}>{f}</span>))}</div>
      </div>
      <div className="shelf">
        <h4>Columns</h4>
        <div className="row">{view.shelves.columns.map(f => (<span className="field" key={f} onClick={()=>removeFromShelves(f)}>{f}</span>))}</div>
      </div>
      <div className="shelf">
        <h4>Values</h4>
        <div className="row">{view.shelves.values.map((v,idx) => (<span className="field" key={v.field} title={"agg: "+v.agg}>{v.field} • {v.agg}</span>))}</div>
      </div>
      <div className="shelf">
        <h4>Facet</h4>
        <div className="row">
          {view.shelves.facet.rows.map(f => (<span className="field" key={'fr-'+f} onClick={()=>removeFromShelves(f)}>{f}</span>))}
          {view.shelves.facet.columns.map(f => (<span className="field" key={'fc-'+f} onClick={()=>removeFromShelves(f)}>{f}</span>))}
        </div>
      </div>

      <div className="shelf">
        <h4>Chart</h4>
        <div className="row">
          {['table','column','line','area','stacked','percent_stacked','box'].map(t=>(
            <button key={t} className="field" onClick={()=>setChartType(t as any)}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

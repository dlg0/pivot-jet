import React, { useState } from 'react'
import { useAppStore } from '../state/store'

export default function Filters(){
  const { globalFilters, setGlobalFilters, fields } = useAppStore()
  const [field, setField] = useState<string>('')
  const [value, setValue] = useState<string>('')

  function addGlobal(){
    if (!field) return
    const gf = [...globalFilters, { field, op: 'in', values: value? value.split(',').map(v=>v.trim()) : [] }]
    setGlobalFilters(gf)
  }
  function remove(i:number){
    const gf = globalFilters.slice(); gf.splice(i,1); setGlobalFilters(gf)
  }

  return (
    <div className="shelf">
      <h4>Global Filters (apply to all views)</h4>
      <div className="row">
        {globalFilters.map((f,i)=>(
          <span className="field" key={i} onClick={()=>remove(i)}>{f.field} {f.op} {Array.isArray(f.values)? f.values.join('|'): f.value}</span>
        ))}
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <select value={field} onChange={e=>setField(e.target.value)}>
          <option value="">Field…</option>
          {fields.map(f=> <option key={f} value={f}>{f}</option>)}
        </select>
        <input placeholder="value1,value2…" value={value} onChange={e=>setValue(e.target.value)} />
        <button onClick={addGlobal}>Add</button>
      </div>
      <div className="muted" style={{marginTop:6}}>Type-ahead counts/top-N can be added; this is the minimal global filter UX.</div>
    </div>
  )
}

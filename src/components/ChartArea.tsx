import React, { useEffect, useRef } from 'react'
import embed from 'vega-embed'
import { useAppStore } from '../state/store'
import { buildBoxPlotSpec } from '../utils/viewSpec'

export default function ChartArea(){
  const { view } = useAppStore()
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if (view.chart.type !== 'box') return
    if (!boxRef.current) return
    const spec = buildBoxPlotSpec([])
    embed(boxRef.current, spec, { actions:false })
  }, [view])

  if (view.chart.type === 'box'){
    return <div className="shelf"><h4>Box Plot</h4><div ref={boxRef}></div></div>
  }
  return <div className="shelf"><h4>Chart</h4><div className="muted">Using Perspective’s chart plugins for non-box charts (wired via the grid viewer below).</div></div>
}

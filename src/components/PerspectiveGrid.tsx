import React, { useEffect, useRef } from 'react'
import '@finos/perspective-viewer'
import '@finos/perspective-viewer-datagrid'
import '@finos/perspective-viewer-d3fc'
import { useAppStore } from '../state/store'
import { applyViewToPerspective } from '../utils/perspective'

export default function PerspectiveGrid(){
  const viewerRef = useRef<any>()
  const { table, view, globalFilters } = useAppStore()

  useEffect(()=>{
    if (!viewerRef.current || !table) return
    applyViewToPerspective(viewerRef.current, table, view, globalFilters)
  }, [table, view, globalFilters])

  return <perspective-viewer ref={viewerRef} style={{height:'100%'}}></perspective-viewer>
}

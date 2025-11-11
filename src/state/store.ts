import { create } from 'zustand'
import type { Table } from 'apache-arrow'

type Agg = 'sum'|'avg'|'min'|'max'|'count'|'distinct'
type ChartType = 'table'|'column'|'line'|'area'|'stacked'|'percent_stacked'|'box'

export type ViewSpec = {
  version: number
  datasetId?: string
  label?: string
  shelves: { rows: string[]; columns: string[]; values: { field: string, agg: Agg }[]; facet: { rows: string[], columns: string[] } }
  localFilters: Array<{ field: string, op: string, value?: any, values?: any[] }>
  chart: { type: ChartType; options: { legend: boolean, percentMode?: boolean, scales?: { facetScaleMode: 'consistent'|'perFacet' } } }
  sort?: { by: string, direction: 'asc'|'desc', scope: 'row'|'column' }
}

export type GlobalFilters = Array<{ field: string, op: string, value?: any, values?: any[] }>

type State = {
  duckReady: boolean
  datasetName?: string
  table?: Table
  fields: string[]
  globalFilters: GlobalFilters
  view: ViewSpec
  setDuckReady: (ready:boolean)=>void
  setDataset: (table: Table, name: string)=>void
  setGlobalFilters: (gf: GlobalFilters)=>void
  addToShelf: (shelf: 'rows'|'columns'|'values'|'facet_rows'|'facet_columns', field: string)=>void
  removeFromShelves: (field: string)=>void
  cycleAgg: (index: number, dir: -1|1)=>void
  setChartType: (t: ChartType)=>void
  toggleLegend: ()=>void
  toggleFacetScale: ()=>void
}

const defaultView: ViewSpec = {
  version: 1,
  shelves: { rows: [], columns: [], values: [], facet: { rows: [], columns: [] } },
  localFilters: [],
  chart: { type: 'column', options: { legend: true, scales: { facetScaleMode: 'consistent' } } }
}

export const useAppStore = create<State>((set,get)=>({
  duckReady: false, fields: [], globalFilters: [], view: defaultView,
  setDuckReady: (ready)=> set({duckReady: ready}),
  setDataset: (table, name)=> set({ table, datasetName: name, fields: table?.schema?.fields?.map(f=>f.name) ?? [] }),
  setGlobalFilters: (gf)=> set({ globalFilters: gf }),
  addToShelf: (shelf, field)=> set(state => {
    const v = structuredClone(state.view)
    if (shelf === 'rows') v.shelves.rows.push(field)
    else if (shelf === 'columns') v.shelves.columns.push(field)
    else if (shelf === 'values') v.shelves.values.push({ field, agg: 'sum' })
    else if (shelf === 'facet_rows') v.shelves.facet.rows.push(field)
    else if (shelf === 'facet_columns') v.shelves.facet.columns.push(field)
    return { view: v }
  }),
  removeFromShelves: (field)=> set(state => {
    const v = structuredClone(state.view)
    v.shelves.rows = v.shelves.rows.filter(f=>f!==field)
    v.shelves.columns = v.shelves.columns.filter(f=>f!==field)
    v.shelves.values = v.shelves.values.filter(vv=>vv.field!==field)
    v.shelves.facet.rows = v.shelves.facet.rows.filter(f=>f!==field)
    v.shelves.facet.columns = v.shelves.facet.columns.filter(f=>f!==field)
    return { view: v }
  }),
  cycleAgg: (index, dir)=> set(state => {
    const v = structuredClone(state.view)
    const cur = v.shelves.values[index]; if (!cur) return {}
    const aggs: Agg[] = ['sum','avg','min','max','count','distinct']
    let i = aggs.indexOf(cur.agg); i = (i + dir + aggs.length) % aggs.length
    cur.agg = aggs[i]; return { view: v }
  }),
  setChartType: (t)=> set(state => ({ view: { ...state.view, chart: { ...state.view.chart, type: t } } })),
  toggleLegend: ()=> set(state => ({ view: { ...state.view, chart: { ...state.view.chart, options: { ...state.view.chart.options, legend: !state.view.chart.options.legend } } } })),
  toggleFacetScale: ()=> set(state => {
    const cur = state.view.chart.options.scales?.facetScaleMode ?? 'consistent'
    const next = cur === 'consistent' ? 'perFacet' : 'consistent'
    return { view: { ...state.view, chart: { ...state.view.chart, options: { ...state.view.chart.options, scales: { facetScaleMode: next } } } } }
  }),
}))
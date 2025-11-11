import type { Table as ArrowTable } from 'apache-arrow'
import type { ViewSpec, GlobalFilters } from '../state/store'

export async function applyViewToPerspective(viewer: any, arrow: ArrowTable, view: ViewSpec, global: GlobalFilters){
  const { worker } = await import('@finos/perspective')
  const w = worker()
  const tbl = await w.table(arrow as any)

  const aggregates: Record<string,string> = {}
  view.shelves.values.forEach(v => { aggregates[v.field] = v.agg })

  const filters: any[] = []
  ;[...global, ...view.localFilters].forEach(f=>{
    if ('values' in f && Array.isArray(f.values)){
      filters.push([f.field, 'in', f.values])
    } else if ('value' in f) {
      filters.push([f.field, f.op, f.value])
    }
  })

  const config = {
    row_pivots: view.shelves.rows,
    column_pivots: view.shelves.columns,
    aggregates,
    filter: filters,
    columns: view.shelves.values.map(v=>v.field),
  }

  await viewer.load(tbl)
  await viewer.restore(config as any)

  const plugin = ({
    table: 'Datagrid',
    column: 'Y Bar',
    line: 'Y Line',
    area: 'Y Area',
    stacked: 'Y Bar',
    percent_stacked: 'Y Bar',
    box: 'Datagrid',
  } as Record<string,string>)[view.chart.type] ?? 'Datagrid'
  viewer.setAttribute('plugin', plugin)
  if (view.chart.options.legend) viewer.setAttribute('show-legend', 'true')
  else viewer.removeAttribute('show-legend')
}

export function buildBoxPlotSpec(data: any[]){
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 640,
    height: 240,
    data: { values: data },
    mark: { type: 'boxplot' },
    encoding: {
      x: { field: 'category', type: 'nominal' },
      y: { field: 'value', type: 'quantitative' },
      color: { field: 'series', type: 'nominal', legend: { disable: false } }
    }
  }
}

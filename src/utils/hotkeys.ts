import tinykeys from 'tinykeys'
import { useAppStore } from '../state/store'

export function setupHotkeys(){
  tinykeys(window, {
    'KeyR': ()=> add('rows'),
    'KeyC': ()=> add('columns'),
    'KeyA': ()=> add('values'),
    'KeyF': ()=> add('facet_rows'),
    'BracketLeft': ()=> useAppStore.getState().cycleAgg(0,-1),
    'BracketRight': ()=> useAppStore.getState().cycleAgg(0,1),
    'KeyL': ()=> useAppStore.getState().toggleLegend(),
    'Shift+KeyS': ()=> useAppStore.getState().toggleFacetScale(),
  })
}

function add(shelf: 'rows'|'columns'|'values'|'facet_rows'){
  const selected = Array.from(document.querySelectorAll('.shelf .field')).find(el => el.textContent?.includes('✓'))?.textContent
  const field = selected?.replace('✓','').trim()
  if (field) useAppStore.getState().addToShelf(shelf, field)
}

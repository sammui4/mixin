import HkmTable from './src/table'
import HkmTableColumn from './src/column'

export default function(Vue) {
  Vue.component(HkmTable.name, HkmTable);
  Vue.component(HkmTableColumn.name, HkmTableColumn);
}
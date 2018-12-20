import { flattern, sortByFixed } from '../../_utils'

export default {
  name: 'HkmTfooter',

  inject: ['store'],

  props: {
    tableType: {
      type: String,
      default: ''
    }
  },  

  render (h) {
    let store = this.store;
    let hasRemark = !!store.remark;
    let hasSum = store.showSummary && !!store.records.length;
    
    if (!hasRemark && !hasSum) {
      return null;
    }

    // 1,3,5 分别是上方固定表头 左上固定 右上固定
    let isTop = this.tableType.slice(-3) === 'top';
    
    if (isTop) {
      return null;
    }

    let columns = flattern(
      sortByFixed(store.columns),
      'children',
      column => column.isLeaf
    );

    return (
      <tbody class="hkm-table__footer">
        {
          hasSum &&
          <tr class="hkm-table__footer-row">
            {
              columns.map((column, k) => {
                return (
                  <td
                    key={k}
                    class="hkm-table__footer-cell">
                    <div class={`cell align-${column.align} ${column.cellClassName}`}>{ this.renderCell(column) }</div>
                  </td>
                );
              })
            }
          </tr>  
        }

        {
          hasRemark &&
          <tr class="hkm-table__footer-row">
            {
              columns.map((column, k) => {
                return (
                  <td
                    key={k}
                    class="hkm-table__footer-cell">
                    <div class={`cell align-${column.align} ${column.cellClassName}`}>{ store.remark[column.prop] }</div>
                  </td>
                );
              })
            }
          </tr>            
        }
      </tbody>
    );
  },

  methods: {
    renderCell (column) {
      let store = this.store;

      if (column.type !== 'normal') {
        return column.type === 'index' ? store.summaryText : '';
      }

      return store.summaryMethod(column, store.records);
    }
  }
}
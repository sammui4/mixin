import { flattern, sortByFixed } from '../../_utils'
import HkmCheckbox from '../../checkbox'

const MENU_MAP = {
  'freeze_line_left': '左边冻结',
  'freeze_line_right': '右边冻结',
  // 'lock_line_left': '左边锁定',
  // 'lock_line_right': '右边锁定',
  'unfreeze_line': '解除冻结',
};

function setColspan(puid, columns) {
  if (!puid) {
    return;
  }

  let cds = [];
  let parent = null;

  columns.forEach(column => {
    if (column.uid === puid) {
      parent = column;
    }

    if (column.puid === puid) {
      cds.push(column);
    }
  })

  if (parent && cds.length) {
    parent.colspan = cds.map(a => a.colspan).reduce((a, b) => (a + b), 0);

    return setColspan(parent.puid, columns);
  }

}

export default {
  name: 'HkmThead',
  inject: ['store'],

  data () {
    return {

    };
  },

  props: {
    tableType: {
      type: String,
      default: ''
    }
  },

  computed: {
    isAllSelected() {
      return this.store.isAllSelected;
    },
  },

  render (h) {
    let store = this.store;
    let maxLevel = 0;
    let rows = [];  

    let columns = flattern(
      sortByFixed(store.columns), 
      'children', 
      column => !!(maxLevel = Math.max(column.level, maxLevel))
    );    

    columns.forEach(column => {
      let row = rows[column.rowIndex];

      if (!row) {
        row = rows[column.rowIndex] = [];
      }

      setColspan(column.puid, columns);

      if (column.isLeaf) {
        column.rowspan = maxLevel - column.level + 1;
      }

      row.push(column);
    })

    return (
      <thead class="hkm-table__header">
        {
          rows.map((row, i) => {
            return (
              <tr 
                key={ i } 
                class="hkm-table__header-row">
                {
                  row.map((column, k) => {
                    return (
                      <th
                        key={ k }
                        class="hkm-table__header-cell"
                        rowspan={ column.rowspan }
                        colspan={ column.colspan }
                        onDblclick={ e => this.handleDblclick(column) }
                        onContextmenu={e => this.handleContextmenu(e, {column})}>
                        <div class={`cell align-${column.headerAlign} ${column.headerCellClassName}`}>
                          { 
                            column.renderHeader(h, { 
                              column, 
                              context: column.type === 'selection' ? this : column.context
                            }) 
                          }

                          {
                            column.renderSortProxy(h, {
                              column,
                              context: this
                            })
                          }
                        </div>

                        { column.renderResizeProxy(h, { column, context: this }) }
                      </th>
                    )
                  })
                }
              </tr>
            )
          })
        }
      </thead>
    );
  },

  methods: {

    handleDown (e, column) {

      let x = e.clientX;
      let dom = e.target.parentNode;   
      let domBound = dom.getBoundingClientRect();
      let wrapBound = this.$parent.getWrapBound();
      let resizeProxy = this.store.resizeProxy;
      let resizeProxyLeft = domBound.right - wrapBound.left;
      let minLeft = domBound.left - wrapBound.left + column.minWidth;
      let maxLeft = wrapBound.right;  

      resizeProxy.visiable = true;
      resizeProxy.left = resizeProxyLeft + 'px';

      let move = ev => {
        let delta = ev.clientX - x;
        let left = resizeProxyLeft + delta;

        left = Math.max(minLeft, Math.min(maxLeft, left));
        
        resizeProxy.left = left + 'px';
      }

      let up = ev => {
        let delta = parseInt(resizeProxy.left) - resizeProxyLeft;

        // 此处 由它爹统一处理
        this.$emit('drag-end', {column, delta});

        resizeProxy.visiable = false;
        document.removeEventListener('mouseup', up);
        document.removeEventListener('mousemove', move);
      }

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },

    handleDblclick (column) {
      if (!column.isLeaf) {
        return;
      }
      // 留给他爹处理
      this.$emit('reset-width', column);
    },

    toggleAllSelection () {
      this.$emit('toggle-all-selection');
    },

    handleSortClick (e, sortOrder, column) {
      e.stopPropagation();

      this.$emit('sort-click', { sortOrder, column });
    },

    handleContextmenu (e, { column }) {

      if (column.isSubColumn) {
        return;
      }

      let store = this.store;
      let items = store.headContextmenu;

      if (!items.length) {
        return;
      }

      let menuItems = [];
      let tableType = this.tableType;
      let isTop = tableType === 'left_top' || tableType === 'right_top';

      items.forEach(m => {
        let v = MENU_MAP[m];

        if (!v) {
          return;
        }

        if (m === 'unfreeze_line' && !isTop) {
          return;
        }

        if ((m === 'freeze_line_left' || m === 'freeze_line_right') && isTop) {
          return;
        }

        menuItems.push({text: v, value: m});
      })

      this.$emit('context-menu', { 
        column, 
        tableType,
        menuItems, 
        source: 'thead',
        recordIndex: -1, 
        x: e.clientX, 
        y: e.clientY 
      });
    }
  },

  components: {
    HkmCheckbox
  }  
}
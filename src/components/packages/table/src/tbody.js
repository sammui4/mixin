import { flattern, sortByFixed, isEmptyValue } from '../../_utils'
import HkmCheckbox from '../../checkbox'
import Clusterize from 'clusterize.js'
const MENU_MAP = {
  'copy': '复制',
  'remove_row': '移除该行',
  'insert_row_up': '上方插入新行',
  'insert_row_down': '下方插入新行',
  'copy_row_up': '复制该行上方插入',
  'copy_row_down': '复制该行下方插入',
  'unfreeze_row': '解除冻结',
  'freeze_row': '冻结此行',
  'append_row': '添加新行'
};

export default {
  name: 'HkmTbody',

  inject: ['store'],

  props: {
    tableType: {
      type: String,
      default: ''
    }
  },
  componens:{
    Clusterize
  },
  mounted () {
    var clusterize = new Clusterize({
      scrollElem: 'tbody',
      contentElem: 'tr'
    });
  },
  render (h) {
    let store = this.store;

    let columns = flattern(
      sortByFixed(store.columns),
      'children',
      column => column.isLeaf
    );
    // 没有数据
    if (!store.records.length) {
      if (this.tableType === 'master') {
        return (
          <tbody class="hkm-table__body">
            <tr class="hkm-table__body-row">
              <td
                colspan={columns.length}
                rowspan="1"
                class="hkm-table__body-cell no-data"
                onContextmenu={e => this.handleNoDataContextmenu(e)}>暂无数据</td>
            </tr>
          </tbody>
        )
      }

      return null;
    }

    // 1,3,5 分别是上方固定表头 左上固定 右上固定
    let isTop = this.tableType.slice(-3) === 'top';

    let records = store[isTop ? 'topRecords' : 'records'];

    return (
      <tbody class="hkm-table__body">
        {
          records.map((record, i) => {
            return (
              <tr
                class={this.getRowClass(record)}
                key={this.getKey(record, i)}
                onClick={e=> this.handleRowClick(e, {record})}>
                {
                  columns.map((column, k) => {
                    let { colspan, rowspan } = store.spanMethod({ record, column, rowIndex: i, columnIndex: k });

                    if (!colspan || !colspan) {
                      return null;
                    }

                    return (
                      <td
                        key={ k }
                        rowspan={ rowspan }
                        colspan={ colspan }
                        class={`hkm-table__body-cell align-${column.align} ${column.cellClassName}`}
                        onClick={e => this.handleCellClick(e, { column, record, recordIndex: i, columnIndex: k })}
                        onDblclick={e => this.handleCellDblClick(e, { column, record, recordIndex: i, columnIndex: k }) }
                        onContextmenu={e => this.handleContextmenu(e, { column, recordIndex: i })}>
                        <div class="cell">{
                          column.renderCell(h, {
                            record,
                            column,
                            index: i,
                            rowspan,
                            colspan,
                            context: column.type === 'selection' ? this : column.context
                          })
                        }</div>
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    );
  },

  methods: {
    isSelected (record) {
      let selections = this.store.selections;

      return selections.indexOf(record) > -1;
    },

    toggleSelection (data) {
      this.$emit('toggle-selection', data);
    },

    handleRowClick (e, { record }) {
      let store = this.store;

      if (store.highLightCurrent) {
        store.currentRecord = record;
      }

      this.$emit('row-click', { record, e });
    },

    handleCellClick (e, {column, record, recordIndex, columnIndex}) {

      this.$emit('cell-click', { column, record, e });

      if (!column.editable) {
        return;
      }

      e.stopPropagation();

      let dom = e.currentTarget;

      let bound = dom.getBoundingClientRect();
      let pos = { left: bound.left, top: bound.top, width: bound.width, height: bound.height };

      this.$emit('focus-cell', { column, record, pos, recordIndex, columnIndex });

    },

    handleCellDblClick (e, {column, record, recordIndex, columnIndex}) {
      if (!column.editable) {
        return;
      }

      e.stopPropagation();

      let dom = e.currentTarget;
      let bound = dom.getBoundingClientRect();
      let pos = { left: bound.left, top: bound.top, width: bound.width, height: bound.height };

      this.$emit('start-edit', { column, record, pos, recordIndex, columnIndex });
    },

    handleContextmenu(e, { column, recordIndex }) {
      let items = this.store.bodyContextmenu;

      if (!items.length) {
        return;
      }

      let menuItems = [];
      let tableType = this.tableType;
      let isTop = tableType.slice(-3) === 'top';

      items.forEach(m => {
        let v = MENU_MAP[m];

        if (!v) {
          return;
        }

        if (m === 'unfreeze_row' && !isTop) {
          return;
        }

        if (m === 'freeze_row' && isTop) {
          return;
        }

        menuItems.push({text: v, value: m});
      })

      this.$emit('context-menu', {
        column,
        menuItems,
        source: 'tbody',
        recordIndex,
        x: e.clientX,
        y: e.clientY
      })
    },

    handleNoDataContextmenu (e) {
      let items = this.store.bodyContextmenu;

      if (!items.length || items.indexOf('append_row') === -1) {
        return;
      }

      this.$emit('context-menu', {
        column: null,
        menuItems: [{value: 'append_row', text: MENU_MAP['append_row']}],
        source: 'tbody',
        recordIndex: -1,
        x: e.clientX,
        y: e.clientY
      })
    },

    getKey (record, i) {
      let rowKey = this.store.rowKey;

      if (!rowKey) {
        return i;
      }

      return isEmptyValue(record[rowKey]) ? i : record[rowKey];
    },

    getRowClass (record) {
      let cls = 'hkm-table__body-row';
      let store = this.store;

      if (store.selections.indexOf(record) > -1) {
        cls += ' high-light__row--selected';
      }

      if (
        (store.highLightCurrent && store.currentRecord == record)
      ) {
        cls += ' high-light__row--click';
      }

      return cls;
    }
  },

  components: {
    HkmCheckbox
  }
}

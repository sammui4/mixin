<template>
  <div class="hkm-sheet">
    <table
      class="hkm-table"
      cellspacing="0"
      cellpadding="0"
      ref="table">

      <hkm-colgroup></hkm-colgroup>

      <hkm-thead
        :table-type="tableType"
        @drag-end="dragEnd"
        @reset-width="resetWidth"
        @toggle-all-selection="toggleAllSelection"
        @sort-click="handleSortClick"
        @context-menu="handleContextmenu"></hkm-thead>

      <hkm-tbody
        ref="tbody"
        :table-type="tableType"
        @focus-cell="handleFocusCell"
        @row-click="handleRowClick"
        @cell-click="handleCellClick"
        @start-edit="handleStartEdit"
        @toggle-selection="toggleSelection"
        @context-menu="handleContextmenu"></hkm-tbody>

      <hkm-tfoot
        :table-type="tableType"></hkm-tfoot>

    </table>

    <!-- 编辑高亮框提示 -->
    <div
      v-show="focusProxy.visiable"
      class="hkm-focus-proxy"
      :style="{
        left: focusProxy.left,
        top: focusProxy.top,
        width: focusProxy.width,
        height: focusProxy.height
      }">

      <div
        class="hkm-copy-corner"
        @mousedown="handleCopyMousedown"></div>
    </div>

    <!-- 编辑框 -->
    <div
      class="hkm-edit-proxy"
      v-show="editProxy.visiable"
      :style="{
        left: editProxy.left,
        top: editProxy.top,
        width: editProxy.width,
        height: editProxy.height
      }"
      @click.stop>
      <textarea
        ref="editArea"
        v-model="editProxy.content"
        @change="handleEditContentChange"
        @keydown.enter.prevent="handleAreaEnter"></textarea>
    </div>
  </div>
</template>

<script>
import HkmThead from './thead'
import HkmTbody from './tbody'
import HkmTfoot from './tfoot'
import HkmColgroup from './colgroup'

import {
  flattern,
  matchesSelector,
  getDomIndex,
  copy,
  extendModel,
  sortByFixed
  } from '../../_utils'

export default {
  name: 'HkmSheet',

  inject: ['store'],

  props: {
    tableType: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      focusData: null,
      focusProxy: {
        left: '0px',
        top: '0px',
        width: '0px',
        height: '0px',
        visiable: false
      },

      editProxy: {
        left: '0px',
        top: '0px',
        width: '0px',
        height: '0px',
        content: '',
        visiable: false
      }
    }
  },

  created () {

    this.handleDocClick = () => {
      let store = this.store;

      if (store.noClick) {
        return;
      }

      this.cancelFocus();
      this.confirmEdit();
    }

    this.cancelFocus = () => {
      this.focusData = null;

      this.focusProxy.visiable = false;
    };

    this.confirmEdit = () => {
      let editData = this.editData;

      if (!editData) {
        return;
      }

      let proxy = this.editProxy;

      editData.record[editData.column.prop] = proxy.content;

      this.$emit('confirm-edit', {column: editData.column, record: editData.record});

      proxy.visiable = false;

      this.editData = null;
    };

    this.startEdit = (e) => {
      let focusData = this.focusData;

      if (!focusData || e.keyCode != 13) {
        return;
      }

      e.preventDefault();
      // 回车
      this.handleStartEdit(focusData);

    };

  },

  mounted () {
    this.bindEvent();
  },

  methods: {
    bindEvent () {
      document.body.addEventListener('click', this.handleDocClick);
      document.body.addEventListener('keydown', this.startEdit);
    },

    getWrapBound () {
      return this.$parent.getWrapBound();
    },

    getTableBound () {
      return this.$refs.table.getBoundingClientRect();
    },

    findCell (node) {

      while (node && node.nodeType == 1) {
        if (matchesSelector(node, '.hkm-table__body-cell')) {
          return node;
        }

        node = node.parentNode;
      }

      return null;
    },

    getBody () {
      return this.$refs.tbody.$el;
    },

    getRows (cell) {
      return cell.parentNode.parentNode.children;
    },

    getCurrentRows () {
      return this.$refs.tbody.$el.children;
    },

    handleCopyMousedown (e) {
      let focusData = this.focusData;
      let pos = focusData.pos;
      let column = focusData.column;
      let record = focusData.record;
      let content = record[column.prop];
      let recordIndex = focusData.recordIndex;
      let columnIndex = focusData.columnIndex;
      let currentRows = this.getCurrentRows();
      let wrap = this.$parent.$refs.wrap;
      let tbodies = wrap.querySelectorAll('.hkm-table__body');

      this.store.noClick = true;

      // 储存结束位置
      let currentRowIndex = -1;

      let clear = _ => {
        let cells = wrap.querySelectorAll('.high-light__cell');

        for (let i = 0, len = cells.length; i < len; i++) {
          cells[i].classList.remove('high-light__cell');
        }

      }

      let add = rowIndex => {
        for (let i = 0, len = tbodies.length; i < len; i++) {
          let row = tbodies[i].children[rowIndex];

          if (row) {
            row.children[columnIndex].classList.add('high-light__cell');
          }
        }
      }

      let move = ev => {
        let x = ev.clientX;
        let y = ev.clientY;
        let node = document.elementFromPoint(x, y);

        let cell = this.findCell(node);

        if (!cell) {
          return;
        }

        clear();

        let rowIndex = getDomIndex(cell.parentNode);

        if (rowIndex === recordIndex) {
          currentRowIndex = -1;
          return;
        }

        let start = rowIndex;
        let end = recordIndex;
        let dir = start > end ? 'down' : 'up';

        while (start !== end) {
          add(dir === 'up' ? start++ : start--);
        }

        currentRowIndex = rowIndex;

      }

      let up = ev => {
        document.removeEventListener('mouseup', up);
        document.removeEventListener('mousemove', move);

        clear();

        wrap = tbodies = null;

        if (currentRowIndex < 0) {
          return;
        }

        let start = currentRowIndex;
        let end = recordIndex;
        let records = this.store.records;
        let dir = start > end ? 'down' : 'up';

        while (start !== end) {
          records[start][column.prop] = content;
          dir === 'up' ? start++ : start--;
        }

      }

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },

    handleFocusCell ({ column, record, pos, recordIndex, columnIndex }) {
      let proxy = this.focusProxy;
      let bound = this.getTableBound();

      proxy.left = pos.left - bound.left + 'px';
      proxy.top = pos.top - bound.top + 'px';
      proxy.width = pos.width + 'px';
      proxy.height = pos.height + 'px';
      proxy.visiable = true;

      this.focusData = { column, record, pos, recordIndex, columnIndex };

      this.confirmEdit();

      this.$emit('cancel-focus', this);
    },

    handleStartEdit ({ column, record, pos, recordIndex, columnIndex }) {
      let proxy = this.editProxy;
      let focusProxy = this.focusProxy;

      proxy.content = record[column.prop];

      proxy.left = focusProxy.left;
      proxy.top = focusProxy.top;
      proxy.width = focusProxy.width;
      proxy.height = focusProxy.height;
      proxy.visiable = true;

      this.editData = {column, record, pos, recordIndex, columnIndex};

      let bound = this.getWrapBound();
      let scrollBar = this.store.scrollBar;

      if (pos.bottom > bound.bottom) {
        this.$parent.setScrollTop(pos.bottom - bound.bottom + parseInt(scrollBar.top));
      }

      if (pos.right > bound.right) {
        this.$parent.setScrollLeft(pos.right - bound.right + parseInt(scrollBar.left));
      }

      this.cancelFocus();

      this.$nextTick(_ => {
        this.$refs.editArea.focus();
      })
    },

    handleEditContentChange () {
      let editData = this.editData;

      if (!editData) {
        return;
      }

      let proxy = this.editProxy;

      editData.record[editData.column.prop] = proxy.content;
    },

    handleAreaEnter (e) {

      let editData = this.editData;
      let index = editData.recordIndex + 1;
      let dom = this.getCurrentRows()[index]

      if (!dom) {
        return this.confirmEdit();
      }

      let bound = dom.getBoundingClientRect();
      let pos = editData.pos;

      pos.top = bound.top;
      pos.bottom = bound.bottom;

      this.handleFocusCell({
        column: editData.column,
        record: this.store.records[index],
        pos,
        recordIndex: index,
        columnIndex: editData.columnIndex,
      });
    },

    toggleSelection ({column, record, rowspan, colspan}) {
      let store = this.store;
      let records = store.records;
      let selections = store.selections;
      let index = selections.indexOf(record);

      if (index > -1) {
        let total = rowspan;

        while (total--) {
          selections.splice(index, 1);
        }
      } else {

        if (column.isSingle) {
          selections = store.selections = [];
        }

        let start = records.indexOf(record);

        selections.push.apply(selections, records.slice(start, start + rowspan));
      }

      store.isAllSelected = !!records.length && store.selections.length === records.length;

      this.$emit('toggle-selection', record);
    },

    toggleAllSelection () {
      let store = this.store;

      store.isAllSelected = !store.isAllSelected;

      if (store.isAllSelected) {
        store.selections = store.records.slice();
      } else {
        store.selections = [];
      }

      this.$emit('toggle-all-selection');
    },

    dragEnd (data) {
      this.$emit('drag-end', data);
    },

    resetWidth (data) {
      this.$emit('reset-width', data);
    },

    handleSortClick (data) {
      this.$emit('sort-click', data);
    },

    handleContextmenu (data) {
      this.$emit('context-menu', data);
    },

    handleRowClick (data) {
      this.$emit('row-click', data);
    },

    handleCellClick (data) {
      this.$emit('cell-click', data);
    }
  },

  beforeDestroy () {
    document.body.removeEventListener('click', this.handleDocClick);
    document.body.removeEventListener('keydown', this.startEdit);
  },

  components: {
    HkmThead,
    HkmTbody,
    HkmTfoot,
    HkmColgroup
  }
}
</script>

<style lang="scss">
@import '../../_assets/scss/variable.scss';

.hkm-table {
  table-layout: fixed;
  width: 100%;
  font-size: 12px;
  border-bottom: 1px solid #000;
  background: #fff;

  .cell {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.2;
    padding: 4px 2px;
    width: 100%;
  }

  .sort-caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
  }

  .sort-caret {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    left: 7px;

    &.asc {
      border-bottom-color: $caret-color;
      top: 5px;

      &.active {
        border-bottom-color: $main-color;
      }
    }

    &.desc {
      border-top-color: $caret-color;
      bottom: 7px;

      &.active {
        border-top-color: $main-color;
      }
    }
  }

  .align-left {
    text-align: left;
  }

  .align-right {
    text-align: right;
  }

  .align-center {
    text-align: center;
  }

  .no-data {
    height: 48px;
    font-size: 16px;
    text-align: center;
    color: $no-data-color;
  }
}

.hkm-table__header-cell {
  position: relative;
  color: $header-color;

  .resize-proxy {
    position: absolute;
    right: 0;
    width: 8px;
    height: 100%;
    top: 0;
    z-index: 9;
    cursor: col-resize;
  }
}

.hkm-table__header-row, .hkm-table__footer-row {
  background: $header-bg-color;
}

.hkm-table__body-row {
  &.high-light__row--click {
    background: $high-light-click;
  }

  &.high-light__row--selected {
    background: $high-light-color;
  }
}

.hkm-table__header-cell, .hkm-table__body-cell, .hkm-table__footer-cell {
  border-left: 1px solid #000;
  border-top: 1px solid #000;
  box-sizing: border-box;

  &:last-child {
    border-right: 1px solid #000;
  }
}

.hkm-table__body-cell, .hkm-table__footer-cell {
  color: $content-color;
}

.hkm-table__body-cell {
  // &:hover {
  //   background: $hover-color;
  // }

  &.high-light__cell {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      z-index: 9;
      background: $main-color;
      opacity: 0.4;
      left: 0;
      top: 0;
    }
  }
}

.hkm-focus-proxy {
  position: absolute;
  z-index: 9;
  pointer-events: none;
  box-sizing: border-box;
  border: 2px solid $main-color;
}

.hkm-copy-corner {
  pointer-events: auto;
  position: absolute;
  width: 6px;
  height: 6px;
  border: 1px solid #fff;
  background: $main-color;
  right: -4px;
  bottom: -4px;
  cursor: crosshair;
}
</style>





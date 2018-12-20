<template>
  <div
    class="hkm-table-wrapper"
    ref="wrap">
    <div class="hkm-hidden-columns">
      <slot></slot>
    </div>

    <div
      class="hkm-table-box"
      @mousewheel="handleMousewheel"
      @DOMMouseScroll="handleMousewheel"
      @contextmenu.prevent
      :style="{
        height: boxHeight
      }">
      <!-- 原始表 -->
      <div
        class="hkm-table__master-wrapper">
        <div
          class="hkm-table__master"
          :style="{top: `-${store.scrollBar.top}`, left: `-${store.scrollBar.left}`, width: tableWidth}"
          ref="master">

          <hkm-sheet
            ref="master_sheet"
            table-type="master"
            @drag-end="dragEnd"
            @reset-width="resetWidth"
            @sort-click="handleSortClick"
            @context-menu="handleContextmenu"
            @cancel-focus="handleCancelFocus"
            @row-click="handleRowClick"
            @cell-click="handleCellClick"
            @confirm-edit="handleConfirmEdit"
            @toggle-selection="handleToggleSelection"
            @toggle-all-selection="handleToggleAllSelection"></hkm-sheet>

        </div>
      </div>

      <!-- 上面固定，包括表头 -->
      <div
        class="hkm-table__top-wrapper"
        v-if="store.hasScrollTop">
        <div
          class="hkm-table__top"
          :style="{left: `-${store.scrollBar.left}`, width: tableWidth}">

          <hkm-sheet
            ref="top_sheet"
            table-type="top"
            @drag-end="dragEnd"
            @reset-width="resetWidth"
            @sort-click="handleSortClick"
            @context-menu="handleContextmenu"
            @cancel-focus="handleCancelFocus"
            @row-click="handleRowClick"
            @cell-click="handleCellClick"
            @confirm-edit="handleConfirmEdit"
            @toggle-selection="handleToggleSelection"
            @toggle-all-selection="handleToggleAllSelection"></hkm-sheet>

        </div>
      </div>

      <!-- 左边固定列 -->
      <div
        class="hkm-table__left-wrapper"
        :style="{width: leftTableStyle.width, height: leftTableStyle.height}"
        v-if="store.hasLeftFixed && store.hasScrollLeft">
        <div
          class="hkm-table__left"
          :style="{top: `-${store.scrollBar.top}`, width: tableWidth}">

          <hkm-sheet
            ref="left_sheet"
            table-type="left"
            @drag-end="dragEnd"
            @reset-width="resetWidth"
            @sort-click="handleSortClick"
            @context-menu="handleContextmenu"
            @cancel-focus="handleCancelFocus"
            @row-click="handleRowClick"
            @cell-click="handleCellClick"
            @confirm-edit="handleConfirmEdit"
            @toggle-selection="handleToggleSelection"
            @toggle-all-selection="handleToggleAllSelection"></hkm-sheet>

        </div>
      </div>

      <!-- 左上角 -->
      <div
        class="hkm-table__left-top-wrapper"
        :style="{width: leftTableStyle.width}"
        v-if="store.hasLeftFixed && store.hasScrollLeft">
        <div
          class="hkm-table__left-top"
          :style="{width: tableWidth}">

          <hkm-sheet
            ref="left_top_sheet"
            table-type="left_top"
            @drag-end="dragEnd"
            @reset-width="resetWidth"
            @sort-click="handleSortClick"
            @context-menu="handleContextmenu"
            @cancel-focus="handleCancelFocus"
            @row-click="handleRowClick"
            @cell-click="handleCellClick"
            @confirm-edit="handleConfirmEdit"
            @toggle-selection="handleToggleSelection"
            @toggle-all-selection="handleToggleAllSelection"></hkm-sheet>

        </div>
      </div>

      <!-- 右边固定列 -->
      <div
        class="hkm-table__right-wrapper"
        :style="{
          width: rightTableStyle.width,
          height: rightTableStyle.height,
          right: rightTableStyle.right
        }"
        v-if="store.hasRightFixed && store.hasScrollLeft">
        <div
          class="hkm-table__right"
          :style="{
            left: rightTableStyle.left,
            top: `-${store.scrollBar.top}`,
            width: tableWidth
          }">

          <hkm-sheet
            ref="right_sheet"
            table-type="right"
            @drag-end="dragEnd"
            @reset-width="resetWidth"
            @sort-click="handleSortClick"
            @context-menu="handleContextmenu"
            @cancel-focus="handleCancelFocus"
            @cell-click="handleCellClick"
            @confirm-edit="handleConfirmEdit"
            @toggle-selection="handleToggleSelection"
            @toggle-all-selection="handleToggleAllSelection"></hkm-sheet>

        </div>
      </div>

      <!-- 右上角 -->
      <div
        class="hkm-table__right-top-wrapper"
        :style="{
          width: rightTableStyle.width,
          right: rightTableStyle.right
        }"
        v-if="store.hasRightFixed && store.hasScrollLeft">
        <div
          class="hkm-table__right-top"
          :style="{left: rightTableStyle.left, width: tableWidth}">

          <hkm-sheet
            ref="right_top_sheet"
            table-type="right_top"
            @drag-end="dragEnd"
            @reset-width="resetWidth"
            @sort-click="handleSortClick"
            @context-menu="handleContextmenu"
            @cancel-focus="handleCancelFocus"
            @cell-click="handleCellClick"
            @confirm-edit="handleConfirmEdit"
            @toggle-selection="handleToggleSelection"
            @toggle-all-selection="handleToggleAllSelection"></hkm-sheet>

        </div>
      </div>

      <div
        class="hkm-resize-proxy"
        :style="{left: store.resizeProxy.left}"
        v-show="store.resizeProxy.visiable"></div>

      <!-- 滚动条上 -->
      <div
        class="hkm-scroll-bar hkm-scroll-bar-top"
        v-show="store.hasScrollTop"
        @click="handleScrollTopClick">
        <div
          class="buoy"
          :style="{top: store.scrollBar.buoyTop, height: store.scrollBar.height}"
          @mousedown="handleTopBuoyMousedown"></div>
      </div>
      <!-- 滚动条下 -->
      <div
        class="hkm-scroll-bar hkm-scroll-bar-left"
        v-show="store.hasScrollLeft"
        @click="handleScrollLeftClick">
        <div
          class="buoy"
          :style="{left: store.scrollBar.buoyLeft, width: store.scrollBar.width}"
          @mousedown="handleLeftBuoyMousedown"></div>
      </div>
    </div>

    <hkm-context-menu
      ref="contextmenu"
      :config="contextmenuConfig"
      @menu-item-click="handleMenuItemClick"></hkm-context-menu>

  </div>
</template>

<script>
import HkmSheet from './sheet'
import HkmContextMenu from './context-menu'
import {
  flattern,
  matchesSelector,
  getDomIndex,
  copy,
  extendModel,
  sortByFixed,
  spanDefault,
  summaryDefault,
  addResizeListener,
  removeResizeListener,
  extendColumn,
  hasDefinedHeight
  } from '../../_utils'

let uid = 1;
let slice = Array.prototype.slice;
// 右键菜单处理回调
const METHOD_MAP = {
  'copy': function ({column, recordIndex}) {
    let record = this.store.records[recordIndex];

    copy(record[column.prop]);
  },

  'remove_row': function ({column, recordIndex}) {
    let records = this.store.records;
    let record = records[recordIndex];

    records.splice(recordIndex, 1);
    this.$emit('remove-row', extendColumn(column), record, 'remove_row');
  },

  'unfreeze_line': function ({column}) {
    let fixed = column.fixed;
    let columns = this.store.columns;

    columns.forEach(col => {
      if (col.fixed == fixed) {
        col.fixed = '';
      }
    })

    this.noticeLayout();
  },

  // 'freeze_line_left': function ({column}) {
  //   column.fixed = 'left';
  //   this.noticeLayout();
  // },

  // 'freeze_line_right': function ({column}) {
  //   column.fixed = 'right';
  //   this.noticeLayout();
  // },

  'freeze_line_left': function ({column}) {
    let columns = this.store.columns;

    columns.some(col => {
      col.fixed = 'left';

      if (col == column) {
        return true;
      }
    })

    this.noticeLayout();
  },

  'freeze_line_right': function ({column}) {
    let columns = this.store.columns;
    let i = columns.length;

    while (i--) {
      let col = columns[i];

      col.fixed = 'right';

      if (col == column) {
        break;
      }
    }

    this.noticeLayout();
  },

  'freeze_row': function ({recordIndex}) {
    let records = this.store.records;
    let record = records[recordIndex];
    let topRecords = this.store.topRecords;

    records.splice(recordIndex, 1);
    records.splice(topRecords.push(record) - 1, 0, record);
  },

  'unfreeze_row': function ({recordIndex}) {
    this.store.topRecords.splice(recordIndex, 1);
  },

  'copy_row_up': function ({recordIndex, column}) {
    let model = this.model;

    if (!model) {
      return;
    }

    let records = this.store.records;
    let record = records[recordIndex];

    let newVal = extendModel({}, record, model);

    if (!recordIndex) {
      records.unshift(newVal);
    } else {
      records.splice(recordIndex, 0, newVal);
    }

    this.$emit('insert-row', extendColumn(column), newVal, 'copy_row_up');
  },

  'copy_row_down': function ({recordIndex, column}) {
    let model = this.model;

    if (!model) {
      return;
    }

    let records = this.store.records;
    let record = records[recordIndex];

    let newVal = extendModel({}, record, model);

    if (recordIndex === records.length - 1) {
      records.push(newVal);
    } else {
      records.splice(recordIndex + 1, 0, newVal);
    }

    this.$emit('insert-row', extendColumn(column), newVal, 'copy_row_down');
  },

  'insert_row_up': function ({recordIndex, column}) {
    let model = this.model;

    if (!model) {
      return;
    }

    let records = this.store.records;
    let record = records[recordIndex];

    let newVal = extendModel({}, model, model);

    if (!recordIndex) {
      records.unshift(newVal);
    } else {
      records.splice(recordIndex, 0, newVal);
    }

    this.$emit('insert-row', extendColumn(column), newVal, 'insert_row_up');
  },

  'insert_row_down': function ({recordIndex, column}) {
    let model = this.model;

    if (!model) {
      return;
    }

    let records = this.store.records;
    let record = records[recordIndex];

    let newVal = extendModel({}, model, model);

    if (recordIndex === records.length - 1) {
      records.push(newVal);
    } else {
      records.splice(recordIndex + 1, 0, newVal);
    }

    this.$emit('insert-row', extendColumn(column), newVal, 'insert_row_down');
  },

  'append_row': function({column}) {
    let model = this.model;

    if (!model) {
      return;
    }

    let newVal = extendModel({}, model, model);

    this.store.records.push(newVal);

    this.$emit('insert-row', extendColumn(column), newVal, 'append_row');
  }
};

export default {
  name: 'HkmTable',

  props: {
    width: {
      type: [String, Number],
      default: ''
    },

    records: {
      type: Array,
      default () {
        return [];
      }
    },

    headContextmenu: {
      type: Array,
      default () {
        return [];
      }
    },

    bodyContextmenu: {
      type: Array,
      default () {
        return [];
      }
    },

    beforeAction: {
      type: Function,
      default: null
    },

    model: {
      type: Object,
      default: null
    },

    rowKey: {
      type: String,
      default: ''
    },

    showSummary: {
      type: Boolean,
      default: false,
    },

    summaryMethod: {
      type: Function,
      default: summaryDefault
    },

    summaryText: {
      type: String,
      default: '合计'
    },

    highLightCurrent: {
      type: Boolean,
      default: false
    },

    spanMethod: {
      type: Function,
      default: spanDefault
    },

    remark: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      layoutEnd: true,
      // 表格的实际宽高 初始化为 1px doLayout会重新计算宽高
      tableWidth: '1px',
      boxHeight: '1px',
      isRecordsSort: false,

      leftTableStyle: {height: '0px', width: '0px', top: '0px'},
      rightTableStyle: {height: '0px', width: '0px', top: '0px', right: '0px', left: '0px'},

      // 仓库 贯穿所有后代组件
      store: {
        rowKey: this.rowKey,
        remark: this.remark,
        summaryText: this.summaryText,
        showSummary: this.showSummary,
        summaryMethod: this.summaryMethod,
        spanMethod: this.spanMethod,
        highLightCurrent: this.highLightCurrent,

        records: this.records,

        headContextmenu: this.headContextmenu,
        bodyContextmenu: this.bodyContextmenu,

        noClick: false,

        hasScrollLeft: false,
        hasScrollTop: false,
        SCROLL_BAR_SIZE: 12,
        // 滚动条
        scrollBar: {
          width: '0px',
          height: '0px',
          left: '0px',
          top: '0px',
          buoyLeft: '0px',
          buoyTop: '0px'
        },
        // 左边固定列
        hasLeftFixed: false,
        // 右边固定列
        hasRightFixed: false,

        isAllSelected: false,
        selections: [],
        // 当前点击
        currentRecord: null,
        // 是否需要重新布局
        doLayout: 0,
        // 拖拽
        resizeProxy: {
          left: '0px',
          visiable: false
        },

        columns: [],
        // 上边固定行
        topRecords: []
      },

      // 右键
      contextmenuConfig: {
        show: false,
        left: '0px',
        top: '0px',
        items: []
      },

      currentContext: null
    };
  },

  watch: {
    'store.doLayout' () {
      if (!this.layoutEnd) {
        return;
      }

      this.layoutEnd = false;
      // 这个会后于mounted触发
      this.$nextTick(_ => {
        this.doLayout();
        this.layoutEnd = true;
      })

    },

    records (records) {
      let store = this.store;
      // 排序的 将不做更新
      if (this.isRecordsSort) {
        store.topRecords = [];
        this.isRecordsSort = false;
        return;
      }

      store.records = records;
      // 清空当前点击
      if (store.currentRecord && records.indexOf(store.currentRecord) === -1) {
        store.currentRecord = null;
      }

      // 清除掉之前不存在的数据
      let selections = store.selections;
      let i = selections.length;

      while (i--) {
        if (records.indexOf(selections[i]) === -1) {
          selections.splice(i, 1);
        }
      }
      // 全部选中才能是全选
      store.isAllSelected = !!records.length && records.length === selections.length;

      this.clearSort();

      this.noticeLayout();
    },

    headContextmenu (v) {
      this.store.headContextmenu = v;
    },

    bodyContextmenu (v) {
      this.store.bodyContextmenu = v;
    },

    highLightCurrent (v) {
      this.store.currentRecord = null;
      this.store.highLightCurrent = !!v;
    },

    summaryText (v) {
      this.store.summaryText = v;
    },

    showSummary (v) {
      this.store.showSummary = v;
    },

    summaryMethod (v) {
      this.store.summaryMethod = v;
    },

    spanMethod (v) {
      this.store.spanMethod = v;
    },

    remark (v) {
      this.store.remark = v;
    }
  },

  created () {
    this.tableUid = uid++;

    this.timeId = null;

    this.resize = () => {

      if (this.timeId) {
        clearTimeout(this.timeId);
      }
      // 避免多次计算
      this.timeId = setTimeout(() => {
        this.timeId = null;
        this.noticeLayout();
      }, 30);

    };

    this.handleDocClick = () => {
      this.hideContextMenu();

      let store = this.store;

      if (store.noClick) {
        store.noClick = false;
      }

    }
  },

  provide () {
    return { store: this.store };
  },

  mounted () {
    this.bindEvent();
  },

  methods: {
    noticeLayout () {
      this.store.doLayout++;
    },

    doLayout () {
      let wrapBound = this.getWrapBound();

      // 隐藏元素不做计算
      if (!wrapBound.width || !wrapBound.height) {
        return;
      }

      // console.log(`表格id: ${this.tableUid}, doLayout`);

      let propWidth = String(this.width).trim();
      let tableWidth = 0;
      let store = this.store;

      if (propWidth) {
        if (propWidth.slice(-1) == '%') {
          tableWidth = bound.width * propWidth.slice(0, -1) / 100;
        } else {
          tableWidth = parseInt(propWidth);
        }
      } else {
        tableWidth = wrapBound.width;
      }

      let columnsWidth = 0;
      let noWidthColumns = [];
      let columns = flattern(store.columns, 'children', column => column.isLeaf);

      columns.forEach(column => {

        if (!column.hasWidth) {
          // 重新分配
          column.width = column.minWidth;
          noWidthColumns.push(column);
        }

        columnsWidth += column.width;

      })

      if (tableWidth > columnsWidth) {
        // 此处 对于自动适应的做平均分配
        if (noWidthColumns.length) {
          // 平均分
          let average = (tableWidth - columnsWidth) / noWidthColumns.length;

          noWidthColumns.forEach(column => {
            column.width = column.minWidth + average;
          })
        } else {
          tableWidth = columnsWidth;
        }
      } else {
        tableWidth = columnsWidth;
      }

      this.tableWidth = tableWidth + 'px';

      let scrollBar = store.scrollBar;
      let masterBound = this.getMasterBound();

      let boxHeight = masterBound.height;
      let hasDefHeight = hasDefinedHeight(this.$refs.wrap);

      // 如果没有定义高度
      if (!hasDefHeight) {
        // 自适应高度 当然没有竖向滚动条
        store.hasScrollTop = false;
        // 横向滚动条 直接比较
        store.hasScrollLeft = tableWidth > wrapBound.width;

        boxHeight += (store.hasScrollLeft ? store.SCROLL_BAR_SIZE : 0);
      } else {
        // 判断是否存在横竖滚动条
        store.hasScrollTop = boxHeight > wrapBound.height;
        store.hasScrollLeft = tableWidth > wrapBound.width;

        // 如果涉及到滚动条 需要纠正
        if (store.hasScrollLeft && !store.hasScrollTop) {
          // 加上滚动条高度再判断一次
          store.hasScrollTop = (boxHeight + store.SCROLL_BAR_SIZE) > wrapBound.height;

          boxHeight += (store.hasScrollTop ? 0 : store.SCROLL_BAR_SIZE)
        }

        if (store.hasScrollTop && !store.hasScrollLeft) {
          store.hasScrollLeft = true;
        }
      }

      this.boxHeight = boxHeight + 'px';

      this.adjustScrollbar(wrapBound, masterBound);

      let leftColumns = store.columns.filter(column => column.fixed === 'left');

      store.hasLeftFixed = !!leftColumns.length;

      if (store.hasLeftFixed && store.hasScrollLeft) {
        leftColumns = flattern(leftColumns, 'children', column => column.isLeaf);

        let colsWidth = this.calculateColumnsWidth(leftColumns);
        let style = this.leftTableStyle;

        style.width = colsWidth + 'px';
        style.height = wrapBound.height + 'px';
      }

      let rightColumns = store.columns.filter(column => column.fixed === 'right');

      store.hasRightFixed = !!rightColumns.length;

      if (store.hasRightFixed && store.hasScrollLeft) {
        rightColumns = flattern(rightColumns, 'children', column => column.isLeaf);

        let colsWidth = this.calculateColumnsWidth(rightColumns);
        let style = this.rightTableStyle;

        style.width = colsWidth + 'px';
        style.height = wrapBound.height + 'px';
        style.left = colsWidth - tableWidth + 'px';
        style.right = (store.hasScrollTop ? store.SCROLL_BAR_SIZE : 0) + 'px';
      }

    },

    calculateColumnsWidth (columns) {
      let columnsWidth = 0;

      columns.forEach(column => {

        columnsWidth += column.width;
      })

      return columnsWidth;
    },

    bindEvent () {

      addResizeListener(this.$refs.wrap, this.resize);

      document.addEventListener('click', this.handleDocClick);

    },

    dragEnd ({ column, delta }) {

      column.width += delta;
      // 已经拖拽过的 就当用户重新设置了
      column.hasWidth = true;

      this.noticeLayout();
    },

    resetWidth (column) {
      if (column.originalWidth) {
        column.width = column.originalWidth;
      } else {
        // 重新设置 分配余额
        column.hasWidth = false;
      }

      this.noticeLayout();
    },

    clearSort () {
      let store = this.store;

      flattern(store.columns, 'children', column => {

        column.sortOrder = '';

        return false;
      })
    },

    handleSortClick ({ sortOrder, column }) {
      if (column.sortOrder == sortOrder) {
        return;
      }

      let store = this.store;

      this.clearSort();

      column.sortOrder = sortOrder;

      let prop = column.prop;
      let less = sortOrder === 'asc' ? -1 : 1;
      let greater = sortOrder === 'asc' ? 1 : -1;

      this.isRecordsSort = true;

      store.records.sort((a, b) => {
        return a[prop] > b[prop] ? greater : less;
      })
    },

    getWrapBound () {
      return this.$refs.wrap.getBoundingClientRect();
    },

    getMasterBound () {
      return this.$refs.master.getBoundingClientRect();
    },

    handleScroll () {
      let scrollBar = this.store.scrollBar;

      this.$emit('scroll', {scrollLeft: parseFloat(scrollBar.left), scrollTop: parseFloat(scrollBar.top)});
    },

    adjustScrollbar (wrapBound, masterBound) {
      let store = this.store;
      let scrollBar = store.scrollBar;

      if (store.hasScrollTop) {
        let size = masterBound.height;
        let height = wrapBound.height;

        size += (store.hasScrollLeft ? store.SCROLL_BAR_SIZE : 0);

        scrollBar.height = height / size * height + 'px';

        this.setBuoyTop(scrollBar.buoyTop, wrapBound, masterBound);
      } else {
        // 如果不存在的话 之前有拖动的 要重置回来
        scrollBar.buoyTop = '0px';
        scrollBar.top = '0px';
      }

      if (store.hasScrollLeft) {
        let size = parseFloat(this.tableWidth);
        let width = wrapBound.width;

        size += (store.hasScrollTop ? store.SCROLL_BAR_SIZE : 0);

        scrollBar.width = width / size * width + 'px';

        this.setBuoyLeft(scrollBar.buoyLeft, wrapBound);
      } else {
        // 如果不存在的话 之前有拖动的 要重置回来
        scrollBar.buoyLeft = '0px';
        scrollBar.left = '0px';
      }
    },

    setBuoyTop (buoyTop, wrapBound, masterBound) {
      let store = this.store;
      let scrollBar = store.scrollBar;
      let barHeight = parseFloat(scrollBar.height);

      wrapBound = wrapBound || this.getWrapBound();
      masterBound = masterBound || this.getMasterBound();

      let maxTop = wrapBound.height - barHeight;

      buoyTop = Math.max(0, Math.min(maxTop, parseFloat(buoyTop)));

      let size = masterBound.height;
      let height = wrapBound.height;

      size += (store.hasScrollLeft ? store.SCROLL_BAR_SIZE : 0);

      let scrollTop = buoyTop / height * size;

      scrollBar.buoyTop = buoyTop + 'px';
      scrollBar.top = scrollTop + 'px';

      this.handleScroll();
    },

    setScrollTop (scrollTop) {
      let store = this.store;

      if (!store.hasScrollTop) {
        return;
      }

      let scrollBar = store.scrollBar;
      let wrapBound = this.getWrapBound();
      let masterBound = this.getMasterBound();

      let maxScrollTop = masterBound.height - wrapBound.height;

      maxScrollTop += (store.hasScrollLeft ? store.SCROLL_BAR_SIZE : 0);

      scrollTop = Math.max(0, Math.min(maxScrollTop, scrollTop));

      let height = wrapBound.height;
      let size = masterBound.height;

      let buoyTop = scrollTop / size * height;

      scrollBar.buoyTop = buoyTop + 'px';
      scrollBar.top = scrollTop + 'px';

      this.handleScroll();
    },

    setBuoyLeft (buoyLeft, wrapBound) {
      let store = this.store;
      let scrollBar = this.store.scrollBar;

      wrapBound = wrapBound || this.getWrapBound();

      let width = wrapBound.width;
      let barWidth = parseFloat(scrollBar.width);
      let size = parseFloat(this.tableWidth);
      let maxLeft = wrapBound.width - barWidth;

      buoyLeft = Math.max(0, Math.min(maxLeft, parseFloat(buoyLeft)));

      size += (store.hasScrollTop ? store.SCROLL_BAR_SIZE : 0);

      let scrollLeft = buoyLeft / width * size;

      scrollBar.buoyLeft = buoyLeft + 'px';
      scrollBar.left = scrollLeft + 'px';

      this.handleScroll();
    },

    setScrollLeft (scrollLeft) {
      let store = this.store;

      if (!store.hasScrollLeft) {
        return;
      }

      let scrollBar = store.scrollBar;
      let wrapBound = this.getWrapBound();
      let width = wrapBound.width;
      let size = parseFloat(this.tableWidth);
      let maxScrollLeft = tableWidth - wrapBound.width;

      scrollLeft = Math.max(0, Math.min(maxScrollLeft, scrollLeft));

      size += (store.hasScrollTop ? store.SCROLL_BAR_SIZE : 0);

      let buoyLeft = scrollLeft / size * width;

      scrollBar.buoyLeft = buoyLeft + 'px';
      scrollBar.left = scrollLeft + 'px';

      this.handleScroll();
    },

    handleMousewheel (e) {
      let store = this.store;

      if (!store.hasScrollTop) {
        return;
      }

      e.preventDefault();

      let wheelDelta = e.wheelDelta;

      if (wheelDelta === undefined) {
        wheelDelta = e.detail * -40;
      }

      let scrollBar = store.scrollBar;
      let buoyTop = parseFloat(scrollBar.buoyTop);
      let deltaTop = 12;
      let delta = -wheelDelta / 120;

      buoyTop += deltaTop * delta;

      this.setBuoyTop(buoyTop);
    },

    handleTopBuoyMousedown (e) {
      this.store.noClick = true;

      let y = e.clientY;
      let scrollBar = this.store.scrollBar;
      let startY = parseFloat(scrollBar.buoyTop);
      let wrapBound = this.getWrapBound();
      let masterBound = this.getMasterBound();

      let move = ev => {
        let buoyTop = startY + (ev.clientY - y);

        window.getSelection().removeAllRanges();

        this.setBuoyTop(buoyTop, wrapBound, masterBound);
      }

      let up = ev => {
        document.removeEventListener('mouseup', up);
        document.removeEventListener('mousemove', move);
      }

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },

    handleScrollTopClick (e) {
      if (this.store.noClick) {
        return;
      }

      this.store.noClick = true;

      let scrollBar = this.store.scrollBar;
      let barHeight = parseInt(scrollBar.height);
      let wrapBound = this.getWrapBound();
      let buoyTop = e.clientY - wrapBound.top - barHeight / 2;

      this.setBuoyTop(buoyTop, wrapBound);
    },

    handleLeftBuoyMousedown (e) {
      this.store.noClick = true;

      let x = e.clientX;
      let scrollBar = this.store.scrollBar;
      let startX = parseInt(scrollBar.buoyLeft);

      let move = ev => {
        let buoyLeft = startX + (ev.clientX - x);

        window.getSelection().removeAllRanges();

        this.setBuoyLeft(buoyLeft);
      }

      let up = ev => {
        document.removeEventListener('mouseup', up);
        document.removeEventListener('mousemove', move);
      }

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },

    handleScrollLeftClick (e) {
      if (this.store.noClick) {
        return;
      }

      this.store.noClick = true;

      let scrollBar = this.store.scrollBar;
      let barWidth = parseInt(scrollBar.width);
      let wrapBound = this.getWrapBound();
      let buoyLeft = e.clientX - wrapBound.left - barWidth / 2;

      this.setBuoyLeft(buoyLeft, wrapBound);
    },

    hideContextMenu () {
      this.currentContext = null;
      this.contextmenuConfig.show = false;
    },

    showContextMenu (x, y, menuItems) {

      let config = this.contextmenuConfig;

      config.show = true;

      let top = y + 10;
      let left = x + 10;

      config.top = top + 'px';
      config.left = left + 'px';
      config.menuItems = menuItems;
      // 重置一下 有可能飘出来了
      this.$nextTick(_ => {
        let w = window.innerWidth;
        let h = window.innerHeight;
        let dom = this.$refs.contextmenu.$el;
        let bound = dom.getBoundingClientRect();

        if (bound.bottom > h) {
          config.top = y - bound.height + 'px';
        }

        if (bound.right > w) {
          config.left = x - bound.width + 'px';
        }
      })
    },

    handleMenuItemClick (type) {
      let next = () => {
        METHOD_MAP[type] && METHOD_MAP[type].call(this, this.currentContext);
      }

      if (this.beforeAction) {
        this.beforeAction(type, next);
      } else {
        next();
      }
    },

    handleContextmenu (context) {
      if (
        (context.source === 'thead' && !this.headContextmenu.length) ||
        (context.source === 'tbody' && !this.bodyContextmenu.length) ||
        !context.menuItems.length
      ) {
        return this.hideContextMenu();
      }

      this.showContextMenu(context.x, context.y, context.menuItems);

      delete context.menuItems;
      delete context.x;
      delete context.y;

      this.currentContext = context;
    },

    handleCancelFocus (current) {
      let refs = ['master', 'top', 'left', 'left_top', 'right', 'right_top'];

      refs.forEach(ref => {
        let child = this.$refs[ref + '_sheet'];

        if (child && child != current) {
          child.handleDocClick();
        }
      })
    },

    handleRowClick ({record, e}) {

      this.$emit('row-click', record, e);
    },

    handleCellClick ({column, record, e}) {
      let col = extendColumn(column);

      this.$emit('cell-click', column, record, e);
    },

    handleToggleSelection (record) {
      let selections = this.getSelectedRows();

      this.$emit('select', selections, record)
    },

    handleToggleAllSelection () {
      let selections = this.getSelectedRows();

      this.$emit('select-all', selections)
    },

    handleConfirmEdit ({column, record}) {
      let col = extendColumn(column);

      this.$emit('confirm-edit', col, record);
    },

    // 对外api
    getColumns () {
      let get = (columns) => {
        let list = [];

        columns.forEach(column => {
          let v = extendColumn(column);

          if (column.children && column.children.length) {
            v.children = get(column.children);
          }

          list.push(v);
        })

        return list;
      }

      return get(sortByFixed(this.store.columns));
    },

    setCurrentRow (record, checked) {
      let store = this.store;
      let records = store.records;
      // 不存在的不管
      if (records.indexOf(record) === -1) {
        return;
      }

      let selections = store.selections;
      let index = selections.indexOf(record);

      checked = !!checked;

      if (checked) {
        if (index === -1) {
          selections.push(record);
        }
      } else {
        if (index >= 0) {
          selections.splice(index, 1);
        }
      }

      store.isAllSelected = records.length && selections.length === records.length;

    },

    getSelectedRows () {
      return this.store.selections.slice();
    }
  },

  beforeDestroy () {
    if (this.timeId) {
      clearTimeout(this.timeId);
      this.timeId = null;
    }

    removeResizeListener(this.$refs.wrap, this.resize);

    document.removeEventListener('click', this.handleDocClick);
  },

  components: {
    HkmContextMenu,
    HkmSheet
  }
}
</script>

<style lang="scss">
@import '../../_assets/scss/variable.scss';

.hkm-table-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // user-select: none;
  overflow: hidden;
  z-index: 1;
}

.hkm-table-box {
  position: relative;
  width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.hkm-table__master-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.hkm-hidden-columns {
  position: absolute;
  z-index: -1;
  visibility: hidden;
}

.hkm-table__top-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  overflow: hidden;
  width: 100%;
}

.hkm-table__left-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  overflow: hidden;
  // border-right: 1px solid $border-color;
  border-right: 1px solid #000;
}

.hkm-table__left-top-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 4;
  overflow: hidden;
}

.hkm-table__right-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 3;
  overflow: hidden;
}

.hkm-table__right-top-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 4;
  overflow: hidden;
}

.hkm-table__master,
.hkm-table__top,
.hkm-table__left,
.hkm-table__left-top,
.hkm-table__right,
.hkm-table__right-top {
  position: relative;
}

.hkm-resize-proxy {
  position: absolute;
  z-index: 99;
  height: 100%;
  border-left: 1px dashed #ccc;
  top: 0;
  left: 100px;
}

.hkm-edit-proxy {
  position: absolute;
  z-index: 10;

  textarea {
    display: block;
    width: 100%;
    height: 100%;
    resize: none;
    border: 2px solid $main-color;
    font-size: 14px;
    font-family: inherit;
    box-sizing: border-box;
    outline: none;
  }
}

$scroll-bar-size: 12px;

.hkm-scroll-bar {
  position: absolute;
  z-index: 100;
  background: #DAE3F0;
  cursor: pointer;

  .buoy {
    position: absolute;
    background: #a3aebd;
    border-radius: $scroll-bar-size;
    cursor: pointer;
  }
}

.hkm-scroll-bar-top {
  top: 0;
  right: 0;
  width: $scroll-bar-size;
  height: 100%;

  .buoy {
    width: 100%;
    height: 50%;
  }
}

.hkm-scroll-bar-left {
  bottom: 0;
  left: 0;
  width: 100%;
  height: $scroll-bar-size;

  .buoy {
    width: 50%;
    height: 100%;
  }
}



</style>

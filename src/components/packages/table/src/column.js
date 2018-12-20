import { getJsonValue, extendColumn } from '../../_utils'

let uid = 1;
let indexOf = Array.prototype.indexOf;

const STRATS = {
  index: {
    renderHeader (h, { column }) {
      return column.label;
    },

    renderCell (h, { index }) {
      return index + 1;
    }
  },

  selection: {
    renderHeader (h, { column, context }) {

      if (column.isSingle) {
        return null;
      }

      return (
        <hkm-checkbox
          value={ context.isAllSelected }
          onClick={ context.toggleAllSelection } />    
      );
    },

    renderCell (h, { column, context, record, rowspan, colspan }) {
      return (
        <hkm-checkbox 
          onClick={ () => context.toggleSelection({column, record, rowspan, colspan}) } 
          value={ context.isSelected(record) }/>
      );
    }   
  },

  normal: {
    renderHeader (h, { column }) {
      return column.label;
    },

    renderCell (h, { column, record, context }) {

      if (context.$scopedSlots.default) {
        return context.$scopedSlots.default({
          row: record,
          column: extendColumn(column)
        });
      }

      return context.prop ? getJsonValue(record, context.prop) : '';
    }
  }
};

const RESIZEPROXY = function (h, { column, context }) {
  if (!column.resizable || !column.isLeaf) {
    return null;
  }

  return (
    <div
      class="resize-proxy"
      onMousedown={e => context.handleDown(e, column)}></div>
  );
}

const SORTPROXY = function (h, { column, context }) {
  if (column.type === 'selection' || column.type === 'index' || !column.sortable || !column.prop || !column.isLeaf) {
    return null;
  }

  return (
    <div 
      class="sort-caret-wrapper">
      <span 
        class={ column.sortOrder == 'asc' ? 'sort-caret asc active' : 'sort-caret asc' }
        onClick={ e => context.handleSortClick(e, 'asc', column) }></span>
      <span 
        class={ column.sortOrder == 'desc' ? 'sort-caret desc active' : 'sort-caret desc' }
        onClick={ e => context.handleSortClick(e, 'desc', column) }></span>
    </div>
  )
}

export default {
  name: 'HkmTableColumn',
  inject: ['store'],
  
  props: {
    label: {
      type: [String, Number],
      default: ''
    },

    prop: {
      type: [String, Number],
      default: ''
    },

    width: {
      type: [String, Number]
    },

    fixed: {
      validator: function (value) {
        return ['left', 'right', ''].indexOf(value) !== -1
      },

      default: ''
    },

    isSingle: {
      type: Boolean,
      default: false
    },

    resizable: {
      type: Boolean,
      default: true
    },

    minWidth: {
      type: [String, Number]
    },

    type: {
      type: String,
      default: 'normal'
    },

    sortable: {
      type: Boolean,
      default: false
    },

    editable: {
      type: Boolean,
      default: false
    },

    draggale: {
      type: Boolean,
      default: true
    },

    align: {
      type: String,
      default: 'center'
    },

    headerAlign: {
      type: String,
      default: 'center'
    },

    headerCellClassName: {
      type: String,
      default: ''
    },

    cellClassName: {
      type: String,
      default: ''
    }
  },

  watch: {
    label (newVal) {
      this.columnConfig.label = newVal;
    },

    prop (newVal) {
      this.columnConfig.prop = newVal;

      this.noticeLayout();
    },
    // 这里需要触发布局
    width (newVal) {
      newVal = parseInt(newVal);
      newVal = isNaN(newVal) ? 0 : newVal;

      let config = this.columnConfig;

      config.width = newVal;
      config.hasWidth = !!newVal;
      config.originalWidth = newVal;

      this.noticeLayout();
    },

    fixed (newVal) {
      this.columnConfig.fixed = newVal;

      this.noticeLayout();
    },

    resizable (newVal) {
      this.columnConfig.resizable = newVal;
    },
    // 这里也需要触发布局
    minWidth (newVal) {
      newVal = parseInt(newVal);
      newVal = isNaN(newVal) ? 20 : newVal;

      this.columnConfig.minWidth = newVal;

      this.noticeLayout();
    },

    isSingle (newVal) {
      this.columnConfig.isSingle = newVal;
    },

    sortable (newVal) {
      this.columnConfig.sortable = newVal;
    },

    editable (newVal) {
      this.columnConfig.editable = newVal;
    },

    draggable (newVal) {
      this.columnConfig.draggable = newVal;
    },

    align (newVal) {
      this.columnConfig.align = newVal;
    },
    
    headerAlign (newVal) {
      this.columnConfig.headerAlign = newVal;
    },
    
    headerCellClassName (newVal) {
      this.columnConfig.headerCellClassName = newVal;
    },

    cellClassName (newVal) {
      this.columnConfig.cellClassName = newVal;
    }
  },

  methods: {
    getLevel () {
      let level = 1;
      let owner = this;

      while (owner && owner.$parent && owner.$parent.columnUid) {
        level++;
        owner = owner.$parent;
      }

      return level;
    },

    getOwner () {
      let owner = this;

      while (owner && owner.$parent && owner.$parent.columnUid) {
        owner = owner.$parent;
      }

      return owner;      
    },

    noticeLayout () {
      this.store.doLayout = ++this.store.doLayout;
    }
  },

  created () {
    this.columnUid = uid++;
    this.$options.render = h => h('div', this.$slots.default);

    let parent = this.$parent;
    let level = this.getLevel();
    let minWidth = parseInt(this.minWidth);
    let width = parseInt(this.width);

    minWidth = isNaN(minWidth) ? 20 : minWidth;
    width = isNaN(width) ? 0 : width;

    let config = {
      context: this,
      type: this.type,
      prop: this.prop,
      label: this.label,
      sortOrder: '',
      sortable: this.sortable,
      resizable: this.resizable,
      editable: this.editable,
      draggable: this.draggable,
      align: this.align,
      isSingle: this.isSingle,
      headerAlign: this.headerAlign,
      headerRowClassName: this.headerRowClassName,
      headerCellClassName: this.headerCellClassName,
      cellClassName: this.cellClassName,
      rowClassName: this.rowClassName,
      width: width ? width : minWidth,
      // 此处 当用户拖拽过或者定义的 都为true 此后不进行额外的宽度分配
      hasWidth: !!width,
      // 初始值 用于双击还原
      originalWidth: width,
      minWidth: minWidth,
      fixed: this.fixed,
      uid: this.columnUid,
      ouid: this.getOwner().columnUid,
      puid: (parent && parent.columnUid) ? parent.columnUid : 0,
      // 是否为叶子节点
      isLeaf: !this.$slots.default,     
      
      colspan: 1,
      rowspan: 1,

      // 所处层级
      level: level,
      rowIndex: level - 1,
      isSubColumn: level > 1,

      renderResizeProxy: RESIZEPROXY,
      renderSortProxy: SORTPROXY
    };

    let renderMethod = STRATS[config.type];

    config.renderHeader = renderMethod.renderHeader;
    config.renderCell = renderMethod.renderCell;

    this.columnConfig = config;

  },

  beforeDestroy () {
    // 会出现v-if的情况
    let store = this.store;
    let config = this.columnConfig;

    function remove (columns, column) {
      let index = columns.indexOf(column);

      if (index > -1) {
        columns.splice(index, 1);
        return true;
      }

      return columns.some(col => {
        if (!col.children) {
          return false;
        }

        return remove(col.children, column);
      })
    }

    remove(store.columns, config);

    this.noticeLayout();
  },

  mounted () {
    let store = this.store;
    let columns = store.columns;
    let config = this.columnConfig;
    let el = this.$el;
    let parent = this.$parent;
    let puid = config.puid;
    let columnIndex = indexOf.call(el.parentNode.children, el);

    if (puid) {
      if (!parent.columnConfig.children) {
        parent.columnConfig.children = [config];
      } else {
        parent.columnConfig.children.splice(columnIndex, 0, config);
      }
    } else {
      columns.splice(columnIndex, 0, config);
    } 
    
    this.noticeLayout();
  }
}
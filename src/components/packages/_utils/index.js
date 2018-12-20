import ResizeObserver from 'resize-observer-polyfill';
import extend from 'extend';

export function getJsonValue(json, path) {
  if (!path) {
    return json;
  }
  
  path = path.replace(/\[(\d+)\]/g, '.$1');

  let paths = path.split('.');

  for (var i = 0, len = paths.length; i < len; i++) {
    let p = paths[i];

    if (json[p] == null) {
      return '';
    }

    json = json[p];
  }

  return (json == null ? '' : json);  
}

let scrollBarWidth;

export function getScrollBarWidth () {
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
};

export function hasDefinedHeight(node) {
  let beforeHeight = node.getBoundingClientRect().height;

  node.style.boxSizing = 'border-box';
  node.style.paddingBottom = '1px';

  let nowHeight = node.getBoundingClientRect().height;

  node.style.paddingBottom = '';
  node.style.boxSizing = '';

  return beforeHeight === nowHeight;
}

export function flattern(array, prop, judgeFn, result) {
  result = result || [];

  array.forEach(item => {
    if (judgeFn) {
      judgeFn(item) && result.push(item);
    } else {
      result.push(item);
    }

    if (item[prop]) {
      flattern(item[prop], prop, judgeFn, result);
    }
  })

  return result;
}

export function sortByFixed (columns) {
  let lefts = [];
  let rights = [];
  let result = [];

  columns.forEach(column => {
    if (column.fixed === 'left') {
      lefts.push(column);
    } else if (column.fixed === 'right') {
      rights.push(column);
    } else {
      result.push(column);
    }
  })

  result = lefts.concat(result, rights);

  return result;
}

export function noop () {}

let matchSelector = null;

export function matchesSelector (target, selector) {
  if (!target || target.nodeType != 1) {
    return false;
  }

  if (!matchSelector) {
    matchSelector = target.matches || target.webkitMatchesSelector || target.mozMatchesSelector || target.msMatchesSelector;
  } 
  
  return matchSelector.call(target, selector);
}

export function compareDom (a, b) {

  if (a === b) {
    return 0;
  }

  let compare = a.compareDocumentPosition(b);

  return compare & 4 ? -1 : 1;  
}

export function getDomIndex(target) {
  let index = -1;

  while (target && target.nodeType === 1) {
    index++;
    target = target.previousElementSibling;
  } 

  return index;
}

export function copy(text) {
  var input = document.createElement('input');

  input.value = text;
  input.style.position = 'absolute';
  input.style.opacity = 0;
  input.style.left = '0px';
  input.style.top = '0px';
  document.body.appendChild(input);
  input.select(); // 选择对象
  document.execCommand("Copy"); // 执行浏览器复制命令  
  document.body.removeChild(input);

  input = null;
}

let _toString = Object.prototype.toString;

function isType(type) {
  return function (o) {
    return _toString.call(o) === '[object ' + type + ']';
  }
}

export let isArray = Array.isArray || isType('Array');
export let isObject = isType('Object');
export let isDate = isType('Date');

export function extendModel(to, from, model) {
  // 只复制对象
  if (!isObject(to) || !isObject(from) || !isObject(model)) {
    return to;
  }

  let keys = Object.keys(model);
  
  keys.forEach(key => {
    let fromVal = from[key];

    if (isArray(fromVal)) {
      to[key] = extend(true, [], fromVal);
    } else if (isObject(fromVal)) {
      to[key] = extend(true, {}, fromVal);
    } else if (isDate(fromVal)) {
      to[key] = new Date(fromVal.getDate());
    } else {
      to[key] = fromVal;
    }
  })

  return to;
}

export function isEmptyValue(v) {
  return v == null || v === '';
}

const resizeHandler = function (entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach(fn => {
        fn();
      });
    }
  }
};

export function addResizeListener(element, fn) {
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};

export function removeResizeListener(element, fn) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
};

export function summaryDefault(column, records) {
  if (column.type !== 'normal') {
    return '';
  }

  let sum = 0;
  let prop = column.prop;

  records.some(record => {
    sum += parseInt(record[prop]);

    return isNaN(sum);
  })

  return isNaN(sum) ? 'N/A' : sum;
}

export function spanDefault() {
  return {
    rowspan: 1,
    colspan: 1
  }
}

export function extendColumn(column) {
  if (!column) {
    return null;
  }
  
  return {
    prop: column.prop,
    label: column.label,
    type: column.type,
    width: column.width,
    fixed: column.fixed,
    resizable: column.resizable,
    minWidth: column.minWidth,
    sortable: column.sortable,
    editable: column.editable,
    align: column.align,
    isSingle: column.isSingle,
    headerAlign: column.headerAlign,
    headerRowClassName: column.headerRowClassName,
    headerCellClassName: column.headerCellClassName,
    cellClassName: column.cellClassName,
    rowClassName: column.rowClassName,
    draggable: column.draggable
  };  
}
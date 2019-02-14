// 日期格式化
export function formatDate(date, fmt) {
  if (!date) {
    return '';
  }

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// url参数获取
export function getQueryString(name) {
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
  if(r!=null)return  decodeURIComponent(r[2]); return null;
}

// 参数拼接
export function formatParams (params) {
  let ary = [];
  let keys = Object.keys(params);

  keys.forEach(key => {
    ary.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
  })

  return ary.join('&');
}

// 12345格式化为12,345.00
// 12345.6格式化为12,345.60
// 12345.67格式化为 12,345.67
// 只留两位小数
// formatMoney("12345.675910", 3)
export function formatMoney(s, n){
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(),
      r = s.split(".")[1],
      t = "";
  for(var i = 0; i < l.length; i ++ ){
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}

// 验证手机号 eg:  checkTel("13812345678")
export function checkTel(value){
  var re = /^1[3|4|5|7|8]\d{9}$/;//手机号码正则表达式
  return re.test(value);
}

//验证只能是英文或者数字 eg:  checkEngNum("123aaa")
export function checkEngNum(value){
  var re=/^[A-Za-z0-9]+$/;
  return re.test(value);
}

// 身份证正则表达式
export function checkIdCard(value){
  var re = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return re.test(value);
}

// 移除本地缓存
export function removeKey(key) {
  localStorage.removeItem(key);
}

// 获取本地缓存数据
export function getKey (key) {
  return localStorage.getItem(key) || '';
}

// 设置本地缓存
export function setKey (key,val) {
  localStorage.setItem(key, val);
}

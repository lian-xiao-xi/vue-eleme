function add() {
  var args = [].slice.call(arguments);
  return args.reduce((pre,cur) => (pre + cur));
}

/**
 * 用 ES6 的方 rest参数 重写上面的 add 方法
 * var add = (...args) => args.reduce((pre,cur) => (pre + cur));
 */ 

console.log(add(1,2,3,4));

function setStyle(ele, property, value) {
  if (typeof ele === 'string') {
    var ele = document.querySelector(ele);
  }
  if (typeof property === 'object') {
    for (var key in property) {
      if (property.hasOwnProperty(key)) {
        // ele.style[key] = property[key];
        // 上面注释掉的这句也可以用下面这句来替换掉
        setStyle(ele, key, property[key]);
      }
    }
  } else {
    ele.style[property] = value;
  }
}

setStyle('div', 'color', 'red');
setStyle('div', {
  'fontSize': '20px',
  'backgroundColor': '#ccc'
})
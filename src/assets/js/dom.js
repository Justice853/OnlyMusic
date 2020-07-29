export function addClass(el,className) {
    //第一个参数是dom对象，第二个是类名
    if(hasClass(el,className)){
        return
    }
    let newClass = el.className.split('')//先拆分成数组
    newClass.push(className)//将类名添加到ClassName中
    el.className=newClass.join('')//将类名变成字符串
  }

export function hasClass(el,className){
    //判断类名是否存在，前空格后空格或结束中间是类名，如果符合就存在类名
    let reg = new RegExp('(^|\\s)'+className+'(\\s|$)')
    return reg.test(el.className)
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  // 定义游览器前缀
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  // 遍历前缀，如果游览器支持的话，就返回对应 key
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  // 如果都不支持，那肯定是有问题的，返回 false
  return false
})()

export function getData(el,name,val) { //
    const prefix = "data-"//获取data-属性
    name = prefix + name
    if(val){//如果有就赋值，没有就直接返回
        return el.setAttribute(name,val);//设置name的属性值为val
    }
    else{
        return el.getAttribute(name)//获取name的属性值.
    }
 }

 export function prefixStyle (style) {
    if (vendor === false) {
      return false
    }
    // 如果 vendor 为标准，就不改变 style
    if (vendor === 'standard') {
      return style
    }
  
    // 否则返回 vender(也就是 webkit Moz O ms 中的一个) + 样式首字母大写
    // 例如：webkit + transform ---> webkitTransform
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
  }
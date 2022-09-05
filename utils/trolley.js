//
const set = (goods, number, type) => {
  var trolley = wx.getStorageSync('trolley') || {};
  if (trolley.hasOwnProperty(goods.id)) {
    switch (type) {
      case 'add':
        trolley[goods.id].number += number;
        break;
      case 'reduce':
        trolley[goods.id].number -= number;
        break;
      case 'update':
        trolley[goods.id].number = number;
        break;
      default:
        break;
    }
    if (type != 'reduce') {
      trolley[goods.id].select = true;
    }
    if (trolley[goods.id].number <= 0) {
      delete trolley[goods.id]
    }
  } else {
    if (type != 'reduce') {
      goods.number = number;
      goods.select = true;
      trolley[goods.id] = goods;
    }
  }
  wx.setStorageSync('trolley', trolley);
  return trolley
}

const select = ids => {
  var trolley = wx.getStorageSync('trolley') || {};
  for (const key in trolley) {
    if (trolley.hasOwnProperty(key)) {
      if (ids.indexOf(key) != -1) {
        trolley[key].select = true;
      } else {
        trolley[key].select = false;
      }
    }
  }
  wx.setStorageSync('trolley', trolley);
  return trolley
}

const selectAll = bool => {
  //bool（false）
  //从本地缓存中同步获取trolley
  var trolley = wx.getStorageSync('trolley') || {};
  //循环
  for (const key in trolley) {
    //判断key的名称是不是trolley对象的一个属性或对象
    if (trolley.hasOwnProperty(key)) {
      //
      trolley[key].select = bool;
    }
  }
  //数据存储在本地缓存中的trolley
  wx.setStorageSync('trolley', trolley);
  return trolley
}

module.exports = {
  set: set,
  select: select,
  selectAll: selectAll
}
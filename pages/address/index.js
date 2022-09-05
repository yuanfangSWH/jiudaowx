// pages/address/index.js
var app = getApp(),
    isHide = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    check: false
  },
  //地址方法
  loadData: function () {
    app.api('/wechat/address/get', null, (status, res) => {
      if (status) {
        res.data = res.data.map(item => {
          item.select = item.status;
          return item
        })
        this.setData({
          addressList: res.data
        })
      }
    })
  },
  
  //设为默认方法
  radioChange: function (e) {
    console.log(e);
    var index = e.detail.value;
    var temp = this.data.addressList.map((item, idx) => {
      if (idx == index) {
        item.select = true;
      } else {
        item.select = false;
      }
      return item  
    })
    var id = this.data.addressList[index].id;
    app.api('/wechat/address/setDefault?id=' + id, null, null);
    this.setData({
      addressList: temp
    })
  },

  onRadio: function (e) {
    this.setData({
      'check': !this.data.check
    })
  },
  //编辑地址
  editAddress: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/address/edit?id=' + id
    })
  },
  //删除地址
  deleteAddress: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.addressList[index].id;
    //显示模态对话框
    wx.showModal({
      title: '提示',
      content: '确认删除该地址?',
      //接口调用成功的回调函数
      success: res => {
        //判断用户点击了确定/取消
        if (res.confirm) {
          // 用户点击了确定 可以调用删除方法了
          app.api('/wechat/address/delete?id=' + id, null, (status, res) => {
            //判断status为false或true
            if (status) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              ////删除数据数组下对应的内容.避免调用拉取数据
              this.data.addressList.splice(index, 1);
              //重新赋值改变页面状态
              this.setData({
                addressList: this.data.addressList
              })
            }
          })
        }
      }
    })
  },
  newAddress: function () {
    wx.navigateTo({
      url: '/pages/address/edit'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },
  onShow: function () {
    if (isHide) {
      this.loadData();
      isHide = false;
    }
  },
  onHide: function() {
    isHide = true;    
  }
})
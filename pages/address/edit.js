// pages/address/edit.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressData: {
      remark: "",
      name: "",
      province: "广西省",
      city: "钦州市",
      area: "市区",
      stress: "",
      phone: "",
    }
  },
  //输入框值获取.赋值
  onInput: function (e) {
    var key = e.currentTarget.dataset.key;
    this.data.addressData[key] = e.detail.value;
    this.setData({
      addressData: this.data.addressData
    })
  },
  //保存地址方法
  save: function () {
    //验证收货人
    if (this.data.addressData.name.trim() == '') {
      return wx.showToast({
        title: '未填收货人',
        image: '/images/error.png'
      })
    }
    //验证手机号
    if (!/^1\d{10}$/g.test(this.data.addressData.phone)) {
      return wx.showToast({
        title: '手机号格式错误',
        image: '/images/error.png'
      })
    }
    //验证详细地址
    if (this.data.addressData.stress.trim() == '') {
      return wx.showToast({
        title: '未填详细地址',
        image: '/images/error.png'
      })
    }
    app.api('/wechat/address/save', this.data.addressData, (status, res) => {
      //判断status为false或true
      if (status) {
        wx.showToast({
          title: '保存成功!',
          icon: 'success'
        })
        setTimeout(() => {
          //返回到原页面
          wx.navigateBack();
        }, 1500);
      }
    }, 'POST')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      //获取我的地址
      app.api('/wechat/address/get?id=' + options.id, null, (status, res) => {
        if (status) {
          this.setData({
            addressData: res.data
          })
        }
      })
    }
  },
})
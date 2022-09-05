//app.js
App({
  onLaunch: function () {

  },
  api: function (url, formData, fn, method) {
    if (!this.globalData.openid) {
      return wx.showToast({
        title: '未登录',
        image: '/images/error.png'
      })
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    wx.request({
      url: 'https://jiudao.cmtspace.cn' + url,
      data: formData,
      method: method ? method : 'GET',
      header: {
        'openid': this.globalData.openid,
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        wx.hideLoading();
        if (res.data.code != 200) {
          typeof fn === 'function' && fn(false, res.data);
          wx.showToast({
            title: res.data.message || '服务器错误',
            image: '/images/error.png'
          })
        } else {
          typeof fn === 'function' && fn(true, res.data);
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器繁忙',
          image: '/images/error.png'
        })
      }
    })
  },
  saveUserInfo: function () {
    this.api('/wechat/user/save', this.globalData.userInfo, (status, data) => {
      if (status) {
        this.globalData.userInfo = data.data;
      }
      console.log(data);
    }, 'POST')
  },
  globalData: {
    userInfo: null
  }
})
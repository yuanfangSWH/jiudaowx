// pages/order/manage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [
      [],
      [],
      [],
      [],
      []
    ],
    pageIndex: 1,
    noMore: false,
    orderIndex: null,
    swiperIndex: 0,
    height: 500,
  },
  loadData: function () {
    app.api('/wechat/order/get', {
      index: this.data.pageIndex,
      type: this.data.swiperIndex,
      isAdmin: true
    }, (status, res) => {
      if (status) {
        var path = `orders[${this.data.swiperIndex}]`;
        if (this.data.pageIndex == 1) {
          wx.stopPullDownRefresh();
          this.setData({
            [path]: res.data,
            'noMore': false
          }, () => {
            this.justifyHeight(this.data.swiperIndex);
          })
        } else {
          this.setData({
            [path]: this.data.orders[this.data.swiperIndex].concat(res.data)
          }, () => {
            this.justifyHeight(this.data.swiperIndex);
          })
        }
        if (res.data.length < 10) {
          this.setData({
            'noMore': true
          });
        }
      }
    })
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/detail?id=' + id
    })
  },
  cancelOrder: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否取消该订单',
      success: res => {
        if (res.confirm) {
          app.api('/wechat/order/cancel', {
            id: this.data.orders[this.data.swiperIndex][index].id
          }, (status) => {
            if (status) {
              wx.showToast({
                title: '取消成功!',
                icon: 'success'
              })
            }
            var path = `orders[${this.data.swiperIndex}][${index}].status`;
            this.setData({
              [path]: 0
            });
          })
        }
      }
    })
  },
  justifyHeight: function (index) {
    console.log(index);
    wx.createSelectorQuery().selectAll('.getThisHeight').boundingClientRect(rects => {
      this.setData({
        'height': rects[index].height > this.data.windowHeight ? rects[index].height : this.data.windowHeight
      })
    }).exec()
  },
  onChange: function (e) {
    var index = e.detail.current;
    this.setData({
      swiperIndex: index,
      pageIndex: 1
    });
    this.loadData();
  },
  onNav: function (e) {
    var index = parseInt(e.target.dataset.index);
    this.setData({
      swiperIndex: index
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
    wx.getSystemInfo({
      success: res => {
        this.data.windowHeight = res.windowHeight - 75;
        this.setData({
          height: this.data.windowHeight
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.pageIndex = 1;
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.noMore) {
      this.data.pageIndex += 1;
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/order/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单数据
    orders: [
      [],
      [],
      [],
      [],
      []
    ],
    //页数
    pageIndex: 1,
    //判断
    noMore: false,
    //
    orderIndex: null,
    //
    visible: false,
    //
    actions: [{
        name: '货到付款',
        color: '#2d8cf0',
      },
      {
        name: '微信支付',
        color: '#19be6b'
      },
      {
        name: '取消'
      }
    ],
    //分类标识
    swiperIndex: 0,
    //高度
    height: 500,
    windowHeight : 0
  },
  //订单数据方法
  loadData: function () {
    app.api('/wechat/order/get', {
      //页数
      index: this.data.pageIndex,
      //分类条件
      type: this.data.swiperIndex
    }, (status, res) => {
      if (status) {
        //var path = orders[$分类标识]
        var path = `orders[${this.data.swiperIndex}]`;
        //页数如果等于1
        if (this.data.pageIndex == 1) {
          //停止当前页面下拉刷新。
          wx.stopPullDownRefresh();
          this.setData({
            //分类的数组储存数据
            [path]: res.data,
            'noMore': false
          }, () => {
            //带了分类标识到justifyHeight方法
            this.justifyHeight(this.data.swiperIndex);
          })
        } else {
          this.setData({
            //数据合拼
            [path]: this.data.orders[this.data.swiperIndex].concat(res.data)
          }, () => {
            //带了分类标识到justifyHeight方法
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
  //取消订单方法
  cancelOrder: function (e) {
    var index = e.currentTarget.dataset.index;
    //显示模态对话框
    wx.showModal({
      title: '提示',
      content: '是否取消该订单',
      success: res => {
        //判断用户点击了确认/取消
        if (res.confirm) {
          //取消订单
          app.api('/wechat/order/cancel', {
            id: this.data.orders[this.data.swiperIndex][index].id
          }, (status) => {
            //判断status为false或true
            if (status) {
              //显示消息提示框
              wx.showToast({
                title: '取消成功!',
                icon: 'success'
              })
              //改变数据数组内容的分类组.避免调用拉取数据
              var path = `orders[${this.data.swiperIndex}][${index}].status`;
              this.setData({
                [path]: 0
              });
            }
          })
        }
      }
    })
  },
  //删除订单方法
  deleteOrder: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.orders[this.data.swiperIndex][index].id;
    //显示模态对话框
    wx.showModal({
      title: '提示',
      content: '是否删除该订单',
      success: res => {
        //判断用户点击了确认/取消
        if (res.confirm) {
          app.api('/wechat/order/delete', {
            id: id
          }, (status) => {
            //判断status为false或true
            if (status) {
              //显示消息提示框
              wx.showToast({
                title: '删除成功!',
                icon: 'success'
              })
            }
            //删除数据数组下对应的内容.避免调用拉取数据
            this.data.orders[this.data.swiperIndex].splice(index, 1);          
            var path = `orders[${this.data.swiperIndex}]`;
            //重新赋值改变页面状态
            this.setData({
              [path]: this.data.orders[this.data.swiperIndex]
            });
          })
        }
      }
    })
  },
  pay: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[this.data.swiperIndex][index];
    console.log(order);
    if (order.pay_type != 1) {
      if (order.pay_type == 2) {
        this.payForOrder(index);
      } else {
        this.data.orderIndex = index;
        this.setData({
          visible: true
        })
      }
    }
  },
  handleClick: function (e) {
    var index = e.detail.index;
    var payTypePath = `orders[${this.data.swiperIndex}][${this.data.orderIndex}].pay_type`,
        orderId = this.data.orders[this.data.swiperIndex][this.data.orderIndex].id;
    if (index === 0) {
      app.api('/wechat/order/setPayType', {
        id: orderId,
        type: 1
      }, (status) => {
        if (status) {
          this.setData({
            [payTypePath]: 1
          });
        }
      })
    } else if (index === 1) {
      app.api('/wechat/order/setPayType', {
        id: orderId,
        type: 2
      }, (status, res) => {
        if (status) {
          this.setData({
            [payTypePath]: 2
          });
        }
      })
      this.payForOrder(this.data.orderIndex);
    }
    this.setData({
      visible: false
    });
  },
  payForOrder: function (index) {
    var order = this.data.orders[this.data.swiperIndex][index];
    app.api('/wechat/order/pay', {
      id: order.id
    }, (status, res) => {
      if (status) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.paySign,
          success: function () {
            var path = `orders[${this.data.swiperIndex}][${index}].status`;
            this.setData({
              [path]: 2
            });
            wx.showToast({
              title: '支付成功!',
              icon: 'success'
            });
          },
          fail: function () {
            wx.showToast({
              title: '支付失败!',
              image: '/images/error.png'
            })
          }
        })
      }
    })
  },

  //swiperIndex: 0,
  //height: 500,
  justifyHeight: function (index) {
    //接受分类标识index=swiperIndex
    console.log(index);
    //wx.createSelectorQuery() = 返回一个 SelectorQuery 对象实例。
    //.selectAll() = 在当前页面下选择匹配选择器 selector 的所有节点。selector类似于 CSS 的选择器
    //.boundingClientRect() = 添加节点的布局位置的查询请求。相对于显示区域，以像素为单位。
    //其功能类似于 DOM 的 getBoundingClientRect。返回 NodesRef 对应的 SelectorQuery。
    //.exec() = 执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回。
    wx.createSelectorQuery().selectAll('.getThisHeight').boundingClientRect(rects => {
      this.setData({
        'height': rects[index].height > this.data.windowHeight ? rects[index].height : this.data.windowHeight
      })
    }).exec()
  },

//这里处理tab事件
  onChange: function (e) {
    var index = e.detail.current;
    this.setData({
      //分类标识
      swiperIndex: index,
      //页数
      pageIndex: 1
    });
    this.loadData();
  },
   // 切换当前页tab样式
  onNav: function (e) {
    //parseInt()字符串转换为数字
    var index = parseInt(e.target.dataset.index);
    this.setData({
      swiperIndex: index
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用订单数据方法
    this.loadData();
    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        //this.data.高度= 高度-75
        this.data.windowHeight = res.windowHeight - 75;

        this.setData({
          //高度：this.data.高度
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
    //调用订单数据方法
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.noMore) {
      this.data.pageIndex += 1;
      //调用订单数据方法
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
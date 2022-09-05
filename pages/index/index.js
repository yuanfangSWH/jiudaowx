//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    isLogin: false,  //....
    inputShowed: false,  //判断改变样式值真假
    inputVal: "",  //搜索框值
    hotList: [],  //热销数据
    pageIndex: 1,  //判断是那一页
    noMore: false  //下拉判断依据值真假
  },
  //调用热销方法
  loadData: function () {
    //拉取数据
    app.api('/wechat/goods/index', {
      index: this.data.pageIndex  
    }, (status, res) => {
      if (status) {
        if (this.data.pageIndex == 1) {
          //停止当前页面下拉刷新
          wx.stopPullDownRefresh();
          //热销商品数据
          this.setData({
            'hotList': res.data,
            'noMore': false
          })
        } else {
          //否则什么都没有
          this.setData({
            'hotList': this.data.hotList.concat(res.data)
          })
        }
        if (res.data.length < 10) {
          //数据小于10就停止下拉方法的判断值真伪
          this.setData({
            'noMore': true
          });
        }
      }
    })
  },
  //改变样式
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  //点取消然后清空+变回初始样式
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  //X按钮清空
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  //监听输入变化
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //搜索方法
  onSearch: function (e) {
    wx.navigateTo({
      url: '/pages/goods/list?keyWord=' + this.data.inputVal
    })
  },
  //不明
  handleChange: function (e) {
    console.log(e);
  },
  //商品跳转
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail?id=' + id
    })
  },  
  //分类跳转
  goList: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/list?id=' + id
    })
  },
  //生命周期回调—监听页面加载
  onLoad: function () {
    // 登录
    wx.login({
      success: (res) => {
        if (res.code) {
          //发起网络请求，把信息带入后端接口返回数据
          wx.request({
            url: 'https://jiudao.cmtspace.cn/wechat/index/getOpenId',
            data: {
              code: res.code
            },
            success: res => {
              if (res.data.code != 200) {
                //显示消息提示框
                wx.showToast({
                  title: '登录失败',
                  image: '/images/error.png'
                })
              } else {
                //赋值给全局共用
                app.globalData.openid = res.data.data.openid;
                //调用热销方法
                this.loadData();
              }
            },
            fail: () => {
              //显示消息提示框
              wx.showToast({
                title: '服务器错误',
                image: '/images/error.png'
              })
            }
          })
        } else {
          //输出
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    if (!this.data.noMore) {
      this.data.pageIndex += 1;
       //调用热销方法
      this.loadData();
    }
  },
  //监听用户下拉动作
  onPullDownRefresh: function () {
    this.data.pageIndex = 1;
     //调用热销方法
    this.loadData();
  },
})
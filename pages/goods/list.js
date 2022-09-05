// pages/goods/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryId: '', //页面变量
    inputShowed: false,  //判断改变样式值真假
    inputVal: "", //搜索框值
    goodsList: [],  //商品数据
    pageIndex: 1, //第几页
    noMore: false,  //下拉判断依据值真假
    filter: '' //筛选条件
  },
  //拉取数据方法
  loadData: function (isFilter = false) {
    var method = isFilter ? 'filter' : 'byCategory';// 判断是不是筛选
    app.api('/wechat/goods/' + method, {
      id: this.data.categoryId, //分类条件变量
      type: this.data.filter, //筛选条件
      index: this.data.pageIndex //第几页
    }, (status, res) => {//status代表是否调用api成功, res是返回数据
      if (status) {
        if (this.data.pageIndex == 1) {
          //如果是第一页 可能是刚进来或者下拉刷新
          wx.stopPullDownRefresh();//停止下拉动画
          this.setData({
            'goodsList': res.data,
            'noMore': false
          })
        } else {
          // 不是第一页就直接将返回的数据和之前的合并
          this.setData({
            'goodsList': this.data.goodsList.concat(res.data)
          })
        }
        if (res.data.length < 10) {
          // 返回的数据小于10就肯定后面没有了  设置到底不加载
          this.setData({
            'noMore': true
          });
        }
      }
    })
  },
  //搜索关键字方法
  search: function (keyWord) {
    app.api('/wechat/goods/search', {
      keyWord: keyWord
    }, (status, res) => {
      if (status) {
        this.setData({
          'goodsList': res.data,
          'noMore': true
        })
      }
    })
  },
  //筛选条件方法
  changeFilter: function (e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      filter: type
    });
    //调用拉取数据方法
    this.loadData(true);
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
  //搜索方法
  onSearch: function () {
    //调用搜索关键字方法
    this.search(this.data.inputVal);
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {//判断接收过来的参数
      this.data.categoryId = options.id;// 将接收过来参数赋值到categoryId页面变量 方便以后调用
      //调用拉取数据方法
      this.loadData();
    }
    if (options.keyWord) {
    //调用搜索关键字方法
      this.search(options.keyWord);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉刷新  页面设置为1再去拉数据
    this.data.pageIndex = 1;
    //调用拉取数据方法
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 如果不是到底就继续加载
    if (!this.data.noMore) {
      this.data.pageIndex += 1;
      //调用拉取数据方法
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
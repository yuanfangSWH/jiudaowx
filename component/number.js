// component/number.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    number: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    down: function () {
      if (this.data.number > 1) {
        this.setData({number: this.data.number -= 1});
      } else {
        this.setData({number: 0});
      }
      this.onChange();
    },
    up: function () {
      if (this.data.number <= 0) {
        this.setData({number: 1});
      } else {
        this.setData({number: this.data.number += 1});
      }
      this.onChange();
    },
    onBlur: function (e) {
      this.data.number = parseInt(e.detail.value);
      this.onChange();
    },
    onInput: function (e) {
      this.data.number = parseInt(e.detail.value);
    },
    onChange: function () {
      this.data.number = this.data.number < 0 ? 1 : this.data.number;
      this.triggerEvent('change', this.data.number);
    }
  }
})

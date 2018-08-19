
App({
  onLaunch: function (options) {
    var that = this
    this.globalData.system_info = wx.getSystemInfoSync()
  



  },
   onShow:function (option) {
    
  },
  globalData: {
    userInfo: null,
    uploadImages:false,
    shenhe:new Date(2018, 4, 29) > new Date(),
  }
})
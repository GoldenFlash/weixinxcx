// var api = require('../../utils/')
Page({
	data:{

	},
	onLoad(){
		wx.request({
		  url: 'https://101.132.173.11:3000/artists?id=6452', //仅为示例，并非真实的接口地址
		  data: {
		  },
		  header: {
		  	'content-type': 'application/json' // 默认值
		  },
		  success: function(res) {
		    console.log(res.data)
		  }
		})
		
	}
})
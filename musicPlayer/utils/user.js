/**
 * Created by justin on 2018/5/13.
 */
import api from '../apis/user'
import * as http from './http'
import Cache from './cache'
import config from './config2'
import Event from './event'

class User {
  constructor () {
    this._sid = 0
    this._userId = 0
    this._openId = ''
    this._isLogin = false
    this._wxUserInfo = null
    this._userInfo = null
    this._localLoginStatus = 0
    this.cache = new Cache('state_user_', true)
    try {
      let session = this.cache.get('session')
      let userInfo = this.cache.get('userInfo')
      if (session) {
        this.loginWithSession(session)
      }
      if (userInfo) {
        this._userInfo = userInfo
      }
    } catch (e) {
      console.log(e)
    }
  }

  get sid () {
    return this._sid
  }

  set sid (value) {
    this._sid = value
  }

  get userId () {
    return this._userId
  }

  set userId (value) {
    this._userId = value
  }

  get openId () {
    return this._openId
  }

  set openId (value) {
    this._openId = value
  }

  get isLogin () {
    return this._isLogin && !!this._userId
  }

  set isLogin (value) {
    this._isLogin = value
  }

  get userInfo () {
    return this._userInfo
  }

  set userInfo (value) {
    this._userInfo = value
    this.cache.set('userInfo', value)
  }

  get wxUserInfo () {
    return this._wxUserInfo
  }

  get oldUserInfo () {
    const userInfo = this.userInfo
    return {
      openid: userInfo.user_id,
      user_name: userInfo.user_name,
      avatar: userInfo.user_avatar,
      unionid :userInfo.unionid,
      isVip: userInfo.isVip
    }
  }

  init (from_user_id) {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: () => {
          if (!this.sid) {
            this.localLogin(from_user_id).then(resolve, reject)
          } else {
            resolve()
          }
        },
        fail: () => {
          this.localLogin(from_user_id).then(resolve, reject)
        }
      })
    })
  }

  localLogin (from_user_id) {
    return new Promise((resolve, reject) => {
      if (this._localLoginStatus === 1) {
        resolve()
      } else {
        wx.login({
          success: (res) => {
            api.login({ code: res.code, old: 1, from_user_id: from_user_id }, (res) => {
              if (res.success) {
                this._localLoginStatus = 1
                const data = res.data
                data.userId = 0
                data.isLogin = 0
                if (data.userInfo) {
                  data.userId = data.userInfo.id
                  data.isLogin = true
                  this.userInfo = data.userInfo
                }
                this.loginWithSession(data)
                this.cacheSession()
                if (this.isLogin) {
                  Event.emit('user_login', {})
                }
              }
              resolve()
            }, reject)
          },
          fail: reject
        })
      }
    })
  }

  updateUserInfo (detail) {
    this._wxUserInfo = detail.userInfo
    return new Promise((resolve, reject) => {
      if (this.isLogin) {
        resolve()
      } else {
        const app = getApp()
        const scene = app.globalData.scene
        const referrerInfo = app.globalData.referrerInfo
        api.updateUserInfo({
          rawData: detail.rawData,
          signature: detail.signature,
          encryptedData: detail.encryptedData,
          iv: detail.iv,
          scene: scene || '',
          referrerInfo: referrerInfo || '{}'
        }, (res) => {
          if (res.success) {
            this.userId = res.data.userId
            this.isLogin = true
            this.userInfo = res.data.userInfo
            this.cacheSession()
            Event.emit('user_login', {})
            resolve()
          } else {
            reject(res)
          }
        }, reject)
      }
    })
  }

  loginWithSession (data) {
    if (data.hasOwnProperty('sid')) {
      this._sid = data.sid
    }
    if (data.hasOwnProperty('userId')) {
      this._userId = data.userId
    }
    if (data.hasOwnProperty('openId')) {
      this._openId = data.openId
    }
    if (data.hasOwnProperty('isLogin') && data.isLogin) {
      this._isLogin = true
    }
    http.setDefaultData({ sid: data.sid })
  }

  logout () {
    this.loginWithSession({
      sid: 0,
      userId: 0,
      isLogin: 0
    })
    this.cacheSession()
    return this
  }

  cacheSession () {
    let session = { sid: this.sid, openId: this.openId, userId: this.userId, isLogin: this.isLogin }
    this.cache.set('session', session)
  }
}

const user = new User()

export default user

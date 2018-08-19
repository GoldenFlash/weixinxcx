/**
 * Created by justin on 2018/5/13.
 */
import config from './config2'
import Event from './event'
import {
  MESSAGE_NETWORK_TIMEOUT,
  MESSAGE_API_PARSE_ERROR,
  MESSAGE_NETWORK_NOT_AVAILABLE
} from './config2'

let defaultData = {}

export const request = (method = 'GET') => (url, data, formData = false) => {
  return new Promise((resolve, reject) => {
    let httpHeader = {
      'Content-Type': 'application/json'
    }
    if (method === 'POST' && !formData) {
      httpHeader['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    data = Object.assign(data, defaultData)
    if (config.debug) {
      data['debug'] = 1
    }
    wx.request({
      url,
      data,
      method,
      header: httpHeader,
      success: function (res) {
        if (res.statusCode === 200) {
          let result = res.data
          if (result.code === 200) {
            result.success = true
          }
          if (result.success) {
            resolve(result)
          } else {
            if (result.code === 203) {
              Event.emit('session_expired', {})
            }
            reject(result)
          }
        } else {
          reject({
            success: false,
            message: MESSAGE_API_PARSE_ERROR,
            error: res.data
          })
        }
      },
      fail: function (err) {
        wx.getNetworkType({
          complete: function (res) {
            if (res && res.networkType === 'none') {
              reject({
                success: false,
                message: MESSAGE_NETWORK_NOT_AVAILABLE,
                error: err
              })
            } else {
              reject({
                success: false,
                message: MESSAGE_NETWORK_TIMEOUT,
                error: err
              })
            }
          }
        })
      }
    })
  })
}

export const get = request('GET')
export const post = request('POST')
export const put = request('PUT')
export const del = request('DELETE')
export const setDefaultData = (obj) => {
  defaultData = obj
}

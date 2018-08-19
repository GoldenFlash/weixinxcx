/**
 * Created by justin on 2018/5/13.
 */
const cacheSign = '_appCache'
const unionCaches = {}

class Cache {
  constructor(prefix, syncStorage) {
    this.prefix = prefix || 'appCache_'
    this.syncStorage = syncStorage || false
  }

  get caches() {
    if (!unionCaches.hasOwnProperty(this.prefix)) {
      unionCaches[this.prefix] = {}
    }
    return unionCaches[this.prefix]
  }

  _getKey(key) {
    return this.prefix + key
  }

  _getValueFromObject(obj, checkMaxAge = true) {
    if (!obj) {
      return [obj, 0]
    }
    if (!obj.hasOwnProperty(cacheSign)) {
      return [obj, 0]
    }
    let expired = 0
    if (checkMaxAge && obj.maxAge > 0) {
      let timestamp = new Date().getTime()
      if (timestamp - obj.cacheTime >= obj.maxAge) {
        expired = 1
      }
    }
    return {
      value: obj.value,
      expired: expired
    }
  }

  get(key, checkMaxAge = true, checkStorage = null) {
    key = this._getKey(key)
    let value = null
    if (this.caches.hasOwnProperty(key)) {
      let data = this._getValueFromObject(this.caches[key], checkMaxAge)
      if (!data.expired) {
        value = data.value
      }
    } else {
      if ((checkStorage === null && this.syncStorage) || checkStorage) {
        let store = wx.getStorageSync(key)
        if (store) {
          let data = this._getValueFromObject(JSON.parse(store), checkMaxAge)
          if (!data.expired) {
            value = data.value
          }
        }
      }
    }
    return value
  }

  getAsync(key, checkMaxAge = true, checkStorage = null) {
    key = this._getKey(key)
    return new Promise((resolve, reject) => {
      if (this.caches.hasOwnProperty(key)) {
        let value = this._getValueFromObject(this.caches[key], checkMaxAge)
        if (!value.expired) {
          resolve(value.value)
        } else {
          reject(value)
        }
      } else {
        if ((checkStorage === null && this.syncStorage) || checkStorage) {
          wx.getStorage({
            key: key,
            success: (res) => {
              let data = JSON.parse(res.data)
              let value = this._getValueFromObject(data, checkMaxAge)
              if (!value.expired) {
                resolve(value.value)
              } else {
                reject(value)
              }
            },
            fail: reject
          })
        } else {
          reject(new Error('没有缓存!'))
        }
      }
    })
  }

  set(key, data, maxAge = 0, saveToStorage = null) {
    key = this._getKey(key)
    let timestamp = new Date().getTime()
    let storeData = {
      value: data,
      cacheTime: timestamp,
      maxAge: maxAge
    }
    storeData[cacheSign] = 1
    this.caches[key] = storeData
    if ((saveToStorage === null && this.syncStorage) || saveToStorage) {
      wx.setStorage({
        key: key,
        data: JSON.stringify(this.caches[key])
      })
    }
  }

  remove(key, syncStorage = null) {
    key = this._getKey(key)
    delete this.caches[key]
    if ((syncStorage === null && this.syncStorage) || syncStorage) {
      wx.removeStorage({
        key: key
      })
    }
  }
}

export default Cache

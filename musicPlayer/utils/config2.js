/**
 * Created by justin on 2018/5/13.
 */
const ENV_DEVELOPMENT = 'development'   // 开发环境
const ENV_TEST = 'test'                 // 测试环境
const ENV_PRODUCTION = 'production'     // 生产环境

const PRODUCTION_API_BASE_PATH = 'https://api.maiyizhi.cn/index.php'
const TEST_API_BASE_PATH = 'http://api.maiyizhi.me/index.php'
const DEVELOPMENT_API_BASE_PATH = 'http://api.maiyizhi.me/index.php'

const MESSAGE_NETWORK_TIMEOUT = '加载哥遇到瓶颈再来一遍嘛 <(￣︶￣)>'
const MESSAGE_API_PARSE_ERROR = '服务器姐姐出错勒~\(≧▽≦)/~~'
const MESSAGE_NETWORK_NOT_AVAILABLE = '网络兄弟罢工勒(*^__^*) '

let appId = 'jianxiu'
let appName = '简秀'
let debug = false
let appEnv = ENV_PRODUCTION  //切换环境
let apiBasePath = ''

let appVersion = '1.0'
let isAppEnvDev = appEnv === ENV_DEVELOPMENT
let isAppEnvTest = appEnv === ENV_TEST
let isAppEnvProd = appEnv === ENV_PRODUCTION

if (isAppEnvDev) {
  apiBasePath = DEVELOPMENT_API_BASE_PATH
} else if (isAppEnvTest) {
  apiBasePath = TEST_API_BASE_PATH
} else {
  apiBasePath = PRODUCTION_API_BASE_PATH
}

let apiPath = apiBasePath

export {
  MESSAGE_NETWORK_TIMEOUT,
  MESSAGE_API_PARSE_ERROR,
  MESSAGE_NETWORK_NOT_AVAILABLE
}

export default {
  appId,
  appName,
  appEnv,
  isAppEnvDev,
  isAppEnvTest,
  isAppEnvProd,
  debug,
  apiPath,
  appVersion
}

import fetch from '@/router/axios'
const scope = 'server'

/**
 * 通过用户名和密码登录，得到token
 * @param {用户名} username
 * @param {密码} password
 */
export function loginByUsername(username, password, code, randomStr) {
  const grant_type = 'password'

  return fetch({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'Authorization': 'Basic c2lub3RuOnNpbm90bg=='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}

/**
 * 刷新token
 * @param {*} refresh_token
 */
export function refreshToken(refresh_token) {
  const grant_type = 'refresh_token'
  return fetch({
    url: '/auth/oauth/token',
    headers: {
      'isToken': false,
      'Authorization': 'Basic c2lub3RuOnNpbm90bg=='
    },
    method: 'post',
    params: { refresh_token, grant_type, scope }
  })
}

/**
 * 通过token获取用户信息
 * @param {token} token
 */
export function getUserInfo(token) {
  return fetch({
    url: '/admin/user/info',
    method: 'get'
  })
}

/**
 * 退出登录
 * @param {token} token
 */
export function logout() {
  return fetch({
    url: '/auth/oauth/removeToken',
    method: 'get'
  })
}

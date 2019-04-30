import fetch from '@/router/axios'

/**
 * 查询在线登录终端
 * @param {查询条件} query
 */
export function fetchList(query) {
  return fetch({
    url: '/admin/token/page',
    method: 'get',
    params: query
  })
}

/**
 * 强制删除终端
 * @param {token} token
 */
export function delObj(token) {
  return fetch({
    url: '/admin/token/' + token,
    method: 'delete'
  })
}
